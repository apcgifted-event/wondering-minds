import {defineField, defineType} from 'sanity'

// IMMAGINI GALLERY (elenco libero)
// L'editor aggiunge quante foto vuole, con didascalia bilingue e ordine.
export default defineType({
  name: 'galleryImage',
  title: 'Gallery — Immagini',
  type: 'document',
  fields: [
    defineField({
      name: 'image',
      title: 'Foto',
      type: 'image',
      options: {hotspot: true},
      validation: (r) => r.required(),
    }),
    defineField({name: 'caption_it', title: 'Didascalia (IT)', type: 'string'}),
    defineField({name: 'caption_en', title: 'Didascalia (EN)', type: 'string'}),
    defineField({
      name: 'alt',
      title: 'Testo alternativo (accessibilità)',
      type: 'string',
    }),
    defineField({
      name: 'order',
      title: 'Ordine',
      description: 'Numero per ordinare le foto (più basso = prima).',
      type: 'number',
      initialValue: 0,
    }),
    defineField({name: 'published', title: 'Pubblicata', type: 'boolean', initialValue: true}),
  ],
  orderings: [
    {title: 'Ordine', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]},
  ],
  preview: {
    select: {title: 'caption_it', media: 'image', pub: 'published'},
    prepare({title, media, pub}) {
      return {title: title || 'Foto', subtitle: pub ? '🟢 visibile' : '⚪️ nascosta', media}
    },
  },
})
