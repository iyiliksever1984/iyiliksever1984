import { getCards } from './store.js';
import { shuffleArray } from './shuffle.js';

const initFab = (displayCardFn) => {
  const btnHome = document.getElementById('btn-home');
  const btnSwitch = document.getElementById('btn-switch');
  const btnSearch = document.getElementById('btn-search');
  const listOverlay = document.getElementById('list-overlay');

  if (btnHome && listOverlay) {
    btnHome.addEventListener('click', () => {
      const cards = shuffleArray(getCards());
      
      let html = `
        <div class="list-header">
          <h2 class="list-title">Sommaire</h2>
          <button class="btn-close-list" id="btn-close-list" aria-label="Fermer">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div class="list-content">
      `;
      
      cards.forEach(card => {
        let titleFr = card.titre_fr || card.titre || '';
        let titleAr = card.titre_ar || '';
        
        if (card.type === 'citation') {
           if (card.texte_fr) {
             const tempFr = document.createElement('div');
             tempFr.innerHTML = card.texte_fr;
             titleFr = tempFr.textContent.trim().substring(0, 50) + '...';
           }
           if (card.texte_ar) {
             const tempAr = document.createElement('div');
             tempAr.innerHTML = card.texte_ar;
             titleAr = tempAr.textContent.trim().substring(0, 50) + '...';
           }
        }
        
        let contentHtml = '';
        if (titleFr) contentHtml += `<div class="list-item-title">${titleFr}</div>`;
        if (titleAr) contentHtml += `<div class="list-item-title" style="font-family: var(--font-arabe); direction: rtl; text-align: center; margin-top: 8px;">${titleAr}</div>`;
        
        html += `
          <button class="list-item" data-id="${card.id}">
            ${contentHtml}
          </button>
        `;
      });
      
      html += `</div>`;
      listOverlay.innerHTML = html;
      listOverlay.classList.add('is-open');
      listOverlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      
      document.getElementById('btn-close-list').addEventListener('click', () => {
        listOverlay.classList.remove('is-open');
        listOverlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      });
      
      listOverlay.querySelectorAll('.list-item').forEach(item => {
        item.addEventListener('click', () => {
          const id = item.getAttribute('data-id');
          listOverlay.classList.remove('is-open');
          listOverlay.setAttribute('aria-hidden', 'true');
          document.body.style.overflow = '';
          if (displayCardFn) displayCardFn(id);
        });
      });
    });
  }

  if (btnSwitch) {
    btnSwitch.addEventListener('click', () => {
      if (displayCardFn) displayCardFn(); // Random card
    });
  }

  const btnShare = document.getElementById('btn-share');
  if (btnShare) {
    btnShare.addEventListener('click', async () => {
      const flux = document.getElementById('flux');
      const currentCard = flux.firstElementChild;
      if (currentCard) {
        const id = currentCard.id;
        let title = 'Contenu Orhan Oğlu';
        const type = currentCard.getAttribute('data-type');
        
        if (type === 'article' || type === 'livre') {
           const titleEl = currentCard.querySelector('h2');
           if (titleEl) title = titleEl.textContent;
        } else if (type === 'citation') {
           const textEl = currentCard.querySelector('.citation-traduction');
           if (textEl) {
             title = textEl.textContent.trim().substring(0, 40) + '...';
           }
        }
        
        const { shareCard } = await import('./share.js');
        shareCard({ id, titre: title });
      }
    });
  }

  const btnPrint = document.getElementById('btn-print');
  if (btnPrint) {
    btnPrint.addEventListener('click', () => {
      window.print();
    });
  }

  if (btnSearch) {
    btnSearch.addEventListener('click', () => {
      console.log('Ouverture de la recherche (Phase 9)');
    });
  }
};

export { initFab };
