import { loadScripts } from './load-scripts';

const dependencies = [
  {
    src: 'https://cdnjs.cloudflare.com/ajax/libs/react/17.0.1/umd/react.production.min.js',
    attributes: ['crossorigin', ['async', 'true'], ['defer', 'false']],
  },
  {
    src: 'https://cdnjs.cloudflare.com/ajax/libs/react-is/17.0.1/umd/react-is.production.min.js',
    attributes: ['crossorigin', ['async', 'true'], ['defer', 'false']],
  },
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
    type: 'module',
  },
  {
    src: 'https://cdnjs.cloudflare.com/ajax/libs/rxjs/6.6.3/rxjs.umd.min.js',
    attributes: ['crossorigin'],
  },
];

const loadDependencies = async (customCDN: { host: string; port: string }) => {
  return loadScripts([
    ...dependencies,
    {
      src: `${customCDN.host}:${customCDN.port}/akasha.sdk.js`,
    },
  ]);
};

export default loadDependencies;
