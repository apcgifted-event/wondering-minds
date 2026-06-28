import {defineField, defineType} from 'sanity'

// NEWS & UPDATES — bilingue (IT + EN).
// Campi testuali doppiati per lingua; data, copertina, slug e stato sono comuni.
export default defineType({
  name: 'newsPost',
  title: 'News e aggiornamenti',
  type: 'document',
  fields: [
    // Comuni
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: {source: 'title_it', maxLength: 80},
      validation: (r) => r.required(),
    }),
    defineField({name: 'date', title: 'Data', type: 'date', validation: (r) => r.required()}),
    defineField({name: 'cover', title: 'Immagine di copertina', type: 'image', options: {hotspot: true}}),

    // Italiano
    defineField({name: 'title_it', title: 'IT — Titolo', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'summary_it', title: 'IT — Riassunto', type: 'text', rows: 3, validation: (r) => r.required()}),
    defineField({
      name: 'body_it', title: 'IT — Contenuto', type: 'array',
      of: [{type: 'block'}, {type: 'image', options: {hotspot: true}}],
    }),

    // English
    defineField({name: 'title_en', title: 'EN — Title', type: 'string'}),
    defineField({name: 'summary_en', title: 'EN — Summary', type: 'text', rows: 3}),
    defineField({
      name: 'body_en', title: 'EN — Content', type: 'array',
      of: [{type: 'block'}, {type: 'image', options: {hotspot: true}}],
    }),

    defineField({name: 'published', title: 'Pubblicato', type: 'boolean', initialValue: false}),
  ],
  preview: {
    select: {title: 'title_it', date: 'date', media: 'cover', pub: 'published'},
    prepare({title, date, media, pub}) {
      return {title: title ?? '(senza titolo)', subtitle: `${pub ? '🟢' : '⚪️'} ${date ?? ''}`, media}
    },
  },
})
