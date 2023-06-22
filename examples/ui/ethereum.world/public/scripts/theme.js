let theme;

window.addEventListener('theme-change', ev => {
  if (ev.detail.theme === 'Dark-Theme') {
    return document.body.classList.add('dark');
  } else {
    if (document.body.classList.contains('dark')) {
      return document.body.classList.remove('dark');
    }
  }
});
if (window.localStorage) {
  if (window.localStorage.getItem('Theme') === 'Dark-Theme') {
    theme = 'dark';
  } else if (!window.localStorage.getItem('Theme')) {
    const darkMode = window.matchMedia('(prefers-color-scheme: dark)');
    if (darkMode.matches) {
      theme = 'dark';
    }
    darkMode.addEventListener('change', ev => {
      if (ev.matches) {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
    });
  }
}
if (theme) {
  window.addEventListener('load', () => {
    document.body.classList.add(theme);
  });
}
