const dependencies = [
  {
    src: 'https://cdnjs.cloudflare.com/ajax/libs/react-dom/17.0.1/umd/react-dom.production.min.js',
    attributes: ['crossorigin', ['async', 'true'], ['defer', 'false']],
  },
  {
    src: 'https://unpkg.com/single-spa-react@2.14.0/lib/single-spa-react.js',
    attributes: ['crossorigin'],
  },
  {
    src: 'https://unpkg.com/single-spa-react@2.14.0/lib/single-spa-react.js.map',
    attributes: ['crossorigin'],
    type: 'application/json',
  },
  {
    src: 'https://unpkg.com/styled-components/dist/styled-components.min.js',
    attributes: ['crossorigin'],
  },
  {
    src: 'https://cdnjs.cloudflare.com/ajax/libs/rxjs/6.6.3/rxjs.umd.min.js',
    attributes: ['crossorigin'],
  },
];

const loadDependencies = async (publicPath: string) => {
  return loadScripts([
    ...dependencies,
    {
      src: `${publicPath}/akasha.sdk.js`,
    },
  ]);
};
const loadScripts = async (
  scripts: { src: string; type?: string; attributes?: (string | string[])[] }[],
) => {
  let loadedScriptsCount = 0;
  const totalScriptsCount = scripts.filter(s => s.type !== 'application/json').length;

  return new Promise((resolve, reject) => {
    const onLoad = (ev: Event) => {
      loadedScriptsCount += 1;
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

const writeToHead = async (
  script: { src: string; type?: string; attributes?: (string | string[])[] },
  onLoad,
  onError,
) => {
  const { src, type = 'text/javascript', attributes = [] } = script;
  const scriptEl = document.createElement('script');
  scriptEl.type = type;
  scriptEl.src = src;
  if (attributes.length) {
    attributes.forEach(attr => {
      if (Array.isArray(attr)) {
        const [key, val] = attr;
        scriptEl.setAttribute(key, val);
      } else {
        scriptEl.setAttribute(attr, 'true');
      }
    });
  }
  scriptEl.addEventListener('load', onLoad);
  scriptEl.addEventListener('error', () => onError(src));
  const head = document.getElementsByTagName('head')[0];
  head.appendChild(scriptEl);
};

export default loadDependencies;
