import {defineField, defineType} from 'sanity'

// PAGINA DI TESTO (es. "Il progetto / About")
// Contenuto bilingue: campi IT ed EN affiancati. La struttura grafica resta nel
// codice del sito; da qui si gestiscono solo testi e immagini.
// Ogni pagina è identificata da uno 'slug' fisso (es. "about") che il sito cerca.
export default defineType({
  name: 'page',
  title: 'Pagine di testo',
  type: 'document',
  fields: [
    defineField({
      name: 'slug',
      title: 'Identificativo pagina (non modificare)',
      description: 'Codice tecnico che collega questo testo alla pagina del sito. Es. "about".',
      type: 'slug',
      validation: (r) => r.required(),
    }),

    // ---- Italiano ----
    defineField({ name: 'eyebrow_it', title: 'IT — Etichetta in alto', type: 'string' }),
    defineField({ name: 'title_it', title: 'IT — Titolo', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'intro_it', title: 'IT — Introduzione', type: 'text', rows: 3 }),
    defineField({
      name: 'body_it',
      title: 'IT — Contenuto',
      type: 'array',
      of: [{ type: 'block' }, { type: 'image', options: { hotspot: true } }],
    }),

    // ---- English ----
    defineField({ name: 'eyebrow_en', title: 'EN — Eyebrow label', type: 'string' }),
    defineField({ name: 'title_en', title: 'EN — Title', type: 'string' }),
    defineField({ name: 'intro_en', title: 'EN — Intro', type: 'text', rows: 3 }),
    defineField({
      name: 'body_en',
      title: 'EN — Content',
      type: 'array',
      of: [{ type: 'block' }, { type: 'image', options: { hotspot: true } }],
    }),

    // ---- Scheda "informazioni pratiche" (facoltativa, usata es. da Evento) ----
    defineField({
      name: 'facts',
      title: 'Informazioni pratiche (facoltative)',
      description: 'Coppie etichetta/valore mostrate in una scheda in evidenza (es. Data, Luogo, Orario).',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label_it', title: 'Etichetta IT', type: 'string' },
            { name: 'label_en', title: 'Etichetta EN', type: 'string' },
            { name: 'value_it', title: 'Valore IT', type: 'string' },
            { name: 'value_en', title: 'Valore EN', type: 'string' },
            { name: 'url', title: 'Link (facoltativo)', description: 'Se compilato, il valore diventa cliccabile. Accetta indirizzi web (https://...) ed email (mailto:info@...).', type: 'url', validation: (r) => r.uri({ scheme: ['http', 'https', 'mailto', 'tel'] }) },
          ],
          preview: { select: { title: 'label_it', subtitle: 'value_it' } },
        },
      ],
    }),
    defineField({
      name: 'tourUrl',
      title: 'Link tour virtuale (facoltativo)',
      type: 'url',
    }),

    // ---- Box per età (usato dalla pagina Blueland) ----
    defineField({
      name: 'groups',
      title: 'Box per fascia d\u2019età (Blueland)',
      description: 'I riquadri numerati per fascia d\u2019età. Usati dalla pagina Blueland.',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'age_it', title: 'Fascia età IT (es. 8–10 anni)', type: 'string' },
            { name: 'age_en', title: 'Age group EN (e.g. ages 8–10)', type: 'string' },
            { name: 'title_it', title: 'Titolo IT', type: 'string' },
            { name: 'title_en', title: 'Title EN', type: 'string' },
            { name: 'slogan_it', title: 'Slogan IT', type: 'string' },
            { name: 'slogan_en', title: 'Slogan EN', type: 'string' },
            { name: 'body_it', title: 'Testo IT', type: 'text', rows: 3 },
            { name: 'body_en', title: 'Text EN', type: 'text', rows: 3 },
            { name: 'output_it', title: 'Prodotto finale IT', type: 'string' },
            { name: 'output_en', title: 'Final output EN', type: 'string' },
          ],
          preview: { select: { title: 'title_it', subtitle: 'age_it' } },
        },
      ],
    }),

    defineField({ name: 'published', title: 'Pubblicato', type: 'boolean', initialValue: false }),
  ],

  preview: {
    select: { title: 'title_it', slug: 'slug.current', pub: 'published' },
    prepare({ title, slug, pub }) {
      return { title: title ?? slug, subtitle: `${pub ? '🟢' : '⚪️'} pagina: ${slug ?? '—'}` }
    },
  },
})
