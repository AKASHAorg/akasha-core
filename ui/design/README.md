# akasha-design-system

## Available Scripts

> Run tests

``` shell script
$ npm run tests
```

> Start the storybook dev

``` shell script
$ npm run storybook
```

> Package the storybook

``` shell script
$ npm run build-storybook
```

> Package the library

``` shell script
npm run build
```

<small><em>This library is based on create-react-app and storybook</em></small>

## Usage

### `Themes`

**Simple usage**

```js
import * as React from 'react';
import { createAkashaTheme, ThemeProvider } from '@akasha/design-system';
import App from './my-custom-akasha-app';

myCustomLightTheme = createAkashaTheme({
  colors: {
    background: '#FFF',
    defaultMargin: '2px',
    borderRadius: '4px',
  },
});

myCustomDarkTheme = createAkashaTheme(/* ... my custom overrides (optional) ... */);

/**
 * Fetch current/active theme (from db or localhost etc.)
 */
const currentThemeName = getActiveThemeFromSomewhere();

React.render(
  <ThemeProvider theme={currentThemeName === 'light' ? myCustomLightTheme : myCustomDarkTheme}>
    <App />
  </ThemeProvider>,
  document.getElementById('app-root'),
);
```

**Example of theme**

You can create your custom theme from scratch or by using only some variables from AKASHA's design system.
Note: You must use the same key names (variables) as they are defined in akasha-design-system.

```js
// ./akasha-solarized-dark.ts
import { createAkashaTheme } from '@akasha/design-system';

const colors = {
    background: '#002b36',
    color: '#657b83',
}

const spacings = {
    defaultMargin: '16px';
    fontSize: '14px';
    cardPadding: '10px'
}

const solarizedDarkTheme = createAkashaTheme({ colors, spacings });

export default solarizedDarkTheme;
```
