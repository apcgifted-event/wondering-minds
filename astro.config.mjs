import { defineConfig } from 'astro/config';

// https://astro.build
// Sito statico multilingua per il progetto European Gifted Minds / Wondering Minds.
// Default IT, EN come seconda lingua sotto /en/.
export default defineConfig({
  // Cambia con il dominio definitivo della fondazione prima del deploy.
  site: 'https://wonderingminds.carano4children.org',
  i18n: {
    defaultLocale: 'it',
    locales: ['it', 'en'],
    routing: {
      prefixDefaultLocale: false, // l'italiano sta in root (/), l'inglese in /en/
    },
  },
  // Hosting consigliato: Vercel o Netlify (CDN/region EU, free tier sufficiente).
  // Per ora output statico puro: nessun server necessario.
});
