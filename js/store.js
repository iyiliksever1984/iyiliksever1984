const state = {
  cards: [],
  theme: 'light',
};

const setCards = (cards) => {
  state.cards = cards;
};

const getCards = () => state.cards;

const setTheme = (theme) => {
  state.theme = theme;
};

const getTheme = () => state.theme;

export { setCards, getCards, setTheme, getTheme };
