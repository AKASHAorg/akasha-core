# AKASHA Framework

[![CodeFactor](https://www.codefactor.io/repository/github/akashaorg/akasha-framework/badge)](https://www.codefactor.io/repository/github/akashaorg/akasha-framework)
[![CircleCI](https://circleci.com/gh/AKASHAorg/akasha-framework.svg?style=svg&circle-token=8e833337dd8ddbc8332abfb5961164630a7dbd92)](https://circleci.com/gh/AKASHAorg/akasha-world-framework)
[![All Contributors](https://img.shields.io/badge/all_contributors-6-orange.svg?style=flat-square)](#contributors)


| App                                              | Staging                                                                                                                                                                                          | Production                                                       |
|--------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------|
| [Ethereum World](https://akasha.ethereum.world/) | [https://next.akasha-world-framework.pages.dev/](https://next.akasha-world-framework.pages.dev/)                                                                                                 | [https://akasha.ethereum.world/](https://akasha.ethereum.world/) |
| [Storybook](https://storybook-awf.netlify.app/)  | [![Netlify Status](https://api.netlify.com/api/v1/badges/04915c36-eff6-4bbe-945b-e9255cae6fb1/deploy-status)](https://app.netlify.com/sites/storybook-awf/deploys)                               | NA                                                               |




> Monorepo for AWF

## Table of contents

- [Background](#background)
- [Install](#install)
- [Usage](#usage)
  - [SDK](#sdk)
    - [Package Components](#package-components)
    - [Build](#build-the-sdk-package)
  - [UI](#ui-workspace)
  - [Examples](#playground-test-app)
  - [Server Scripts](#scripts-workspace)
- [Contributors](#contributors-)
- [License](#license)

## Background

AWF is one of the results of [initiative](https://ethereum.world/manifesto) to accelerate the adoption of Ethereum-based apps and services by transforming how they attract, engage and delight users.

## Install

This project uses [node](http://nodejs.org) and [yarn](https://classic.yarnpkg.com).

From the root of this project:

```shell script
$ yarn bootstrap
$ yarn build:all
```


## Usage

For a definitive guide on all available scripts, check out [Scripts-Guide](./SCRIPTS-GUIDE.md)
### Run
For development purposes, from the root of this project:
```shell script
$ yarn start:feed-app
```
To watch for changes in dependent packages
```shell script
$ AWF_PACKAGE=<package-name> yarn pack:watch
```
You can check which packages are available in the workspaces.json file in the root of the project.
#
This repository is split into four [lerna](https://github.com/lerna/lerna) workspaces:

### SDK

#### Build the sdk package

From the root of the project:

```shell script
$ yarn build:sdk
```

This will create under the [akasha](./sdk-packages/akasha/README.md) package repo a folder `dist` that contains the built files.

#### Running Tests

From the root of the project:

```shell script
$ yarn build:test
$ yarn test:<package-group>
```
where `<package-group>` can be one of `apps`, `widgets`, `plugins`, `design-system`, `hooks`

### UI workspace

- [Design system](./ui/design/README.md)
- [React hooks](./ui/hooks/README.md)
- [Plugins](./ui/plugins/README.md)
- [Widgets](./ui/widgets/README.md)
- [Apps](./apps/README.md)

### Playground test-app

This [workspace](./examples) contains examples of applications that showcase the usage of AWF.

### Getting started with local development

Follow the steps described [here](./LOCAL_DEV.md)

## Adding a new package

1. in the root package.json add the package to the workspace package list
2. in the root package.json create scripts to build it ex: ```"pack:ui-design": "nx run @akashaorg/design-system:build"```
3. in the root package.json add it to build process in scripts, for example in the ```pack:ui``` script
4. add it to tsconfig.json
5. add it to workspace.json
6. add it to tsconfig.typedoc.json

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center"><a href="https://github.com/quininez"><img src="https://avatars3.githubusercontent.com/u/13240850?v=4?s=100" width="100px;" alt="Vali Cotea"/><br /><sub><b>Vali Cotea</b></sub></a><br /><a href="https://github.com/AKASHAorg/akasha-framework/commits?author=quininez" title="Code">💻</a> <a href="#maintenance-quininez" title="Maintenance">🚧</a> <a href="https://github.com/AKASHAorg/akasha-framework/commits?author=quininez" title="Documentation">📖</a> <a href="https://github.com/AKASHAorg/akasha-framework/pulls?q=is%3Apr+reviewed-by%3Aquininez" title="Reviewed Pull Requests">👀</a> <a href="#example-quininez" title="Examples">💡</a></td>
      <td align="center"><a href="https://github.com/SeverS"><img src="https://avatars2.githubusercontent.com/u/5903809?v=4?s=100" width="100px;" alt="Sever Abibula"/><br /><sub><b>Sever Abibula</b></sub></a><br /><a href="https://github.com/AKASHAorg/akasha-framework/commits?author=SeverS" title="Code">💻</a> <a href="#maintenance-SeverS" title="Maintenance">🚧</a> <a href="https://github.com/AKASHAorg/akasha-framework/commits?author=SeverS" title="Documentation">📖</a> <a href="https://github.com/AKASHAorg/akasha-framework/pulls?q=is%3Apr+reviewed-by%3ASeverS" title="Reviewed Pull Requests">👀</a> <a href="#example-SeverS" title="Examples">💡</a></td>
      <td align="center"><a href="https://github.com/kenshyx"><img src="https://avatars3.githubusercontent.com/u/3396463?v=4?s=100" width="100px;" alt="Marius Darila"/><br /><sub><b>Marius Darila</b></sub></a><br /><a href="https://github.com/AKASHAorg/akasha-framework/commits?author=kenshyx" title="Code">💻</a> <a href="#maintenance-kenshyx" title="Maintenance">🚧</a> <a href="https://github.com/AKASHAorg/akasha-framework/commits?author=kenshyx" title="Documentation">📖</a> <a href="https://github.com/AKASHAorg/akasha-framework/pulls?q=is%3Apr+reviewed-by%3Akenshyx" title="Reviewed Pull Requests">👀</a> <a href="#example-kenshyx" title="Examples">💡</a> <a href="#infra-kenshyx" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
      <td align="center"><a href="https://akasha.world"><img src="https://avatars3.githubusercontent.com/u/6831213?v=4?s=100" width="100px;" alt="Mihai Alisie"/><br /><sub><b>Mihai Alisie</b></sub></a><br /><a href="#ideas-MihaiAlisie" title="Ideas, Planning, & Feedback">🤔</a> <a href="#financial-MihaiAlisie" title="Financial">💵</a> <a href="#blog-MihaiAlisie" title="Blogposts">📝</a> <a href="#talk-MihaiAlisie" title="Talks">📢</a></td>
      <td align="center"><a href="https://github.com/etzm"><img src="https://avatars1.githubusercontent.com/u/31589705?v=4?s=100" width="100px;" alt="Martin Etzrodt"/><br /><sub><b>Martin Etzrodt</b></sub></a><br /><a href="#userTesting-etzm" title="User Testing">📓</a> <a href="#talk-etzm" title="Talks">📢</a> <a href="#fundingFinding-etzm" title="Funding Finding">🔍</a></td>
      <td align="center"><a href="https://github.com/marianagomes"><img src="https://avatars2.githubusercontent.com/u/22957731?v=4?s=100" width="100px;" alt="Mariana Gomes"/><br /><sub><b>Mariana Gomes</b></sub></a><br /><a href="#design-marianagomes" title="Design">🎨</a> <a href="#video-marianagomes" title="Videos">📹</a></td>
      <td align="center"><a href="http://about.me/josenriagu"><img src="https://avatars.githubusercontent.com/u/49484425?v=4?s=100" width="100px;" alt="Josemaria Nriagu"/><br /><sub><b>Josemaria Nriagu</b></sub></a><br /><a href="https://github.com/AKASHAorg/akasha-framework/commits?author=josenriagu" title="Code">💻</a> <a href="#maintenance-josenriagu" title="Maintenance">🚧</a> <a href="https://github.com/AKASHAorg/akasha-framework/commits?author=josenriagu" title="Documentation">📖</a> <a href="https://github.com/AKASHAorg/akasha-framework/pulls?q=is%3Apr+reviewed-by%3Ajosenriagu" title="Reviewed Pull Requests">👀</a></td>
    </tr>
    <tr>
      <td align="center"><a href="https://deiu.me"><img src="https://avatars.githubusercontent.com/u/346820?v=4?s=100" width="100px;" alt="Andrei"/><br /><sub><b>Andrei</b></sub></a><br /><a href="https://github.com/AKASHAorg/akasha-framework/commits?author=deiu" title="Code">💻</a> <a href="https://github.com/AKASHAorg/akasha-framework/commits?author=deiu" title="Documentation">📖</a></td>
      <td align="center"><a href="https://github.com/PrimarchAlpharius"><img src="https://avatars.githubusercontent.com/u/28538151?v=4?s=100" width="100px;" alt="Damir Sabolic"/><br /><sub><b>Damir Sabolic</b></sub></a><br /><a href="https://github.com/AKASHAorg/akasha-framework/commits?author=PrimarchAlpharius" title="Code">💻</a> <a href="https://github.com/AKASHAorg/akasha-framework/commits?author=PrimarchAlpharius" title="Documentation">📖</a> <a href="https://github.com/AKASHAorg/akasha-framework/commits?author=PrimarchAlpharius" title="Tests">⚠️</a></td>
      <td align="center"><a href="https://github.com/didd"><img src="https://avatars.githubusercontent.com/u/35398733?v=4?s=100" width="100px;" alt="didd"/><br /><sub><b>didd</b></sub></a><br /><a href="https://github.com/AKASHAorg/akasha-framework/commits?author=didd" title="Code">💻</a> <a href="https://github.com/AKASHAorg/akasha-framework/commits?author=didd" title="Tests">⚠️</a></td>
      <td align="center"><a href="https://github.com/Basmatiii"><img src="https://avatars.githubusercontent.com/u/91470583?v=4?s=100" width="100px;" alt="Basma"/><br /><sub><b>Basma</b></sub></a><br /><a href="#a11y-basmatiii" title="Accessibility">️️️️♿️</a> <a href="#design-basmatiii" title="Design">🎨</a> <a href="#userTesting-basmatiii" title="User Testing">📓</a></td>
      <td align="center"><a href="https://github.com/themonster2015"><img src="https://avatars.githubusercontent.com/u/10905837?v=4?s=100" width="100px;" alt="Quynh Yen Vo T."/><br /><sub><b>Quynh Yen Vo T.</b></sub></a><br /><a href="https://github.com/AKASHAorg/akasha-framework/commits?author=themonster2015" title="Code">💻</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

## License

[AGPL-3.0](LICENSE) © AKASHA Foundation
