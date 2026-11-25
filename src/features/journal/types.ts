export type ArticleSection = {
  heading?: string;
  paragraphs: string[];
  quote?: string;
};

export type LocalArticle = {
  slug: string;
  title: string;
  subtitle?: string;
  category: string;
  author: string;
  date?: string;
  readingTime: number;
  summary: string;
  language?: 'id' | 'en' | 'bilingual';
  sections: ArticleSection[];
};

export type InnOpinion = {
  title: string;
  slug: string;
  author: string;
  date: string;
  minutes: number;
};
