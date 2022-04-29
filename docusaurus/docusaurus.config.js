/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable tsdoc/syntax */
const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */

const config = {
  title: 'AKASHA docs',
  tagline: 'Build your own application with AKASHA',
  url: 'https://akasha-docs.pages.dev',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  baseUrl: '/',
  organizationName: 'AKASHAorg', // Usually your GitHub org/user name.
  projectName: 'akasha-docs', // Usually your repo name.
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        blog: false,
        // docs: {
        //   sidebarPath: require.resolve('./sidebars.js'),
        //   // Please change this to your repo.
        //   editUrl: 'https://github.com/AKASHAorg/akasha-docs',
        // },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],
  plugins: [
    [
      'docusaurus-plugin-typedoc',
      {
        id: 'akasha-sdk-main',
        entryPoints: ['../sdk'],
        entryPointStrategy: 'packages',
        tsconfig: '../sdk/tsconfig.json',
        readme: 'none',
        out: './sdk',
        watch: process.env.TYPEDOC_WATCH,
        frontmatter: {
          pagination_prev: null,
          pagination_next: null,
        },
      },
    ],
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: true,
      },
      navbar: {
        title: 'AKASHA Docs',
        // logo: {
        // alt: 'My Site Logo',
        // src: 'img/logo.svg',
        // },
        items: [
          {
            type: 'doc',
            docId: 'sdk/index',
            position: 'left',
            label: 'Docs',
          },
          {
            href: 'https://github.com/AKASHAorg/akasha-docs',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              // {
              //   label: 'Introduction',
              //   to: '/docs/introduction',
              // },
              // {
              //   label: 'Quick start',
              //   to: '/docs/dev-quickstart',
              // },
              // {
              //   label: 'Integrations',
              //   to: '/docs/integrations',
              // },
              {
                label: 'SDK',
                to: '/docs/sdk',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Discord',
                href: '#discord',
              },
              {
                label: 'Twitter',
                href: '#',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Tutorials',
                to: '/blog',
              },
              {
                label: 'Docs GitHub',
                href: 'https://github.com/AKASHAorg/akasha-docs',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} AKASHA Foundation.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
