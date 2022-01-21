## Description

App loader is the central module for micro-frontends (apps)
Built as a layer over the single-spa library, it provides the required functionality
to install/uninstall, load/unload apps, widgets and plugins.


## Usage

```tsx
import AppLoader from '@akashaproject/ui-plugin-loader';
import sdk from '@akashaproject/sdk';

const appLoader = new AppLoader(options, sdk);
appLoader.start();

```

### Options:
  - `title` - the title of this world instance
  - `layout` - the layout app to use
  - `homepageApp` - the app that is loaded on the homepage
  - `defaultApps` - `string[]` or `{ name: string, version: string }[]`
  - `defaultWidgets` - `string[]` or `{ name: string, version: string }[]`
  - `logLevel` - one of `fatal, error, warn, info, debug, trace,`

## Development
 TODO:

## `License`

MIT © [AKASHA Foundation](https://akasha.org/)
