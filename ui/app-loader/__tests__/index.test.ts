// import Loader from '../src';

// const rootNodeId = 'root-node';
// const mockPlugin = {
//   activeWhen: {
//     path: '/',
//   },
//   i18nConfig: {
//     // namespaces that this plugin requires.
//     // The ns is loaded automatically, you need to specify it only if changed
//     // Example: i have changed the name of this plugin and the created ns was the old plugin name,
//     // In this case I will preserve the old ns instead loading a possibly undefined ns.
//     loadNS: ['common'],
//     // translation namespace. defaults to plugin.name
//     // ns: 'ui-plugin-events',
//     // i18next.use(arr[0]).use(arr[1]).use(arr[n])
//     use: [],
//   },
//   loadingFn: (): any => jest.fn(() => Promise.resolve()),
//   name: 'ui-plugin-mock',
//   services: [],
//   title: 'AKASHA Mock Plugin',
// };

// const layoutHtmlContent = () => {
//   const node = document.createElement('div');
//   node.innerText = 'Layout content';
//   return node;
// };

// const layoutBootstrapFn = jest.fn(() => Promise.resolve());
// const layoutMountFn = jest.fn(() => Promise.resolve(layoutHtmlContent()));
// const layoutUmmountFn = jest.fn(() => Promise.resolve());

// const layout = {
//   name: 'ui-widget-layout-mock',
//   title: 'Layout Widget Mock',
//   pluginSlotId: 'plugin-slot',
//   topbarSlotId: 'topbar-slot',
//   sidebarSlotId: 'sidebar-slot',
//   loadingFn: () =>
//     Promise.resolve({
//       bootstrap: layoutBootstrapFn,
//       mount: layoutMountFn,
//       unmount: layoutUmmountFn,
//     }),
// };

// let loader: Loader;

// describe('App Loader', () => {
//   if (!document.getElementById(rootNodeId)) {
//     const rootNode = document.createElement('div');
//     rootNode.id = rootNodeId;
//     document.body.appendChild(rootNode);
//   }

//   loader = new Loader(
//     {
//       rootNodeId,
//       layout,
//       rootLoadedApp: mockPlugin,
//     },
//     {},
//   );
//   // console.log(loader, '<<<< loader');

//   it('must correctly instantiate', () => {
//     expect(loader).toBeDefined();
//     expect(loader.config).toHaveProperty('rootNodeId', rootNodeId);
//     expect(loader.config).toHaveProperty('rootLoadedApp', mockPlugin);
//     expect(loader.config).toHaveProperty('layout', layout);
//   });
//   it('must render the layout widget first', () => {
//     expect(layoutBootstrapFn).toBeCalledTimes(1);
//     expect(layoutMountFn).toBeCalledTimes(1);
//     expect(layoutUmmountFn).toBeCalledTimes(0);
//     console.log(document.body.innerHTML, '<<< body');
//   });
//   it('must register a root widget', async () => {
//     const sidebarMockWidget = {
//       app: {
//         activeWhen: {
//           path: '/',
//         },
//         loadingFn: (): any => jest.fn(() => Promise.resolve()),
//         name: 'ui-widget-sidebar',
//         services: [],
//         title: 'AKASHA Sidebar widget',
//       },
//     };
//     await loader.registerWidget(sidebarMockWidget);
//     expect(loader.widgets.root).toHaveLength(1);
//     expect(loader.widgets.root[0]).toEqual(sidebarMockWidget);
//   });
//   it('must register a plugin', async () => {
//     const profileMockPlugin = {
//       app: {
//         activeWhen: {
//           path: '/',
//         },
//         loadingFn: (): any => jest.fn(() => Promise.resolve()),
//         name: 'ui-plugin-profile',
//         services: [],
//         title: 'AKASHA Profile plugin',
//       },
//     };
//     await loader.registerPlugin(profileMockPlugin);
//     expect(loader.plugins).toHaveLength(1);
//     expect(loader.plugins[0]).toEqual(profileMockPlugin);
//   });
//   it('must load the script files for each installed apps', async () => {
//     const info = await loader.getPackageInfo('@akashaproject/ui-plugin-bookmarks');

//     if (!info) return;

//     await loader.createImportMaps([info], 'default-integrations');

//   });
//   it('must store the extension points of each installed apps', () => {

//   });
// });
