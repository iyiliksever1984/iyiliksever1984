import { fetchAllCards } from './data.js';
import { setCards, getCards } from './store.js';
import { shuffleArray } from './shuffle.js';
import { renderCard } from './render.js';

const init = async () => {
  try {
    const cards = await fetchAllCards();
    setCards(shuffleArray(cards));
    const flux = document.getElementById('flux');
    getCards().forEach((cardData) => {
      const el = renderCard(cardData);
      if (el) flux.appendChild(el);
    });
  } catch (error) {
    console.error(error);
  }
};

init();

