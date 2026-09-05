// @ts-check
const {themes} = require('prism-react-renderer');

module.exports = {
  title: 'NeoOS',
  tagline: 'A 64-bit x86_64 OS built from scratch, one milestone at a time',
  url: 'https://neoos.github.io',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',

  organizationName: 'NeoOSOrganization',
  projectName: 'neoos-docs',

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/NeoOSOrganization/neoos-docs/tree/main/',
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'NeoOS',
      logo: {
        alt: 'NeoOS Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'doc',
          docId: 'intro',
          position: 'left',
          label: 'Docs',
        },
        {
          href: 'https://github.com/NeoOSOrganization',
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
            { label: 'Getting Started', to: '/docs/getting-started' },
            { label: 'Architecture', to: '/docs/architecture' },
            { label: 'Porting Guide', to: '/docs/porting' },
          ],
        },
        {
          title: 'Community',
          items: [
            { label: 'GitHub', href: 'https://github.com/NeoOSOrganization' },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} NeoOS. MIT License.`,
    },
    prism: {
      theme: themes.github,
      darkTheme: themes.dracula,
      additionalLanguages: ['bash', 'c', 'makefile', 'yaml'],
    },
  },
};