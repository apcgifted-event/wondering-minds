// Pagina Privacy — fallback. Il testo completo è gestibile da Sanity
// (slug "privacy", campo Contenuto). Questo scaffold resta finché non lo si
// sostituisce con l'informativa validata dal Gruppo Legale.
export const privacyContent = {
  it: {
    eyebrow: 'Informativa',
    title: 'Privacy e cookie',
    intro: 'Da completare prima del go-live: l\u2019informativa definitiva va redatta e validata dal Gruppo Legale.',
    sections: [
      { heading: 'Titolare del trattamento', paragraphs: [
        'Carano 4 Children — Fondation priv\u00e9e. Rue Belliard 202, 1040 Brussels, Belgium. info@carano4children.org',
      ] },
      { heading: 'Cookie', paragraphs: [
        'Il sito adotta un approccio privacy-first: nessun cookie di tracciamento o script di terze parti viene caricato prima del consenso esplicito.',
      ] },
      { heading: 'Dati dei minori', paragraphs: [
        'Il progetto tratta dati di minori: serve base giuridica documentata, consenso verificabile, minimizzazione e una data retention policy. Sezione da completare con il Gruppo Legale.',
      ] },
    ],
  },
  en: {
    eyebrow: 'Notice',
    title: 'Privacy & cookies',
    intro: 'To be completed before go-live: the final notice must be drafted and validated by the Legal team.',
    sections: [
      { heading: 'Data controller', paragraphs: [
        'Carano 4 Children — Fondation priv\u00e9e. Rue Belliard 202, 1040 Brussels, Belgium. info@carano4children.org',
      ] },
      { heading: 'Cookies', paragraphs: [
        'The site takes a privacy-first approach: no tracking cookies or third-party scripts are loaded before explicit consent.',
      ] },
      { heading: 'Children\u2019s data', paragraphs: [
        'The project processes minors\u2019 data: a documented legal basis, verifiable consent, minimisation and a data retention policy are required. Section to be completed with the Legal team.',
      ] },
    ],
  },
};
