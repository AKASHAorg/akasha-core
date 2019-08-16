export default [
  {
    moduleName: 'module',
    services: [
      ['service', 'settingsValue'],
      ['service1', JSON.stringify({ example: 1, other: 2 })],
      ['service2', '22'],
    ],
  },
];
