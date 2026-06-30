import {defineField, defineType} from 'sanity'

// IMMAGINI DEL SITO (a posizione fissa)
// Ogni voce occupa una "posizione" predefinita del sito (hero, card della home...).
// L'editor sceglie la posizione e carica l'immagine. Il sito legge per posizione.
export default defineType({
  name: 'siteImage',
  title: 'Immagini del sito',
  type: 'document',
  fields: [
    defineField({
      name: 'slot',
      title: 'Posizione',
      type: 'string',
      description: 'Dove appare l\u2019immagine sul sito. Ogni posizione va usata una sola volta.',
      options: {
        list: [
          {title: 'Home — Foto principale (hero)', value: 'hero'},
          {title: 'Home — Card "Blueland 2100"', value: 'card-blueland'},
          {title: 'Home — Card "Diventa Ambassador"', value: 'card-ambassador'},
          {title: 'Home — Card "Wall of Wonder"', value: 'card-wall'},
          {title: 'Home — Card "Associazioni"', value: 'card-associations'},
          {title: 'Home — Card "News"', value: 'card-news'},
          {title: 'Home — Card "Gallery"', value: 'card-gallery'},
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'image',
      title: 'Immagine',
      type: 'image',
      options: {hotspot: true},
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'alt',
      title: 'Testo alternativo (descrizione per accessibilità)',
      description: 'Breve descrizione di cosa mostra la foto. Importante per accessibilità e SEO.',
      type: 'string',
    }),
  ],
  preview: {
    select: {slot: 'slot', media: 'image'},
    prepare({slot, media}) {
      const labels = {
        hero: 'Home — Foto principale',
        'card-blueland': 'Card Blueland 2100',
        'card-ambassador': 'Card Diventa Ambassador',
        'card-wall': 'Card Wall of Wonder',
        'card-associations': 'Card Associazioni',
        'card-news': 'Card News',
        'card-gallery': 'Card Gallery',
      }
      return {title: labels[slot] ?? slot, media}
    },
  },
})
