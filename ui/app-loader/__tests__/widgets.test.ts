// import { EventTypes, LogLevels } from '@akashaproject/ui-awf-typings/lib/app-loader';
// import pino from 'pino';
// import { BehaviorSubject } from 'rxjs';
// import Widgets from '../src/widgets';

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
//   modalSlotId: 'modal-slot',
//   rootWidgetSlotId: 'root-widget-slot',
//   widgetSlotId: 'widget-slot-id',
//   loadingFn: () =>
//     Promise.resolve({
//       bootstrap: layoutBootstrapFn,
//       mount: layoutMountFn,
//       unmount: layoutUmmountFn,
//     }),
// };

// const apps = new Widgets({
//   layoutConfig: layout,
//   uiEvents: new BehaviorSubject({ event: EventTypes.Instantiated }),
//   worldConfig: {
//     title: 'test-title',
//     logLevel: LogLevels.DEBUG,
//     layout: 'test',
//     homepageApp: 'test-app',
//     defaultApps: [],
//     defaultWidgets: [],
//   },
//   sdk: {},
//   logger: pino(),
// });

// describe('Apps loader', () => {
//   it('should install widget', () => {
//     apps.install();
//   });
//   it('should uninstall widget', () => { });
// });
