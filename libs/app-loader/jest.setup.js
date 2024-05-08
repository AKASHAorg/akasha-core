const { noop, of } = require('rxjs');

global.fetch = jest.fn(() => Promise.resolve({ json: () => '' }));
global.System = {
  import: jest.fn(() =>
    Promise.resolve({
      register: jest.fn(),
      getPlugin: jest.fn(),
    }),
  ),
};

/**
 * sdk mock for App-loader.
 * Include only methods needed for the app-loader tests
 *
 * using .doMock() here instead of .mock() to fix error about referencing out-of-scope variables.
 */
jest.doMock('@akashaorg/awf-sdk', () => () => ({
  api: {
    icRegistry: {
      getLatestReleaseInfo: jest.fn(relInfos =>
        of({
          data: {
            getLatestRelease: relInfos.map(info => ({ name: info.name, version: '1.0.0' })),
          },
        }),
      ),
    },
  },
  services: {
    appSettings: {
      getAll: () =>
        of({
          data: [
            {
              name: '@akashaorg/user-installed-test-app',
              version: '1.0.0',
            },
            {
              name: '@akashaorg/user-installed-test-widget',
              version: '1.0.0',
            },
          ],
        }),
    },
    log: {
      create: () => ({
        info: console.info,
        error: console.error,
        warn: console.warn,
        debug: console.debug,
        setLevel: noop,
      }),
    },
  },
}));
