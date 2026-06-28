import {defineField, defineType} from 'sanity'

// NEWS & UPDATES
export default defineType({
  name: 'newsPost',
  title: 'News e aggiornamenti',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Titolo', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: {source: 'title', maxLength: 80},
      validation: (r) => r.required(),
    }),
    defineField({name: 'date', title: 'Data', type: 'date', validation: (r) => r.required()}),
    defineField({name: 'summary', title: 'Riassunto', type: 'text', rows: 3, validation: (r) => r.required()}),
    defineField({name: 'cover', title: 'Immagine di copertina', type: 'image', options: {hotspot: true}}),
    defineField({
      name: 'body',
      title: 'Contenuto',
      type: 'array',
      of: [{type: 'block'}, {type: 'image', options: {hotspot: true}}],
    }),
    defineField({name: 'published', title: 'Pubblicato', type: 'boolean', initialValue: false}),
  ],
  preview: {
    select: {title: 'title', date: 'date', media: 'cover', pub: 'published'},
    prepare({title, date, media, pub}) {
      return {title, subtitle: `${pub ? '🟢' : '⚪️'} ${date ?? ''}`, media}
    },
  },
})
