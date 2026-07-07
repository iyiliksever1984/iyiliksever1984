import { getCards } from './store.js';

export const initSearch = (displayCardCallback) => {
  const btnSearch = document.getElementById('btn-search');
  const btnClose = document.getElementById('btn-close-search');
  const searchOverlay = document.getElementById('search-overlay');
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');

  if (!btnSearch || !searchOverlay || !searchInput || !searchResults) return;

  const openSearch = () => {
    searchOverlay.setAttribute('aria-hidden', 'false');
    searchInput.value = '';
    searchResults.innerHTML = '';
    // Focus après l'animation
    setTimeout(() => searchInput.focus(), 300);
  };

  const closeSearch = () => {
    searchOverlay.setAttribute('aria-hidden', 'true');
    searchInput.value = '';
  };

  btnSearch.addEventListener('click', openSearch);
  if (btnClose) btnClose.addEventListener('click', closeSearch);

  // Fermeture avec Echap
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchOverlay.getAttribute('aria-hidden') === 'false') {
      closeSearch();
    }
  });

  // Recherche à chaque frappe
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    if (query.length < 2) {
      searchResults.innerHTML = '';
      return;
    }

    const cards = getCards();
    const results = cards.filter(card => {
      // Construction d'une chaîne de recherche globale par carte
      let textToSearch = '';
      if (card.titre_fr) textToSearch += card.titre_fr + ' ';
      if (card.titre_ar) textToSearch += card.titre_ar + ' ';
      if (card.texte_fr) textToSearch += card.texte_fr + ' ';
      if (card.texte_ar) textToSearch += card.texte_ar + ' ';
      if (card.auteur) textToSearch += card.auteur + ' ';

      if (card.extraits) {
        card.extraits.forEach(ex => {
          textToSearch += ex.texte_fr + ' ' + ex.texte_ar + ' ';
        });
      }
      
      return textToSearch.toLowerCase().includes(query);
    });

    renderResults(results, query);
  });

  const renderResults = (results, query) => {
    searchResults.innerHTML = '';

    if (results.length === 0) {
      searchResults.innerHTML = '<p style="text-align:center; color:var(--c-text-muted); margin-top:var(--sp-xl);">Aucun résultat trouvé pour "' + query + '".</p>';
      return;
    }

    results.forEach(card => {
      const item = document.createElement('div');
      item.className = 'search-result-item';
      item.tabIndex = 0; // Pour la navigation au clavier
      
      let title = card.titre_fr || card.texte_fr?.substring(0, 50) + '...';
      let excerpt = '';
      
      if (card.type === 'article' || card.type === 'livre') {
        excerpt = card.type === 'article' ? 'Article' : ('Livre de ' + (card.auteur || ''));
      } else {
        excerpt = 'Citation';
      }

      item.innerHTML = `
        <div class="search-result-title">${title}</div>
        <div class="search-result-excerpt">${excerpt}</div>
      `;

      // Action au clic
      const onSelect = () => {
        closeSearch();
        displayCardCallback(card.id);
      };

      item.addEventListener('click', onSelect);
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') onSelect();
      });

      searchResults.appendChild(item);
    });
  };
};
