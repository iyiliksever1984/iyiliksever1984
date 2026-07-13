import { fetchAllCards } from './data.js';
import { setCards, getCards } from './store.js';
import { shuffleArray } from './shuffle.js';
import { renderCard } from './render.js';
import { initTheme } from './theme.js';
import { initMenu } from './menu.js';
import { initFab } from './fab.js';
import { initSearch } from './search.js';
import { initPWA } from './pwa.js';

export const displayCard = (id) => {
  const cards = getCards();
  if (!cards || cards.length === 0) return;
  
  let cardData;
  if (id) {
    cardData = cards.find(c => c.id === id);
  } else {
    const randomIndex = Math.floor(Math.random() * cards.length);
    cardData = cards[randomIndex];
  }
  
  if (!cardData) return;
  
  const flux = document.getElementById('flux');
  flux.innerHTML = ''; // Nettoyer le conteneur
  
  const el = renderCard(cardData);
  if (el) {
    flux.appendChild(el);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const init = async () => {
  initTheme();
  initMenu();
  initPWA();
  
  try {
    const cards = await fetchAllCards();
    setCards(cards);

    // Vérifier si un ID est présent dans l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const sharedId = urlParams.get('id');

    if (sharedId) {
      displayCard(sharedId);
    } else {
      displayCard(); // Afficher une carte au hasard au démarrage
    }

    initFab(displayCard);
    initSearch(displayCard);
  } catch (error) {
    console.error(error);
  }

  // Enregistrement du Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/iyiliksever1984/sw.js')
        .then(reg => console.log('Service Worker enregistré avec succès.', reg.scope))
        .catch(err => console.error('Erreur lors de l\'enregistrement du SW:', err));
    });
  }
};

init();

