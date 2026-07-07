import { applyLettrine } from './lettrine.js';
import { applyManuscriptEffect } from './manuscript.js';

const createEl = (tag, { className, text, html, attrs } = {}) => {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined) el.textContent = text;
  if (html !== undefined) el.innerHTML = html;
  if (attrs) Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  return el;
};

const renderArticle = ({
  id,
  titre_fr,
  titre_ar,
  extraits,
}) => {
  const card = createEl('article', {
    className: 'card card-article',
    attrs: { id, 'data-type': 'article' },
  });
  const inner = createEl('div', { className: 'card-inner' });

  const header = createEl('header', { className: 'card-header' });
  header.appendChild(createEl('h2', { className: 'card-titre', text: titre_fr }));
  if (titre_ar) {
    header.appendChild(createEl('p', {
      className: 'card-titre-ar texte-arabe',
      text: titre_ar,
      attrs: { dir: 'rtl', lang: 'ar' },
    }));
  }

  const body = createEl('div', { className: 'card-body bloc-bilingue' });
  let fullFrenchText = '';

  if (extraits && extraits.length) {
    const ul = createEl('ul', { className: 'livre-extraits article-extraits' });
    extraits.forEach(({ texte_ar: ar, texte_fr: fr }) => {
      const li = createEl('li', { className: 'livre-extrait article-extrait' });
      if (ar) {
        li.appendChild(createEl('blockquote', {
          className: 'extrait-ar texte-arabe',
          html: ar,
          attrs: { dir: 'rtl', lang: 'ar' },
        }));
      }
      if (fr) {
        li.appendChild(createEl('p', { className: 'extrait-fr', html: fr }));
        fullFrenchText += ' ' + fr;
      }
      ul.appendChild(li);
    });
    body.appendChild(ul);
  }

  inner.appendChild(header);
  inner.appendChild(body);
  card.appendChild(inner);
  
  applyLettrine(card, fullFrenchText);
  applyManuscriptEffect(inner);
  return card;
};

const renderCitation = ({ id, texte_ar, texte_fr }) => {
  const card = createEl('article', {
    className: 'card card-citation',
    attrs: { id, 'data-type': 'citation' },
  });
  const inner = createEl('div', { className: 'card-inner' });

  inner.appendChild(createEl('blockquote', {
    className: 'citation-arabe texte-arabe',
    html: texte_ar,
    attrs: { dir: 'rtl', lang: 'ar' },
  }));
  inner.appendChild(createEl('p', { className: 'citation-traduction', html: texte_fr }));

  card.appendChild(inner);
  applyManuscriptEffect(inner);
  return card;
};

const renderLivre = ({
  id,
  titre_fr,
  titre_ar,
  auteur,
  annee,
  image_couverture,
  biographie_auteur_fr,
  extraits,
}) => {
  const card = createEl('article', {
    className: 'card card-livre',
    attrs: { id, 'data-type': 'livre' },
  });
  const inner = createEl('div', { className: 'card-inner' });
  const hero = createEl('div', { className: 'livre-hero' });

  if (image_couverture) {
    const figure = createEl('figure', { className: 'livre-couverture' });
    figure.appendChild(createEl('img', {
      attrs: { src: image_couverture, alt: `Couverture : ${titre_fr}`, loading: 'lazy' },
    }));
    hero.appendChild(figure);
  }

  const intro = createEl('div', { className: 'livre-intro' });
  const meta = createEl('div', { className: 'livre-meta' });
  meta.appendChild(createEl('h2', { className: 'livre-titre', text: titre_fr }));
  if (titre_ar) {
    meta.appendChild(createEl('p', {
      className: 'livre-titre-ar texte-arabe',
      text: titre_ar,
      attrs: { dir: 'rtl', lang: 'ar' },
    }));
  }
  if (auteur) meta.appendChild(createEl('p', { className: 'livre-auteur', text: auteur }));
  if (annee) meta.appendChild(createEl('p', { className: 'livre-annee', text: annee }));
  intro.appendChild(meta);
  hero.appendChild(intro);
  inner.appendChild(hero);

  if (biographie_auteur_fr) {
    inner.appendChild(createEl('p', { className: 'livre-biographie', text: biographie_auteur_fr }));
  }

  if (extraits && extraits.length) {
    const introExtraits = createEl('p', { className: 'livre-extraits-intro', text: 'Voici quelques extraits :' });
    inner.appendChild(introExtraits);

    const ul = createEl('ul', { className: 'livre-extraits' });
    extraits.forEach(({ texte_ar: ar, texte_fr: fr }) => {
      const li = createEl('li', { className: 'livre-extrait' });
      if (ar) {
        li.appendChild(createEl('blockquote', {
          className: 'extrait-ar texte-arabe',
          html: ar,
          attrs: { dir: 'rtl', lang: 'ar' },
        }));
      }
      if (fr) li.appendChild(createEl('p', { className: 'extrait-fr', html: fr }));
      ul.appendChild(li);
    });
    inner.appendChild(ul);
  }

  card.appendChild(inner);
  applyManuscriptEffect(inner);
  return card;
};

const renderers = {
  article: renderArticle,
  citation: renderCitation,
  livre: renderLivre,
};

const renderCard = (cardData) => {
  const render = renderers[cardData.type];
  return render ? render(cardData) : null;
};

export { renderCard };
