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

    defineField({ name: 'published', title: 'Pubblicato', type: 'boolean', initialValue: false }),
  ],

  preview: {
    select: { title: 'title_it', slug: 'slug.current', pub: 'published' },
    prepare({ title, slug, pub }) {
      return { title: title ?? slug, subtitle: `${pub ? '🟢' : '⚪️'} pagina: ${slug ?? '—'}` }
    },
  },
})
