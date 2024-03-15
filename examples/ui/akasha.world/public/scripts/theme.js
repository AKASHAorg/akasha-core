let theme;

const darkThemeImgSrc = '/img/LOADER-AKASHA-WORLD-DARK.webp';
const lightThemeImgSrc = '/img/LOADER-AKASHA-WORLD-LIGHT.webp';

// @warning: must be the same as ThemingEvents.ThemeChange enum in typings
window.addEventListener('theme-change', ev => {
  if (ev.detail.theme === 'Dark-Theme') {
    return document.body.classList.add('dark', 'bg-black');
  } else {
    if (document.body.classList.contains('dark', 'bg-black')) {
      return document.body.classList.remove('dark', 'bg-black');
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
        document.body.classList.add('dark', 'bg-black');
      } else {
        document.body.classList.remove('dark', 'bg-black');
      }
    });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  //Find the splash image element
  const splashScreenTpl = document.getElementById('splash-screen-tpl');
  const splashImage = splashScreenTpl.content.childNodes[1].lastElementChild;

  if (theme) {
    document.body.classList.add(theme, 'bg-black');
    splashImage.src = darkThemeImgSrc;
  } else {
    splashImage.src = lightThemeImgSrc;
  }
});
