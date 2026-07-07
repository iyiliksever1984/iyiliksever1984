const initMenu = () => {
  const btnHamburger = document.getElementById('btn-hamburger');
  const menuDrawer = document.getElementById('menu-drawer');
  const menuOverlay = document.getElementById('menu-overlay');

  if (!btnHamburger || !menuDrawer || !menuOverlay) return;

  const toggleMenu = () => {
    const isExpanded = btnHamburger.getAttribute('aria-expanded') === 'true';
    btnHamburger.setAttribute('aria-expanded', !isExpanded);
    menuDrawer.classList.toggle('is-open');
    menuOverlay.classList.toggle('is-visible');
    menuDrawer.setAttribute('aria-hidden', isExpanded);
    menuOverlay.setAttribute('aria-hidden', isExpanded);
    
    document.body.style.overflow = isExpanded ? '' : 'hidden';
  };

  btnHamburger.addEventListener('click', toggleMenu);
  menuOverlay.addEventListener('click', toggleMenu);
};

export { initMenu };
