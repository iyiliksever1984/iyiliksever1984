export const initPWA = () => {
  let deferredPrompt;
  const btnInstallSidebar = document.getElementById('btn-install-sidebar');
  const btnInstallDrawer = document.getElementById('btn-install-drawer');

  // Cacher les boutons par défaut
  if (btnInstallSidebar) btnInstallSidebar.style.display = 'none';
  if (btnInstallDrawer) btnInstallDrawer.style.display = 'none';

  // Écouter l'événement d'installation disponible
  window.addEventListener('beforeinstallprompt', (e) => {
    // Empêcher l'invite par défaut de Chrome
    e.preventDefault();
    // Sauvegarder l'événement pour le déclencher plus tard
    deferredPrompt = e;
    
    // Afficher les boutons d'installation avec flex pour garder le centrage
    if (btnInstallSidebar) btnInstallSidebar.style.display = 'flex';
    if (btnInstallDrawer) btnInstallDrawer.style.display = 'flex';
  });

  const installApp = async () => {
    if (!deferredPrompt) return;
    
    // Afficher l'invite d'installation
    deferredPrompt.prompt();
    
    // Attendre la réponse de l'utilisateur
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`Résultat de l'installation: ${outcome}`);
    
    // Réinitialiser la variable
    deferredPrompt = null;
    
    // Cacher les boutons
    if (btnInstallSidebar) btnInstallSidebar.style.display = 'none';
    if (btnInstallDrawer) btnInstallDrawer.style.display = 'none';
  };

  if (btnInstallSidebar) btnInstallSidebar.addEventListener('click', installApp);
  if (btnInstallDrawer) btnInstallDrawer.addEventListener('click', installApp);

  window.addEventListener('appinstalled', () => {
    console.log('PWA a été installée');
    // S'assurer que les boutons sont bien cachés après installation
    if (btnInstallSidebar) btnInstallSidebar.style.display = 'none';
    if (btnInstallDrawer) btnInstallDrawer.style.display = 'none';
  });
};
