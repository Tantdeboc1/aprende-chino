import { J } from '@/styles/tokens';
import mapasCover from '@/assets/books/mapas-visuales.webp';
import sopasCover from '@/assets/books/sopas-tomo-1.webp';

const books = [
  {
    title: 'Mapas visuales para aprender chino',
    eyebrow: 'APRENDE CON CONEXIONES',
    cover: mapasCover,
    description: 'Descubre cómo se relacionan los caracteres con palabras y situaciones cotidianas a través de 50 mapas visuales.',
    details: ['50 mapas visuales', 'Pinyin y español', 'Ejercicios y soluciones'],
    links: [{ label: 'Ver en papel', url: 'https://amzn.eu/d/0c5RpoaS' }, { label: 'Ver en Kindle', url: 'https://amzn.eu/d/04OvXBjn' }],
  },
  {
    title: 'Sopas de letras en chino',
    eyebrow: 'CHINO COTIDIANO · VOLUMEN 1',
    cover: sopasCover,
    description: 'Practica vocabulario cotidiano con 50 sopas temáticas, desde la familia y la comida hasta los viajes.',
    details: ['50 sopas temáticas', 'HSK 1–3', 'Pinyin, español y soluciones'],
    links: [{ label: 'Ver en papel', url: 'https://amzn.eu/d/0bcxgoq1' }],
  },
];

export default function Library() {
  return <div style={{ maxWidth: 1080, margin: '0 auto', padding: '36px 20px 64px' }}>
    <p style={{ color: J.jadeDeep, fontSize: 12, fontWeight: 800, letterSpacing: '.12em', textTransform: 'uppercase' }}>HanyuPath · Libros en español</p>
    <h1 style={{ color: J.ink, fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, margin: '8px 0 12px' }}>Biblioteca</h1>
    <p style={{ color: J.inkSoft, lineHeight: 1.6, maxWidth: 650 }}>Otros caminos para aprender chino a tu ritmo. Descubre nuestros libros y elige el que mejor te acompañe.</p>
    <div className="library-grid" style={{ marginTop: 28 }}>
      {books.map(book => <article className="library-card" key={book.title} style={{ background: J.paperHi, border: `1px solid ${J.hair}` }}>
        <div className="library-cover-wrap"><img className="library-cover" src={book.cover} alt={`Portada de ${book.title}`} loading="lazy" /></div>
        <div className="library-card-content">
          <p style={{ color: J.jadeDeep, fontSize: 11, fontWeight: 800, letterSpacing: '.1em', margin: 0 }}>{book.eyebrow}</p>
          <h2 style={{ color: J.ink, fontSize: '1.4rem', fontWeight: 800, lineHeight: 1.2, margin: '9px 0 12px' }}>{book.title}</h2>
          <p style={{ color: J.inkSoft, fontSize: 14, lineHeight: 1.6, margin: 0 }}>{book.description}</p>
          <ul style={{ display: 'flex', flexWrap: 'wrap', gap: 6, padding: 0, margin: '16px 0', listStyle: 'none' }}>
            {book.details.map(detail => <li key={detail} style={{ borderRadius: 20, background: J.jadeBg, color: J.jadeDeep, padding: '5px 9px', fontSize: 11, fontWeight: 700 }}>{detail}</li>)}
          </ul>
          <div style={{ marginTop: 'auto' }}>
            <p style={{ color: J.mute, fontSize: 12, margin: '0 0 8px' }}>Disponible en Amazon España</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {book.links.map((link, index) => <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" aria-label={`${link.label} en Amazon España: ${book.title}`} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 44, padding: '10px 14px', borderRadius: 12, background: index === 0 ? J.jade : 'transparent', border: `1px solid ${J.jade}`, color: index === 0 ? J.onAccent : J.jadeDeep, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>{link.label} ↗</a>)}
            </div>
          </div>
        </div>
      </article>)}
    </div>
  </div>;
}
