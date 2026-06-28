/* eslint-disable */
// Precarica la pagina "Il progetto / About" in Sanity con i testi dei documenti.
// Da lanciare UNA volta, dalla cartella studio/, dopo aver creato il progetto:
//
//   node seed-about.mjs
//
// Richiede un token con permesso di scrittura. Crealo su:
//   https://www.sanity.io/manage -> progetto -> API -> Tokens -> Add API token
//   (nome: "seed", permesso: Editor). Poi lancialo così (PowerShell):
//
//   $env:SANITY_WRITE_TOKEN="il_token"; node seed-about.mjs
//
// Lo script è idempotente: rilanciandolo aggiorna la stessa pagina, non la duplica.

import { createClient } from '@sanity/client';
import { readFileSync } from 'node:fs';

// Legge projectId/dataset dal .env dello studio
const env = Object.fromEntries(
  readFileSync('.env', 'utf8')
    .split('\n')
    .filter((l) => l.includes('='))
    .map((l) => {
      const [k, ...v] = l.split('=');
      return [k.trim(), v.join('=').trim().replace(/^"|"$/g, '')];
    })
);

const projectId = env.SANITY_STUDIO_PROJECT_ID;
const dataset = env.SANITY_STUDIO_DATASET || 'production';
const token = process.env.SANITY_WRITE_TOKEN;

if (!token) {
  console.error('\nManca SANITY_WRITE_TOKEN. Crea un token (API -> Tokens) e rilancia:');
  console.error('  $env:SANITY_WRITE_TOKEN="il_token"; node seed-about.mjs\n');
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion: '2024-01-01', token, useCdn: false });

// Converte un array di paragrafi/heading/list in blocchi Portable Text.
function block(text, style = 'normal') {
  return { _type: 'block', _key: key(), style, children: [{ _type: 'span', _key: key(), text, marks: [] }], markDefs: [] };
}
function listItem(text) {
  return { _type: 'block', _key: key(), style: 'normal', listItem: 'bullet', level: 1, children: [{ _type: 'span', _key: key(), text, marks: [] }], markDefs: [] };
}
let n = 0;
function key() { return 'k' + (n++).toString(36) + Date.now().toString(36); }

function toBody(sections) {
  const out = [];
  for (const s of sections) {
    if (s.heading) out.push(block(s.heading, 'h2'));
    for (const p of s.paragraphs || []) out.push(block(p));
    for (const li of s.list || []) out.push(listItem(li));
  }
  return out;
}

// Contenuti (specchio di src/content/pages/about.ts)
const it = {
  eyebrow: 'Il progetto',
  title: 'European Gifted Minds',
  intro: 'Un\u2019iniziativa europea per valorizzare i talenti e lo sviluppo del potenziale umano dei giovani ad alto potenziale cognitivo.',
  sections: [
    { heading: 'La fondazione', paragraphs: [
      'La fondazione no-profit Carano 4 Children, con sede a Bruxelles, ha come missione promuovere il benessere, lo sviluppo e la valorizzazione dei bambini e dei ragazzi in Europa.',
      'Dal 2019 sviluppa e gestisce l\u2019iniziativa \u201cLeonardo 4 Children\u201d, per coltivare il talento creativo e le capacit\u00e0 artistiche e scientifiche di bambini e ragazzi sui temi della sostenibilit\u00e0, dell\u2019uguaglianza e della pace.' ] },
    { heading: 'L\u2019idea', paragraphs: [
      'Riunire bambini e ragazzi gifted provenienti da diversi paesi europei e affidare loro alcuni grandi problemi del mondo su cui ragionare insieme. Non competizione, non performance: solo pensiero libero e collaborazione tra menti che vedono le cose in modo diverso.',
      'L\u2019obiettivo \u00e8 creare uno spazio europeo in cui questi ragazzi possano incontrarsi, riconoscersi e contribuire \u2014 a modo loro \u2014 a riflettere sui grandi temi del nostro tempo.' ] },
    { heading: 'Gli obiettivi', list: [
      'Mettere in rete associazioni, scuole e professionisti europei dedicati alla plusdotazione.',
      'Valorizzare il talento offrendo percorsi e visibilit\u00e0 ai giovani ad alto potenziale cognitivo e artistico.',
      'Condividere metodologie didattiche e psicologiche efficaci tra i diversi Paesi dell\u2019Unione.',
      'Favorire collaborazioni internazionali: gemellaggi, progetti di ricerca e iniziative transfrontaliere.',
      'Generare un impatto normativo, sociale e didattico duraturo sul territorio europeo.' ] },
    { heading: 'Una prospettiva europea', paragraphs: [
      'L\u2019evento del 9 ottobre 2026 a Bruxelles \u00e8 il primo passo di un percorso pi\u00f9 ampio: la Fondazione intende valorizzare questa esperienza per costruire un progetto europeo strutturato, da sviluppare nell\u2019ambito dei programmi di finanziamento dell\u2019Unione Europea.' ] },
  ],
};
const en = {
  eyebrow: 'About',
  title: 'European Gifted Minds',
  intro: 'A European initiative to nurture talent and the development of the human potential of cognitively gifted young people.',
  sections: [
    { heading: 'The foundation', paragraphs: [
      'The non-profit Carano 4 Children Foundation, based in Brussels, is on a mission to promote the wellbeing, growth and recognition of children and young people across Europe.',
      'Since 2019 it has run the \u201cLeonardo 4 Children\u201d initiative, nurturing the creative talent and the artistic and scientific abilities of children around the themes of sustainability, equality and peace.' ] },
    { heading: 'The idea', paragraphs: [
      'Bring together gifted children and teenagers from across Europe and give them some of the world\u2019s big challenges to think through together. No competition, no performance: just free thinking and collaboration between minds that see things differently.',
      'The goal is to create a European space where these young people can meet, recognise one another and contribute \u2014 in their own way \u2014 to reflecting on the great questions of our time.' ] },
    { heading: 'The objectives', list: [
      'Connect associations, schools and professionals across Europe dedicated to giftedness.',
      'Nurture talent by offering pathways and visibility to cognitively and artistically gifted young people.',
      'Share effective educational and psychological methods between EU countries.',
      'Foster international collaboration: partnerships, research projects and cross-border initiatives.',
      'Generate lasting policy, social and educational impact across Europe.' ] },
    { heading: 'A European perspective', paragraphs: [
      'The event on 9 October 2026 in Brussels is the first step of a wider journey: the Foundation intends to build on this experience to develop a structured European project, within the European Union\u2019s funding programmes.' ] },
  ],
};

const doc = {
  _id: 'page-about',          // id fisso => idempotente
  _type: 'page',
  slug: { _type: 'slug', current: 'about' },
  eyebrow_it: it.eyebrow, title_it: it.title, intro_it: it.intro, body_it: toBody(it.sections),
  eyebrow_en: en.eyebrow, title_en: en.title, intro_en: en.intro, body_en: toBody(en.sections),
  published: true,
};

client.createOrReplace(doc)
  .then(() => console.log('\n✅ Pagina About caricata su Sanity (slug: about, pubblicata).\n'))
  .catch((e) => { console.error('Errore:', e.message); process.exit(1); });
