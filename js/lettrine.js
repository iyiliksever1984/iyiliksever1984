const stripHtml = (html) => {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || '';
};

const findFirstFrenchParagraph = (corpsFr) => {
  for (const p of corpsFr.querySelectorAll('p')) {
    if (!p.getAttribute('dir') && !p.classList.contains('texte-arabe') && p.textContent.trim()) {
      return p;
    }
  }
  return null;
};

const applyLettrine = (cardEl, bodyHtml) => {
  if (stripHtml(bodyHtml).length <= 500) return;

  const container = cardEl.querySelector('.card-body') || cardEl;
  
  const target = findFirstFrenchParagraph(container);
  if (!target) return;

  const walker = document.createTreeWalker(target, NodeFilter.SHOW_TEXT);
  const textNode = walker.nextNode();
  if (!textNode) return;

  const text = textNode.textContent;
  const match = text.match(/^(\s*)(\p{L})/u);
  if (!match) return;

  const [, spaces, letter] = match;
  const rest = text.slice(spaces.length + 1);

  const span = document.createElement('span');
  span.className = 'drop-cap';
  span.textContent = letter;

  const fragment = document.createDocumentFragment();
  if (spaces) fragment.appendChild(document.createTextNode(spaces));
  fragment.appendChild(span);
  if (rest) fragment.appendChild(document.createTextNode(rest));

  textNode.replaceWith(fragment);
};

export { applyLettrine };

