import mapsEs from '@/assets/books/mapas-visuales.webp';
import mapsEn from '@/assets/books/mapas-visuales-en.webp';
import hanziEs1 from '@/assets/books/colorea-hanzi-vol1-cover.png';
import hanziEs2 from '@/assets/books/colorea-hanzi-vol2.webp';
import hanziEs3 from '@/assets/books/colorea-hanzi-hsk2.webp';
import hanziEn1 from '@/assets/books/color-hanzi-vol1-en.webp';
import wordSearchEs1 from '@/assets/books/sopas-tomo-1.webp';
import wordSearchEs2 from '@/assets/books/sopas-tomo-2.webp';

const languages = ['es', 'en', 'fr', 'de', 'it', 'pt'];
const text = (line) => Object.fromEntries(line.split('|').map((value, index) => [languages[index], value]));

const maps = text('Explora 50 mapas visuales que relacionan caracteres chinos con palabras y situaciones cotidianas. Incluye pinyin, ejercicios y soluciones.|Explore 50 visual maps linking Chinese characters to everyday words and situations. Includes pinyin, exercises, and answers.|Explore 50 cartes visuelles qui relient les caractères chinois à des mots et à des situations du quotidien. Avec pinyin, exercices et corrigés.|Entdecke 50 visuelle Karten, die chinesische Schriftzeichen mit Wörtern und Alltagssituationen verbinden. Mit Pinyin, Übungen und Lösungen.|Esplora 50 mappe visive che collegano i caratteri cinesi a parole e situazioni quotidiane. Con pinyin, esercizi e soluzioni.|Explora 50 mapas visuais que ligam caracteres chineses a palavras e situações do dia a dia. Inclui pinyin, exercícios e soluções.');
const hanzi = text('Practica 100 caracteres chinos simplificados con el orden de trazos, pinyin y significado. Colorea, repasa el modelo y después escribe de memoria.|Practice 100 simplified Chinese characters with stroke order, pinyin, and meanings. Color each character, trace the model, then write it from memory.|Travaille 100 caractères chinois simplifiés avec l’ordre des traits, le pinyin et leur sens. Colorie, repasse le modèle, puis écris de mémoire.|Übe 100 vereinfachte chinesische Schriftzeichen mit Strichfolge, Pinyin und Bedeutung. Male sie aus, spure die Vorlage nach und schreibe dann aus dem Gedächtnis.|Esercitati con 100 caratteri cinesi semplificati, con ordine dei tratti, pinyin e significato. Colora, ripassa il modello e poi scrivi a memoria.|Pratica 100 caracteres chineses simplificados com a ordem dos traços, pinyin e significado. Pinta, segue o modelo e depois escreve de memória.');
const wordSearch = [
  text('Practica vocabulario cotidiano con 50 sopas temáticas, desde la familia y la comida hasta los viajes. Con pinyin y soluciones.|Practice everyday vocabulary with 50 themed word searches, from family and food to travel. Includes pinyin and answers.|Travaille le vocabulaire du quotidien avec 50 grilles thématiques, de la famille et des repas aux voyages. Avec pinyin et corrigés.|Übe Alltagswortschatz mit 50 thematischen Wortsuchrätseln, von Familie und Essen bis zu Reisen. Mit Pinyin und Lösungen.|Esercitati con il lessico quotidiano in 50 crucipuzzle tematici, dalla famiglia e dal cibo ai viaggi. Con pinyin e soluzioni.|Pratica vocabulário do dia a dia com 50 sopas de letras temáticas, da família e da comida às viagens. Com pinyin e soluções.'),
  text('Amplía tu vocabulario con 50 sopas de letras de nivel HSK 4–6. Incluye listas de palabras con pinyin, significado y soluciones.|Build your vocabulary with 50 word searches at HSK levels 4–6. Includes word lists with pinyin, meanings, and answers.|Enrichis ton vocabulaire avec 50 grilles de niveau HSK 4 à 6. Avec des listes de mots, le pinyin, leur sens et les corrigés.|Erweitere deinen Wortschatz mit 50 Wortsuchrätseln auf HSK-Stufe 4–6. Mit Wortlisten, Pinyin, Bedeutungen und Lösungen.|Amplia il tuo lessico con 50 crucipuzzle di livello HSK 4–6. Include elenchi di parole con pinyin, significati e soluzioni.|Amplia o teu vocabulário com 50 sopas de letras de nível HSK 4–6. Inclui listas de palavras com pinyin, significado e soluções.'),
];

// Catalog order is the display order: maps, writing workbooks, word searches.
export const libraryBooks = {
  es: [
    {
      title: 'Mapas visuales para aprender chino', level: 'HSK 1–3', cover: mapsEs, description: maps,
      links: { paperback: 'https://amzn.eu/d/0c5RpoaS', kindle: 'https://amzn.eu/d/04OvXBjn' },
    },
    {
      title: 'Colorea y escribe 100 caracteres chinos · Volumen 1', level: 'HSK 1', cover: hanziEs1, description: hanzi,
      links: { paperback: 'https://amzn.eu/d/01p1jA1w' },
    },
    {
      title: 'Colorea y escribe otros 100 caracteres chinos · Volumen 2', level: 'HSK 1', cover: hanziEs2, description: hanzi,
      links: { paperback: 'https://amzn.eu/d/02Vit8VS' },
    },
    {
      title: 'Colorea y escribe 100 caracteres chinos · Volumen 3', level: 'HSK 2', cover: hanziEs3, description: hanzi,
      links: { paperback: 'https://amzn.eu/d/05tLUpFL' },
    },
    {
      title: 'Sopas de letras en chino · Tomo 1', level: 'HSK 1–3', cover: wordSearchEs1, description: wordSearch[0],
      links: { paperback: 'https://amzn.eu/d/0bcxgoq1' },
    },
    {
      title: 'Sopas de letras en chino · Tomo 2', level: 'HSK 4–6', cover: wordSearchEs2, description: wordSearch[1],
      links: { paperback: 'https://www.amazon.es/dp/B0HQ49BRWL' },
    },
  ],
  en: [
    {
      title: 'Visual Maps for Learning Chinese', level: 'HSK 1–3', cover: mapsEn, description: maps,
      links: { paperback: 'https://www.amazon.com/dp/B0HRVDJ1VD?th=1', kindle: 'https://a.co/d/0iAudPyJ' },
    },
    {
      title: 'Color and Write 100 Chinese Characters · Volume 1', level: 'HSK 1', cover: hanziEn1, description: hanzi,
      links: { paperback: 'https://a.co/d/0aFoUdvD' },
    },
  ],
};
