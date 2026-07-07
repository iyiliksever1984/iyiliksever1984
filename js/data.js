const fetchIndex = async () => {
  const response = await fetch('data/index.json');
  if (!response.ok) throw new Error(`fetchIndex: HTTP ${response.status}`);
  return response.json();
};

const fetchCard = async (path) => {
  const response = await fetch(`data/${path}`);
  if (!response.ok) throw new Error(`fetchCard ${path}: HTTP ${response.status}`);
  return response.json();
};

const fetchAllCards = async () => {
  const paths = await fetchIndex();
  return Promise.all(paths.map(fetchCard));
};

export { fetchAllCards };
