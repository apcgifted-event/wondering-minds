import {defineField, defineType} from 'sanity'

// WALL OF WONDER — un post-it per documento.
// Testo breve, autore facoltativo, colore, ordine.
export default defineType({
  name: 'wallNote',
  title: 'Wall of Wonder — Post-it',
  type: 'document',
  fields: [
    defineField({
      name: 'text',
      title: 'Testo del post-it',
      type: 'text',
      rows: 3,
      validation: (r) => r.required().max(180),
    }),
    defineField({
      name: 'author',
      title: 'Autore / provenienza (facoltativo)',
      description: 'Es. "Giulia, Italia" oppure "Famiglia da Berlino". Solo nome, senza cognome per i minori.',
      type: 'string',
    }),
    defineField({
      name: 'color',
      title: 'Colore',
      type: 'string',
      options: {
        list: [
          {title: 'Giallo', value: 'yellow'},
          {title: 'Rosa', value: 'pink'},
          {title: 'Verde', value: 'green'},
          {title: 'Azzurro', value: 'blue'},
          {title: 'Arancio', value: 'orange'},
        ],
        layout: 'radio',
      },
      initialValue: 'yellow',
    }),
    defineField({
      name: 'order',
      title: 'Ordine',
      type: 'number',
      initialValue: 0,
    }),
    defineField({name: 'published', title: 'Pubblicato', type: 'boolean', initialValue: false}),
  ],
  orderings: [
    {title: 'Ordine', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]},
  ],
  preview: {
    select: {title: 'text', author: 'author', pub: 'published'},
    prepare({title, author, pub}) {
      return {title: title || '(post-it vuoto)', subtitle: `${pub ? '🟢' : '⚪️'} ${author || ''}`}
    },
  },
})
