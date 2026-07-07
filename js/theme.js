const getTheme = () => {
  return document.documentElement.getAttribute('data-theme') || 'light';
};

const setTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  
  document.querySelectorAll('.theme-switch-checkbox').forEach(cb => {
    cb.checked = theme === 'dark';
  });
};

const toggleTheme = () => {
  const current = getTheme();
  setTheme(current === 'light' ? 'dark' : 'light');
};

const initTheme = () => {
  const current = getTheme();
  document.querySelectorAll('.theme-switch-checkbox').forEach(cb => {
    cb.checked = current === 'dark';
    cb.addEventListener('change', toggleTheme);
  });
};

export { initTheme, toggleTheme };
