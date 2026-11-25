import { tr } from '../language';
import { ArrowLeft, ArrowRight, Camera } from 'lucide-react';
import { useState } from 'react';

const photos = [
  { name: 'perjumpaan', caption: 'Kebersamaan dalam komunitas', alt: 'Peserta berkumpul dan saling merangkul dalam koleksi foto FORNAK.' },
  { name: 'pertemuan', caption: 'Pertemuan dalam arsip FORNAK', alt: 'Para peserta berdiri bersama di ruang pertemuan.' },
  { name: 'merah-putih', caption: 'Merah Putih di alam terbuka', alt: 'Seorang pembawa bendera berdiri di atas batu dengan latar perbukitan.' },
  { name: 'pengibaran', caption: 'Merah Putih di ruang pertemuan', alt: 'Bendera Merah Putih terbentang di atas panggung.' },
];

export function ArchiveSpread() {
  const [index, setIndex] = useState(0);
  const photo = photos[index];
  const step = (amount: number) => setIndex(i => (i + amount + photos.length) % photos.length);
  return <figure className={'photo-stage photo-stage--' + photo.name} aria-label={tr("Pilihan foto arsip FORNAK")}>
    <img key={photo.name} src={'/Fornak-Indonesia/assets/images/arsip-' + photo.name + (photo.name === 'perjumpaan' ? '.webp' : '.jpg')} alt={photo.alt} fetchPriority={index === 0 ? 'high' : 'auto'} />
    <figcaption>
      <div aria-live="polite"><small><Camera size={15} aria-hidden="true"/> {tr("Arsip visual FORNAK")}</small><strong>{tr(photo.caption)}</strong></div>
      <div className="photo-controls">
        <button type="button" aria-label={tr("Foto sebelumnya")} onClick={()=>step(-1)}><ArrowLeft/></button>
        <span>{String(index+1).padStart(2,'0')} / 04</span>
        <button type="button" aria-label={tr("Foto berikutnya")} onClick={()=>step(1)}><ArrowRight/></button>
      </div>
    </figcaption>
  </figure>;
}
