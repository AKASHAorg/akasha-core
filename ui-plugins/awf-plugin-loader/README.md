# awf-plugin-loader

> plugin loader for AWF

## Install

```bash
npm install --save awf-plugin-loader
```

## Usage

```tsx
import AppLoader from 'awf-plugin-loader';
import SamplePlugin from 'awf-plugin-sample';

const app = AppLoader({/*..loaderConfig*/});

app.registerPlugin(SamplePlugin);

app.start();

```

## License

MIT © [AKASHA Foundation](https://akasha.org/)
