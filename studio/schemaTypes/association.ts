import {defineField, defineType} from 'sanity'

// ASSOCIAZIONI PARTNER
// Logo mostrato solo se logoAuthorized === true (autorizzazione all'uso).
export default defineType({
  name: 'association',
  title: 'Associazioni partner',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Nome', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'country', title: 'Paese', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'website', title: 'Sito web', type: 'url'}),
    defineField({name: 'logo', title: 'Logo', type: 'image', options: {hotspot: true}}),
    defineField({
      name: 'logoAuthorized',
      title: 'Uso del logo autorizzato',
      description: 'Spunta solo se l’associazione ha autorizzato l’uso del proprio logo.',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({name: 'order', title: 'Ordine', type: 'number', initialValue: 0}),
    defineField({name: 'published', title: 'Pubblicato', type: 'boolean', initialValue: false}),
  ],
  preview: {
    select: {title: 'name', country: 'country', media: 'logo', pub: 'published'},
    prepare({title, country, media, pub}) {
      return {title, subtitle: `${pub ? '🟢' : '⚪️'} ${country}`, media}
    },
  },
})
