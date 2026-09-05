module.exports = {
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Getting Started',
      items: ['getting-started/index'],
    },
    'kernel-development',
    'porting-guide',
    'api-reference',
    {
      type: 'category',
      label: 'Architecture',
      items: [
        'architecture/scheduler',
        'architecture/memory',
        'architecture/vfs',
        'architecture/signals',
      ],
    },
    'port-catalog',
    'abi-compatibility',
    'build-conventions',
  ],
};
