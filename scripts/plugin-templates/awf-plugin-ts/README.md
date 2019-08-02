# {{name}}

> {{description}}

### Maintainer
[{{author}}](https://github.com/{{author}})

## Install

```bash
npm install --save {{name}}
```

## Development

`cd {{name}}` then `npm start`

In a new terminal:

`cd {{name}}/example` then `npm start`

Make changes in `{{name}}/src/App.tsx`

View changes in browser

NOTE: You must navigate to the plugins root route to see it in browser!

## Usage

With `create-react-app`

@todo add more docs!

```tsx
import AppLoader from 'awf-plugin-loader';
import {{name}} from '{{name}}';

// ...
const app = new AppLoader(/* LoaderConfig */);

app.registerPlugin('{{name}}');

app.start();
```


## License

{{license}} © [Akasha Foundation](https://akasha.org/)
