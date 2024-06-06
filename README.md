# AKASHA Core

[![CodeFactor](https://www.codefactor.io/repository/github/akashaorg/akasha-core/badge)](https://www.codefactor.io/repository/github/akashaorg/akasha-core)
[![CircleCI](https://dl.circleci.com/status-badge/img/gh/AKASHAorg/akasha-core/tree/next.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/AKASHAorg/akasha-core/tree/next)
[![All Contributors](https://img.shields.io/badge/all_contributors-6-orange.svg?style=flat-square)](#contributors)


| App                                              | Staging                                                                                                                                                                                          | Production                                                       |
|--------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------|
| [Akasha World](https://beta.akasha.world/) | [https://next.akasha-world-framework.pages.dev/](https://next.akasha-world-framework.pages.dev/)                                                                                                 | [https://akasha.world/](https://beta.akasha.world/) |
| [Storybook](https://storybook-awf.netlify.app/)  | [![Netlify Status](https://api.netlify.com/api/v1/badges/04915c36-eff6-4bbe-945b-e9255cae6fb1/deploy-status)](https://app.netlify.com/sites/storybook-awf/deploys)                               | NA                                                               |




> Monorepo for AKASHA Core

## Table of contents

- [AKASHA Core](#akasha-core)
  - [Table of contents](#table-of-contents)
  - [Background](#background)
  - [Install](#install)
  - [Usage](#usage)
    - [Run](#run)
    - [Explore](#explore)
      - [Extensions](#extensions)
      - [Libs](#libs)
      - [Tests](#tests)
      - [Tools](#tools)
      - [Worlds](#worlds)

  - [Contributors ✨](#contributors-✨)
  - [License](#license)

## Background

AKASHA Core is one of the results of an [initiative](https://ethereum.world/manifesto) to accelerate the adoption of blockchain-based apps and services by transforming how they attract, engage and delight users.

## Install

This project uses [node >= v20](http://nodejs.org) and [yarn >= v4](https://classic.yarnpkg.com).

From the root of this project:

```shell script
$ yarn clean:all
$ yarn build:all
```

## Usage

For a definitive guide on all available scripts, check out [Scripts-Guide](./SCRIPTS-GUIDE.md)
### Run
For development purposes, from the root of this project:
```shell script
$ yarn world:dev
```
To watch for changes in dependent projects
```shell script
$ nx watch --projects=tag:scope:extension --includeDependentProjects -- nx build \\NX_PACKAGE_NAME
```

### Explore

This repository is split into five major parts:

#### Extensions

The [extensions](./extensions/README.md) directory contains the available apps and widgets

#### Libs
The [libs](./libs/README.md) directory contains components and logic reused across multiple apps and widgets

#### Tests
The [tests](./tests/README.md) directory contains integration tests for Akasha World

#### Tools
The [tools](./tools/README.md) directory contains executors (i18n etc) and cloudflare functions

#### Worlds
The [Akasha World](./worlds/akasha.world/README.md) contains examples of applications that showcase the usage of AKASHA Core.

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
