export const shareCard = async ({ id, titre }) => {
  const url = `${window.location.origin}${window.location.pathname}?id=${id}`;
  const text = `Découvrez sur Orhan Oğlu : ${titre}`;
  
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Orhan Oğlu',
        text: text,
        url: url,
      });
    } catch (err) {
      console.log('Partage annulé ou échoué', err);
    }
  } else {
    try {
      await navigator.clipboard.writeText(url);
      showToast('Lien copié dans le presse-papier !');
    } catch (err) {
      showToast('Impossible de copier le lien.');
    }
  }
};

const showToast = (message) => {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
};
