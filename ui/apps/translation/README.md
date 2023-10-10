# Translation App

> The Translation app serves the initialized i18n internationalization lib to be used project-wide. Primary purpose is to be a single source for the translation configs, and allows for defining custom paths from which the translations can be fetched,

## Usage
Exposes the i18n object via ```props.plugins['@akashaorg/app-translation']?.translation.i18n``` passed to all apps. Each app and widget that makes use of it must define its ```i18nNamespace``` array of namespaces for each namespace it uses, in the single-spa ```register``` method, in order for translations to work.

More about [i18next](https://www.i18next.com/).

