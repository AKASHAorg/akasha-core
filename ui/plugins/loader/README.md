# awf-plugin-loader

> plugin loader for AWF

## Install

```bash
npm install --save @akashaproject/ui-plugin-loader
```

## Usage

```tsx
import AppLoader from '@akashaproject/ui-plugin-loader';
import SamplePlugin from 'plugin-sample';

const app = AppLoader({
  /*..loaderConfig*/
});

app.registerPlugin(SamplePlugin);

app.start();
```

## License

MIT © [AKASHA Foundation](https://akasha.org/)
