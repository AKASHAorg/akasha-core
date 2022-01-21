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

## Execution flow
App-loader begins to execute when the `.start()` method is called.
The following steps are a high level view of the execution flow after the start() method is called:
- 
- 

### Options:
  - `title` - the title of this world instance
  - `layout` - the layout app to use
  - `homepageApp` - the app that is loaded on the homepage
  - `defaultApps` - `string[]` or `{ name: string, version: string }[]`
  - `defaultWidgets` - `string[]` or `{ name: string, version: string }[]`
  - `logLevel` - one of `fatal, error, warn, info, debug, trace,`

## Development
 - clone the repository
 - execute `npm run pack:app-loader` from the root of the repository to build the package

## `License`

MIT © [AKASHA Foundation](https://akasha.org/)
