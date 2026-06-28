/* eslint-disable */
// Precarica le pagine di testo del sito in Sanity (About, Evento, ...).
// Da lanciare UNA volta, dalla cartella studio/, dopo aver creato il progetto.
//
//   $env:SANITY_WRITE_TOKEN="il_token"; node seed-pages.mjs
//
// Token: https://www.sanity.io/manage -> progetto -> API -> Tokens -> Add API token
//   (nome "seed", permesso Editor).
// Idempotente: rilanciandolo aggiorna le stesse pagine, non le duplica.

import { createClient } from '@sanity/client';
import { readFileSync } from 'node:fs';

const env = Object.fromEntries(
  readFileSync('.env', 'utf8').split('\n').filter((l) => l.includes('='))
    .map((l) => { const [k, ...v] = l.split('='); return [k.trim(), v.join('=').trim().replace(/^"|"$/g, '')]; })
);
const projectId = env.SANITY_STUDIO_PROJECT_ID;
const dataset = env.SANITY_STUDIO_DATASET || 'production';
const token = process.env.SANITY_WRITE_TOKEN;
if (!token) {
  console.error('\nManca SANITY_WRITE_TOKEN. Crea un token (API -> Tokens) e rilancia:');
  console.error('  $env:SANITY_WRITE_TOKEN="il_token"; node seed-pages.mjs\n');
  process.exit(1);
}
const client = createClient({ projectId, dataset, apiVersion: '2024-01-01', token, useCdn: false });

let n = 0;
const key = () => 'k' + (n++).toString(36) + Date.now().toString(36);
const block = (text, style = 'normal') => ({ _type: 'block', _key: key(), style, markDefs: [], children: [{ _type: 'span', _key: key(), text, marks: [] }] });
const item = (text) => ({ _type: 'block', _key: key(), style: 'normal', listItem: 'bullet', level: 1, markDefs: [], children: [{ _type: 'span', _key: key(), text, marks: [] }] });
function toBody(sections) {
  const out = [];
  for (const s of sections) {
    if (s.heading) out.push(block(s.heading, 'h2'));
    for (const p of s.paragraphs || []) out.push(block(p));
    for (const li of s.list || []) out.push(item(li));
  }
  return out;
}
function factsArray(itFacts, enFacts) {
  return itFacts.map((f, i) => ({
    _type: 'object', _key: key(),
    label_it: f.label, value_it: f.value,
    label_en: enFacts[i]?.label, value_en: enFacts[i]?.value,
  }));
}

// ---------- ABOUT ----------
const aboutIt = { eyebrow: 'Il progetto', title: 'European Gifted Minds',
  intro: 'Un\u2019iniziativa europea per valorizzare i talenti e lo sviluppo del potenziale umano dei giovani ad alto potenziale cognitivo.',
  sections: [
    { heading: 'La fondazione', paragraphs: ['La fondazione no-profit Carano 4 Children, con sede a Bruxelles, ha come missione promuovere il benessere, lo sviluppo e la valorizzazione dei bambini e dei ragazzi in Europa.','Dal 2019 sviluppa e gestisce l\u2019iniziativa \u201cLeonardo 4 Children\u201d, per coltivare il talento creativo e le capacit\u00e0 artistiche e scientifiche di bambini e ragazzi sui temi della sostenibilit\u00e0, dell\u2019uguaglianza e della pace.'] },
    { heading: 'L\u2019idea', paragraphs: ['Riunire bambini e ragazzi gifted provenienti da diversi paesi europei e affidare loro alcuni grandi problemi del mondo su cui ragionare insieme. Non competizione, non performance: solo pensiero libero e collaborazione tra menti che vedono le cose in modo diverso.','L\u2019obiettivo \u00e8 creare uno spazio europeo in cui questi ragazzi possano incontrarsi, riconoscersi e contribuire \u2014 a modo loro \u2014 a riflettere sui grandi temi del nostro tempo.'] },
    { heading: 'Gli obiettivi', list: ['Mettere in rete associazioni, scuole e professionisti europei dedicati alla plusdotazione.','Valorizzare il talento offrendo percorsi e visibilit\u00e0 ai giovani ad alto potenziale cognitivo e artistico.','Condividere metodologie didattiche e psicologiche efficaci tra i diversi Paesi dell\u2019Unione.','Favorire collaborazioni internazionali: gemellaggi, progetti di ricerca e iniziative transfrontaliere.','Generare un impatto normativo, sociale e didattico duraturo sul territorio europeo.'] },
    { heading: 'Una prospettiva europea', paragraphs: ['L\u2019evento del 9 ottobre 2026 a Bruxelles \u00e8 il primo passo di un percorso pi\u00f9 ampio: la Fondazione intende valorizzare questa esperienza per costruire un progetto europeo strutturato, da sviluppare nell\u2019ambito dei programmi di finanziamento dell\u2019Unione Europea.'] },
  ] };
const aboutEn = { eyebrow: 'About', title: 'European Gifted Minds',
  intro: 'A European initiative to nurture talent and the development of the human potential of cognitively gifted young people.',
  sections: [
    { heading: 'The foundation', paragraphs: ['The non-profit Carano 4 Children Foundation, based in Brussels, is on a mission to promote the wellbeing, growth and recognition of children and young people across Europe.','Since 2019 it has run the \u201cLeonardo 4 Children\u201d initiative, nurturing the creative talent and the artistic and scientific abilities of children around the themes of sustainability, equality and peace.'] },
    { heading: 'The idea', paragraphs: ['Bring together gifted children and teenagers from across Europe and give them some of the world\u2019s big challenges to think through together. No competition, no performance: just free thinking and collaboration between minds that see things differently.','The goal is to create a European space where these young people can meet, recognise one another and contribute \u2014 in their own way \u2014 to reflecting on the great questions of our time.'] },
    { heading: 'The objectives', list: ['Connect associations, schools and professionals across Europe dedicated to giftedness.','Nurture talent by offering pathways and visibility to cognitively and artistically gifted young people.','Share effective educational and psychological methods between EU countries.','Foster international collaboration: partnerships, research projects and cross-border initiatives.','Generate lasting policy, social and educational impact across Europe.'] },
    { heading: 'A European perspective', paragraphs: ['The event on 9 October 2026 in Brussels is the first step of a wider journey: the Foundation intends to build on this experience to develop a structured European project, within the European Union\u2019s funding programmes.'] },
  ] };

// ---------- EVENT ----------
const eventItFacts = [
  { label: 'Data', value: '9 ottobre 2026' }, { label: 'Citt\u00e0', value: 'Bruxelles' },
  { label: 'Luogo', value: 'Istituto Italiano di Cultura' }, { label: 'Indirizzo', value: 'Avenue de Livourne 38, 1050 Bruxelles' },
  { label: 'Durata', value: '3\u20134 ore' }, { label: 'Lingue workshop', value: 'Inglese, italiano' },
];
const eventEnFacts = [
  { label: 'Date', value: '9 October 2026' }, { label: 'City', value: 'Brussels' },
  { label: 'Venue', value: 'Istituto Italiano di Cultura' }, { label: 'Address', value: 'Avenue de Livourne 38, 1050 Brussels' },
  { label: 'Duration', value: '3\u20134 hours' }, { label: 'Workshop languages', value: 'English, Italian' },
];
const eventIt = { eyebrow: 'L\u2019evento', title: 'Road to Brussels',
  intro: 'Una giornata di collaborazione tra ragazzi e bambini gifted provenienti da tutta Europa, seguita da una serata conclusiva con concerto e cerimonia di premiazione.',
  sections: [
    { heading: 'Il workshop', paragraphs: ['Nel pomeriggio, una sessione di lavoro riunisce ragazzi e bambini provenienti da tutta Europa attorno ad alcuni grandi temi del nostro tempo. Non una gara, ma uno spazio di pensiero libero e collaborazione tra menti che vedono le cose in modo diverso.','Al termine, i partecipanti ricevono un attestato di partecipazione firmato dalla Fondazione.'] },
    { heading: 'La serata conclusiva', paragraphs: ['Alle 19:30, al Theatre Saint Michel di Bruxelles, la serata si apre con un concerto. I ragazzi e i bambini partecipanti al workshop saranno invitati sul palco.','Alla serata interverranno personalit\u00e0 istituzionali e i vincitori dei concorsi; si esibiranno musicisti di grande talento come Augustin Dumay e Anastasiya Petryshak.'] },
    { heading: 'Nel contesto dei Leonardo 4 Children Awards 2026', paragraphs: ['La serata \u00e8 inserita nella cerimonia di premiazione dei concorsi \u201cLeonardo 4 Children Awards 2026\u201d, patrocinata da UNESCO, Parlamento Europeo, Comitato delle Regioni Europeo, Comitato Economico e Sociale Europeo, Ambasciata Italiana in Belgio e Istituto Italiano di Cultura di Bruxelles.','Lingua della serata finale: inglese.'] },
  ] };
const eventEn = { eyebrow: 'The event', title: 'Road to Brussels',
  intro: 'A day of collaboration between gifted children and teenagers from across Europe, followed by a closing evening with a concert and an awards ceremony.',
  sections: [
    { heading: 'The workshop', paragraphs: ['In the afternoon, a working session brings together children and teenagers from across Europe around some of the great questions of our time. Not a contest, but a space for free thinking and collaboration between minds that see things differently.','At the end, participants receive a certificate of participation signed by the Foundation.'] },
    { heading: 'The closing evening', paragraphs: ['At 7:30 pm, at the Theatre Saint Michel in Brussels, the evening opens with a concert. The children and teenagers who took part in the workshop will be invited on stage.','The evening will feature institutional figures and the competition winners, with performances by acclaimed musicians such as Augustin Dumay and Anastasiya Petryshak.'] },
    { heading: 'Within the Leonardo 4 Children Awards 2026', paragraphs: ['The evening is part of the awards ceremony of the \u201cLeonardo 4 Children Awards 2026\u201d, under the patronage of UNESCO, the European Parliament, the European Committee of the Regions, the European Economic and Social Committee, the Italian Embassy in Belgium and the Istituto Italiano di Cultura in Brussels.','Language of the final evening: English.'] },
  ] };

const docs = [
  { _id: 'page-about', _type: 'page', slug: { _type: 'slug', current: 'about' },
    eyebrow_it: aboutIt.eyebrow, title_it: aboutIt.title, intro_it: aboutIt.intro, body_it: toBody(aboutIt.sections),
    eyebrow_en: aboutEn.eyebrow, title_en: aboutEn.title, intro_en: aboutEn.intro, body_en: toBody(aboutEn.sections),
    published: true },
  { _id: 'page-event', _type: 'page', slug: { _type: 'slug', current: 'event' },
    eyebrow_it: eventIt.eyebrow, title_it: eventIt.title, intro_it: eventIt.intro, body_it: toBody(eventIt.sections),
    eyebrow_en: eventEn.eyebrow, title_en: eventEn.title, intro_en: eventEn.intro, body_en: toBody(eventEn.sections),
    facts: factsArray(eventItFacts, eventEnFacts),
    tourUrl: 'https://discover.matterport.com/space/Pnpcr75yFhm',
    published: true },
];

// ---------- Pagine aggiuntive (Fondazione, Ambassador, Contatti, Join) ----------
// I testi sono gli stessi dei fallback in src/content/pages/. Definiti qui in forma
// compatta: { slug, it:{...}, en:{...}, facts? }.
const extra = [
  {
    slug: 'foundation',
    facts: { it: [
      { label: 'Sede', value: 'Bruxelles, Belgio' }, { label: 'Indirizzo', value: 'Rue Belliard 202, 1040 Brussels' },
      { label: 'Email', value: 'info@carano4children.org' }, { label: 'Dal', value: '2019 (Leonardo 4 Children)' } ],
      en: [
      { label: 'Based in', value: 'Brussels, Belgium' }, { label: 'Address', value: 'Rue Belliard 202, 1040 Brussels' },
      { label: 'Email', value: 'info@carano4children.org' }, { label: 'Since', value: '2019 (Leonardo 4 Children)' } ] },
    it: { eyebrow: 'La Fondazione', title: 'Carano 4 Children',
      intro: 'Una fondazione no-profit con sede a Bruxelles, dedicata al benessere, allo sviluppo e alla valorizzazione dei bambini e dei ragazzi in Europa.',
      sections: [
        { heading: 'La missione', paragraphs: ['Carano 4 Children promuove il benessere, lo sviluppo e la valorizzazione dei bambini e dei ragazzi in Europa, con particolare attenzione ai giovani ad alto potenziale cognitivo.'] },
        { heading: 'Leonardo 4 Children', paragraphs: ['Dal 2019 la Fondazione sviluppa e gestisce l\u2019iniziativa no-profit \u201cLeonardo 4 Children\u201d, per coltivare il talento creativo e le capacit\u00e0 artistiche e scientifiche di bambini e ragazzi sui temi della sostenibilit\u00e0, dell\u2019uguaglianza e della pace.'] },
        { heading: 'Il ruolo nella nostra iniziativa', list: ['Sostenere l\u2019iniziativa con risorse per il back office e la promozione dei risultati.','Mettere a disposizione una sala presso l\u2019Istituto Italiano di Cultura di Bruxelles.','Contattare le principali associazioni europee per ragazzi ad alto potenziale e invitarle a partecipare come partner.','Inserire l\u2019evento nel programma della giornata del 9 ottobre, con menzione dei partecipanti.','Rilasciare a ogni ragazzo un attestato di partecipazione firmato dalla Fondazione.'] },
      ] },
    en: { eyebrow: 'The Foundation', title: 'Carano 4 Children',
      intro: 'A non-profit foundation based in Brussels, dedicated to the wellbeing, growth and recognition of children and young people across Europe.',
      sections: [
        { heading: 'The mission', paragraphs: ['Carano 4 Children promotes the wellbeing, growth and recognition of children and young people across Europe, with particular attention to cognitively gifted young people.'] },
        { heading: 'Leonardo 4 Children', paragraphs: ['Since 2019 the Foundation has run the non-profit \u201cLeonardo 4 Children\u201d initiative, nurturing the creative talent and the artistic and scientific abilities of children around the themes of sustainability, equality and peace.'] },
        { heading: 'Its role in our initiative', list: ['Support the initiative with resources for back office and promotion of the results.','Provide a room at the Istituto Italiano di Cultura in Brussels.','Reach out to leading European associations for high-potential young people and invite them to take part as partners.','Include the event in the programme of 9 October, with mention of the participants.','Issue every participant a certificate of participation signed by the Foundation.'] },
      ] },
  },
  {
    slug: 'ambassadors',
    it: { eyebrow: 'Partecipa', title: 'Diventa Ambassador',
      intro: 'Gli Ambassador sono i giovani protagonisti dell\u2019iniziativa: menti curiose che portano la propria voce, le proprie idee e la propria storia da tutta Europa.',
      sections: [
        { heading: 'Chi sono gli Ambassador', paragraphs: ['Ragazzi e bambini ad alto potenziale provenienti da diversi paesi europei, che partecipano al workshop di Bruxelles e contribuiscono \u2014 a modo loro \u2014 a riflettere sui grandi temi del nostro tempo.','Non si tratta di una competizione: nessuna gara, nessuna performance. Solo pensiero libero e collaborazione tra menti che vedono le cose in modo diverso.'] },
        { heading: 'Come si partecipa', paragraphs: ['La segnalazione dei ragazzi interessati avviene attraverso le associazioni partner europee per bambini gifted e ad alto potenziale, oppure contattando direttamente la Fondazione.','I ragazzi partecipanti al workshop saranno invitati sul palco durante la serata conclusiva e riceveranno un attestato di partecipazione firmato dalla Fondazione.'] },
        { heading: 'Racconta la tua voce', paragraphs: ['Gli Ambassador possono condividere un breve video \u2014 un \u201creel\u201d \u2014 con la propria storia, idea o visione. I contributi selezionati trovano spazio nella sezione \u201cVoci dall\u2019Europa\u201d del sito.'] },
      ] },
    en: { eyebrow: 'Take part', title: 'Become an ambassador',
      intro: 'Ambassadors are the young protagonists of the initiative: curious minds bringing their voice, ideas and story from all over Europe.',
      sections: [
        { heading: 'Who the ambassadors are', paragraphs: ['High-potential children and teenagers from across Europe, who take part in the Brussels workshop and contribute \u2014 in their own way \u2014 to reflecting on the great questions of our time.','This is not a competition: no contest, no performance. Just free thinking and collaboration between minds that see things differently.'] },
        { heading: 'How to take part', paragraphs: ['Interested young people are nominated through the European partner associations for gifted and high-potential children, or by contacting the Foundation directly.','Workshop participants will be invited on stage during the closing evening and will receive a certificate of participation signed by the Foundation.'] },
        { heading: 'Share your voice', paragraphs: ['Ambassadors can share a short video \u2014 a \u201creel\u201d \u2014 with their story, idea or vision. Selected contributions are featured in the \u201cVoices from Europe\u201d section of the site.'] },
      ] },
  },
  {
    slug: 'contact',
    facts: { it: [
      { label: 'Email', value: 'info@carano4children.org' }, { label: 'Fondazione', value: 'Carano 4 Children \u2014 Fondation priv\u00e9e' },
      { label: 'Indirizzo', value: 'Rue Belliard 202, 1040 Brussels, Belgio' }, { label: 'Evento', value: 'Istituto Italiano di Cultura, Bruxelles' } ],
      en: [
      { label: 'Email', value: 'info@carano4children.org' }, { label: 'Foundation', value: 'Carano 4 Children \u2014 Fondation priv\u00e9e' },
      { label: 'Address', value: 'Rue Belliard 202, 1040 Brussels, Belgium' }, { label: 'Event', value: 'Istituto Italiano di Cultura, Brussels' } ] },
    it: { eyebrow: 'Contatti', title: 'Mettiamoci in contatto',
      intro: 'Per informazioni sull\u2019iniziativa, per partecipare come associazione partner o per segnalare un ragazzo interessato, scrivici.',
      sections: [ { heading: 'Come raggiungerci', paragraphs: ['Il modo pi\u00f9 diretto per contattare la Fondazione \u00e8 via email all\u2019indirizzo info@carano4children.org.','Le associazioni interessate a partecipare come partner ufficiali possono manifestare la propria adesione contattando la Fondazione o un referente del gruppo organizzatore.'] } ] },
    en: { eyebrow: 'Contact', title: 'Get in touch',
      intro: 'For information about the initiative, to take part as a partner association or to nominate an interested young person, write to us.',
      sections: [ { heading: 'How to reach us', paragraphs: ['The most direct way to contact the Foundation is by email at info@carano4children.org.','Associations interested in taking part as official partners can express their interest by contacting the Foundation or a member of the organising team.'] } ] },
  },
  {
    slug: 'join',
    it: { eyebrow: 'Partecipa', title: 'Partecipa al progetto',
      intro: 'Ci sono diversi modi per prendere parte a European Gifted Minds: come giovane Ambassador, come famiglia, o come associazione partner.',
      sections: [
        { heading: 'Ragazzi e famiglie', paragraphs: ['I ragazzi ad alto potenziale possono partecipare al workshop di Bruxelles. La segnalazione avviene tramite le associazioni partner o contattando direttamente la Fondazione.'] },
        { heading: 'Associazioni partner', paragraphs: ['Le associazioni europee per bambini gifted e ad alto potenziale sono invitate a partecipare come partner ufficiali. La partecipazione \u00e8 gratuita e prevede la segnalazione di ragazzi interessati, la menzione del nome dell\u2019associazione nei materiali dell\u2019evento e la possibilit\u00e0 di essere citati durante la presentazione serale.'] },
        { heading: 'Come aderire', paragraphs: ['Per manifestare il proprio interesse, scrivi a info@carano4children.org o contatta un referente del gruppo organizzatore.'] },
      ] },
    en: { eyebrow: 'Take part', title: 'Join the project',
      intro: 'There are several ways to be part of European Gifted Minds: as a young Ambassador, as a family, or as a partner association.',
      sections: [
        { heading: 'Young people and families', paragraphs: ['High-potential young people can take part in the Brussels workshop. Nominations are made through partner associations or by contacting the Foundation directly.'] },
        { heading: 'Partner associations', paragraphs: ['European associations for gifted and high-potential children are invited to take part as official partners. Participation is free and includes nominating interested young people, mentioning the association\u2019s name in event materials and the possibility of being cited during the evening presentation.'] },
        { heading: 'How to join', paragraphs: ['To express your interest, write to info@carano4children.org or contact a member of the organising team.'] },
      ] },
  },
];

for (const p of extra) {
  const doc = {
    _id: 'page-' + p.slug, _type: 'page', slug: { _type: 'slug', current: p.slug },
    eyebrow_it: p.it.eyebrow, title_it: p.it.title, intro_it: p.it.intro, body_it: toBody(p.it.sections),
    eyebrow_en: p.en.eyebrow, title_en: p.en.title, intro_en: p.en.intro, body_en: toBody(p.en.sections),
    published: true,
  };
  if (p.facts) doc.facts = factsArray(p.facts.it, p.facts.en);
  docs.push(doc);
}

Promise.all(docs.map((d) => client.createOrReplace(d)))
  .then(() => console.log('\n✅ Pagine caricate su Sanity: about, event (pubblicate).\n'))
  .catch((e) => { console.error('Errore:', e.message); process.exit(1); });
