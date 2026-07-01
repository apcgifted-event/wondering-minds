// Client Sanity lato sito (Astro). Legge i contenuti pubblicati dal CMS.
// Variabili in .env del progetto Astro (vedi .env.example nella root).
import {createClient} from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

const projectId = import.meta.env.SANITY_PROJECT_ID
const dataset = import.meta.env.SANITY_DATASET || 'production'

// Il client viene creato solo se il CMS è collegato (projectId presente).
// Senza credenziali resta null e le query restituiscono [] (modalità fallback).
export const sanityClient = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion: '2024-01-01',
      useCdn: true, // CDN: ottimo per contenuti pubblici, veloce ed economico
    })
  : null

const builder = sanityClient ? imageUrlBuilder(sanityClient) : null
export function urlFor(source) {
  if (!builder) return {url: () => ''}
  return builder.image(source)
}

// -------- QUERY (GROQ) --------

// Reel pubblicabili: published == true E consentOnFile == true. Ordinati per 'order'.
export async function getReels() {
  if (!sanityClient) return [] // se il CMS non è ancora collegato, niente errori: lista vuota
  return sanityClient.fetch(
    `*[_type == "reel" && published == true && consentOnFile == true] | order(order asc){
      "id": _id, name, age, country, countryCode, source, platform, embedUrl,
      "videoUrl": video.asset->url,
      "posterUrl": poster.asset->url
    }`
  )
}

export async function getNews(lang = 'it') {
  if (!sanityClient) return []
  return sanityClient.fetch(
    `*[_type == "newsPost" && published == true] | order(date desc){
      "id": _id, "slug": slug.current, date,
      "title": coalesce(title_${lang}, title_it),
      "summary": coalesce(summary_${lang}, summary_it),
      "coverUrl": cover.asset->url
    }`
  )
}

// Singola news per slug (con il corpo in Portable Text), per la pagina di dettaglio.
export async function getNewsPost(slug, lang = 'it') {
  if (!sanityClient) return null
  const doc = await sanityClient.fetch(
    `*[_type == "newsPost" && slug.current == $slug && published == true][0]{
      "title": coalesce(title_${lang}, title_it),
      date,
      "summary": coalesce(summary_${lang}, summary_it),
      "body": coalesce(body_${lang}, body_it),
      "coverUrl": cover.asset->url
    }`,
    { slug }
  )
  return doc || null
}

export async function getAssociations() {
  if (!sanityClient) return []
  return sanityClient.fetch(
    `*[_type == "association" && published == true] | order(order asc){
      "id": _id, name, country, website, logoAuthorized,
      "logoUrl": logo.asset->url
    }`
  )
}

// Recupera una pagina di testo (es. "about") con i campi nella lingua richiesta.
// Ritorna null se il CMS non è collegato o la pagina non esiste/non è pubblicata,
// così la pagina del sito usa il fallback locale.
export async function getPage(slug, lang = 'it') {
  if (!sanityClient) return null
  const doc = await sanityClient.fetch(
    `*[_type == "page" && slug.current == $slug && published == true][0]{
      "eyebrow": coalesce(eyebrow_${lang}, eyebrow_it),
      "title": coalesce(title_${lang}, title_it),
      "intro": coalesce(intro_${lang}, intro_it),
      "body": coalesce(body_${lang}, body_it),
      "facts": facts[]{ "label": coalesce(label_${lang}, label_it), "value": coalesce(value_${lang}, value_it), url },
      tourUrl
    }`,
    { slug }
  )
  return doc || null
}

// Immagini a posizione fissa (hero, card della home).
// Ritorna una mappa { slot: { url, alt } } per accesso diretto, es. images.hero.
export async function getSiteImages() {
  if (!sanityClient) return {}
  const rows = await sanityClient.fetch(
    `*[_type == "siteImage" && defined(image)]{ slot, alt, "url": image.asset->url }`
  )
  const map = {}
  for (const r of rows || []) map[r.slot] = { url: r.url, alt: r.alt || '' }
  return map
}

// Immagini della gallery, ordinate, con didascalia nella lingua richiesta.
export async function getGallery(lang = 'it') {
  if (!sanityClient) return []
  return sanityClient.fetch(
    `*[_type == "galleryImage" && published == true] | order(order asc){
      "id": _id, "url": image.asset->url, alt,
      "caption": coalesce(caption_${lang}, caption_it)
    }`
  )
}

// FAQ pubblicate, ordinate, con domanda/risposta nella lingua richiesta.
export async function getFaqs(lang = 'it') {
  if (!sanityClient) return []
  return sanityClient.fetch(
    `*[_type == "faq" && published == true] | order(order asc){
      "id": _id,
      "question": coalesce(question_${lang}, question_it),
      "answer": coalesce(answer_${lang}, answer_it)
    }`
  )
}

// Post-it del Wall of Wonder, pubblicati e ordinati.
export async function getWallNotes() {
  if (!sanityClient) return []
  return sanityClient.fetch(
    `*[_type == "wallNote" && published == true] | order(order asc){
      "id": _id, text, author, color
    }`
  )
}
