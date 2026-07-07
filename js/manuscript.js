const SHIFT_PROBABILITY = 0.2;
const MAX_SHIFT_PX = 0.9;

const applyManuscriptEffect = (el) => {
  if (!el) return;

  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  let node;

  while ((node = walker.nextNode())) {
    const parent = node.parentElement;
    if (!parent) continue;
    if (parent.closest('[dir="rtl"], .texte-arabe, .drop-cap')) continue;
    if (node.textContent.trim()) textNodes.push(node);
  }

  textNodes.forEach((textNode) => {
    const text = textNode.textContent;
    const fragment = document.createDocumentFragment();

    for (const char of text) {
      if (/\p{L}/u.test(char) && Math.random() < SHIFT_PROBABILITY) {
        const shift = ((Math.random() * MAX_SHIFT_PX * 2) - MAX_SHIFT_PX).toFixed(1);
        const span = document.createElement('span');
        span.className = 'ms-char';
        span.style.setProperty('--ms-shift', `${shift}px`);
        span.textContent = char;
        fragment.appendChild(span);
      } else {
        fragment.appendChild(document.createTextNode(char));
      }
    }

    textNode.replaceWith(fragment);
  });
};

export { applyManuscriptEffect };
