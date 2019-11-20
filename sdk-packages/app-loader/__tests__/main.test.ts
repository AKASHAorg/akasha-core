import Loader, { IPluginEntry } from '../src';

const rootNodeId = 'root-node';
beforeAll(() => {
  const mockPlugin: IPluginEntry = {
    app: {
      activeWhen: {
        path: '/',
      },
      i18nConfig: {
        // namespaces that this plugin requires.
        // The ns is loaded automatically, you need to specify it only if changed
        // Example: i have changed the name of this plugin and the created ns was the old plugin name,
        // In this case I will preserve the old ns instead loading a possibly undefined ns.
        loadNS: ['common'],
        // translation namespace. defaults to plugin.name
        // ns: 'ui-plugin-events',
        // i18next.use(arr[0]).use(arr[1]).use(arr[n])
        use: [],
      },
      loadingFn: (): any => jest.fn(() => Promise.resolve()),
      name: 'ui-plugin-events',
      services: [],
      title: 'AKASHA Events',
    },
  };
  const layout = {
    name: 'ui-widget-sidebar-mock',
    title: 'Layout Widget Mock',
    pluginSlotId: 'plugin-slot',
    topbarSlotId: 'topbar-slot',
    sidebarSlotId: 'sidebar-slot',
    loadingFn: () => Promise.resolve(),
  };
  this.loader = new Loader({ rootNodeId, layout }, { plugins: [mockPlugin] });
});

test('Loader instantiates', () => {
  expect(this.loader).toBeInstanceOf(Loader);
});

test(`Loader config's rootNodeId = ${rootNodeId}`, () => {
  expect(this.loader.config.rootNodeId).toEqual(rootNodeId);
});

test('Plugin registers', async () => {
  const registerPluginSpy = jest.spyOn(this.loader, 'registerPlugin');
  const validatePluginSpy = jest.spyOn(this.loader, '_validatePlugin');
  await this.loader.registerPlugin(this.mockPlugin);
  // registerPlugin method gets called
  expect(registerPluginSpy).toBeCalled();
  // _validatePlugin gets called once
  expect(validatePluginSpy).toBeCalledTimes(1);
  // loader.plugins.length = 1
  expect(this.loader.getRegisteredPlugins()).toHaveLength(1);
  // loader.plugin.name === passedPlugin.name
  expect(this.loader.plugins.find(plugin => plugin.name === this.mockPlugin.name)).toEqual(
    this.mockPlugin,
  );
});

test('Loader starts', async () => {
  await this.loader.start();
  // @ts-ignore
  expect(this.loader.getPluginsForLocation(window.location)).toHaveLength(1);
});
