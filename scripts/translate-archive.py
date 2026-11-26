"""Build static reading editions using local Argos model archives and the editorial index."""
import json
import re
import sys
import zipfile
from pathlib import Path
import ctranslate2
import sentencepiece
from opencc import OpenCC

work = Path(sys.argv[1])
root = Path(__file__).resolve().parents[1]
assets = root / "public" / "assets"
def read(path):
    return json.loads(path.read_text(encoding="utf-8"))

def save(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    draft = path.with_suffix(".tmp")
    draft.write_text(json.dumps(value, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    draft.replace(path)

def render(pair, texts):
    texts = list(dict.fromkeys(texts))
    cache = work / (pair + "-cache.json")
    result = read(cache) if cache.exists() else {}
    model = work / ("translate-" + pair + "-1_9")
    if not model.exists():
        with zipfile.ZipFile(work / (pair + ".zip")) as archive:
            archive.extractall(work)
    if (model / "sentencepiece.model").exists():
        sp = sentencepiece.SentencePieceProcessor(model_file=str(model / "sentencepiece.model"))
        encode = lambda s: sp.encode(s, out_type=str)
        decode = sp.decode
    else:
        from sacremoses import MosesTokenizer, MosesDetokenizer
        from subword_nmt.apply_bpe import BPE
        source, target = pair.split("_")
        tokenizer, detokenizer = MosesTokenizer(lang=source), MosesDetokenizer(lang=target)
        with (model / "bpe.model").open(encoding="utf-8") as codes:
            bpe = BPE(codes)
        encode = lambda s: bpe.process_line(tokenizer.tokenize(s, return_str=True)).split()
        decode = lambda tokens: detokenizer.detokenize(" ".join(tokens).replace("@@ ", "").split())
    engine = ctranslate2.Translator(str(model / "model"), device="cpu", compute_type="int8", inter_threads=2, intra_threads=4)
    todo = [v for v in texts if v and v not in result]
    for start in range(0, len(todo), 100):
        batch = todo[start:start + 100]
        pieces, owners = [], []
        for index, text in enumerate(batch):
            for sentence in re.split(r"(?<=[.!?])\s+(?=[A-Z0-9“‘\"])", text):
                tokens = encode(sentence)
                for pos in range(0, len(tokens), 152):
                    pieces.append(tokens[pos:pos+152])
                    owners.append(index)
        responses = engine.translate_batch(pieces, max_batch_size=512, batch_type="tokens", beam_size=2,
                                           max_input_length=160, max_decoding_length=256,
                                           repetition_penalty=1.1)
        parts = [[] for _ in batch]
        for i, response in zip(owners, responses):
            parts[i].append(decode(response.hypotheses[0]).replace("▁"," ").strip())
        for text, output in zip(batch, parts):
            translated = " ".join(output).strip()
            if not translated:
                raise ValueError("Empty translation: " + text[:40])
            result[text] = translated
        save(cache, result)
        print(pair, min(start+100, len(todo)), "/", len(todo), flush=True)
    return result

index = read(work / "sources.json")
native = {}
for article in index["localArticles"]:
    origin = "en" if article.get("language") == "en" else "id"
    for field in ("title", "subtitle", "summary"):
        if article.get(field):
            native[article[field]] = origin
    for section in article["sections"]:
        lang = "en" if section.get("heading") == "Indonesia in God’s Hands" else origin
        for text in [section.get("heading"), section.get("quote"), *section["paragraphs"]]:
            if text:
                native[text] = lang

archive = {}
for item in index["innOpinions"]:
    native[item["title"]] = "id"
    archive[item["slug"]] = read(assets / "opini" / (item["slug"] + ".json"))
all_id = [t for t, lang in native.items() if lang == "id"]
all_id += [b["text"] for story in archive.values() for b in story["blocks"]]
all_en = [t for t, lang in native.items() if lang == "en"]
en = render("id_en", all_id)
id_text = render("en_id", all_en)
chinese = render("en_zh", [*en.values(), *all_en])
traditional = OpenCC("s2twp")

for lang in ("id","en","zh-CN","zh-TW"):
    def localized(text):
        if lang == "id":
            return id_text.get(text,text)
        english = en.get(text,text)
        if lang == "en":
            return english
        simplified = chinese[english].replace("▁"," ").strip()
        return simplified if lang == "zh-CN" else traditional.convert(simplified)

    save(root / "src" / "features" / "editions" / (lang + ".json"),
         {s:localized(s) for s in native if lang != "id" or native[s] == "en"})
    if lang != "id":
        for slug, story in archive.items():
            save(assets / "opini" / lang / (slug+".json"), {
                **story, "language":lang,
                "blocks":[{**block,"text":localized(block["text"])} for block in story["blocks"]]
            })
