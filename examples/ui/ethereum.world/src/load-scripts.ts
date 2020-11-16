export const loadScripts = async (scripts: { src: string; type?: string }[]) => {
  let loadedScriptsCount = 0;
  const totalScriptsCount = scripts.filter(s => s.type !== 'application/json').length;

  return new Promise((resolve, reject) => {
    const onLoad = (ev: Event) => {
      loadedScriptsCount += 1;
      console.log('script loaded!', loadedScriptsCount, totalScriptsCount, ev);
      if (loadedScriptsCount === totalScriptsCount) {
        return resolve();
      }
    };
    const onError = (src: string) => {
      reject(new Error(`failed to load script with src: ${src}`));
    };
    for (const script of scripts) {
      writeToHead(script, onLoad, onError);
    }
  });
};

const writeToHead = async (script: { src: string; type?: string }, onLoad, onError) => {
  const { src, type = 'text/javascript' } = script;
  const scriptEl = document.createElement('script');
  scriptEl.type = type || 'text/javascript';
  scriptEl.async = true;
  scriptEl.src = src;
  scriptEl.addEventListener('load', onLoad);
  scriptEl.addEventListener('error', () => onError(src));
  const head = document.getElementsByTagName('head')[0];
  head.appendChild(scriptEl);
};
