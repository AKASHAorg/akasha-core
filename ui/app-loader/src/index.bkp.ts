// //@ts-nocheck
// import {
//   EventTypes,
//   IAppEntry,
//   ILoaderConfig,
//   IMenuItem,
//   IMenuList,
//   IPlugin,
//   IPluginConfig,
//   IPluginEntry,
//   IWidget,
//   IWidgetConfig,
//   IWidgetEntry,
//   MenuItemAreaType,
//   MenuItemType,
// } from '@akashaproject/ui-awf-typings/lib/app-loader';

// import pino from 'pino';
// import { BehaviorSubject } from 'rxjs';
// import * as rxjsOperators from 'rxjs/operators';
// import * as singleSpa from 'single-spa';
// import fourOhFour from './404';
// import detectMobile from 'ismobilejs';

// import createTemplateElement from './create-template-element';

// import { setPageTitle } from './setPageMetadata';
// import { Application } from '@akashaproject/ui-awf-typings';

// import { pathToRegexp } from 'path-to-regexp';

// export interface IAppLoader {
//   registerApp(plugin: IPluginEntry): void;

//   registerWidget(widget: IWidgetEntry, widgetType: 'root' | 'integration'): void;

//   // getPluginsForLocation(location: Location): string[];
// }

// interface SingleSpaEventDetail {
//   originalEvent: any;
//   newAppStatuses: {
//     [key: string]: string;
//   };
//   appsByNewStatus: {
//     MOUNTED: string[];
//     NOT_MOUNTED: string[];
//   };
//   totalAppChanges: number;
// }
// /* tslint:disable */
// /* eslint-disable */
// export default class AppLoader implements IAppLoader {
//   public readonly registeredWidgets: Map<string, IWidgetConfig>;
//   public readonly registeredIntegrations: Map<string, IPluginConfig>;
//   public readonly events: BehaviorSubject<EventTypes>;
//   private readonly config: ILoaderConfig;
//   private readonly appLogger;
//   private readonly channels;
//   private readonly globalChannel;
//   private readonly menuItems: IMenuList;
//   private readonly isMobile: boolean;
//   private readonly deferredIntegrations: {
//     integration: IPluginEntry;
//     integrationId: string;
//     menuItemType?: MenuItemType;
//   }[];
//   private fourOhFourTimeout: NodeJS.Timeout | null;
//   private isRegisteringLayout: boolean;
//   private apps: IAppEntry[];
//   private widgets: {
//     root: IWidgetEntry[];
//     app: {
//       /**
//        * key: appId
//        */
//       [key: string]: {
//         /**
//          * key: route
//          */
//         [key: string]: IWidgetEntry[];
//       };
//     };
//   };
//   private plugins: IPluginEntry[];
//   private currentlyMountedWidgets: {
//     route: string;
//     widgetId: string;
//     widget: singleSpa.Parcel;
//   }[];

//   constructor(
//     config: ILoaderConfig,
//     initialApps: { plugins?: IPluginEntry[]; widgets?: IWidgetEntry[]; apps?: IAppEntry[] },
//     channels?: any,
//     globalChannel?: any,
//   ) {
//     this.config = config;
//     this.appLogger = pino({ browser: { asObject: true } });
//     this.globalChannel = globalChannel;
//     this.channels = channels;
//     this.isMobile = detectMobile().phone || detectMobile().tablet;

//     this.fourOhFourTimeout = null;

//     this.events = new BehaviorSubject(EventTypes.Instantiated);
//     this.menuItems = { nextIndex: 1, items: [] };

//     // store the configs of apps and widgets
//     this.apps = initialApps.apps || [];
//     this.widgets = {
//       root: initialApps.widgets,
//       app: {},
//     };
//     this.plugins = initialApps.plugins || [];

//     this.isRegisteringLayout = true;

//     this.registeredIntegrations = new Map();
//     this.registeredWidgets = new Map();

//     this.currentlyMountedWidgets = [];

//     this.deferredIntegrations = [];

//     // register event listeners
//     this.addSingleSpaEventListeners();
//     // call as fast as possible
//     // https://github.com/single-spa/single-spa/issues/484
//     singleSpa.start({
//       urlRerouteOnly: true,
//     });
//     if (this.globalChannel) {
//       const loginEvent = this.globalChannel.pipe(
//         rxjsOperators.filter(
//           (ev: { channelInfo: any; data: any }) => ev?.channelInfo?.method === 'signIn',
//         ),
//       );
//       loginEvent.subscribe(e => {
//         const doc = this.channels.db.apps.getInstalled({});
//         this.appLogger.info('registering apps installed by user');
//         doc.subscribe(record => {
//           this.appLogger.info('currently installed apps', record.apps);
//           if (record?.apps?.length) {
//             record.apps.forEach(this.registerApp);
//           }
//         });
//       });
//     }

//     this.loadLayout();
//   }

//   public async installApp(appEntry: IAppEntry) {
//     this.registerApp(appEntry);
//     const doc = this.channels.db.apps.install(appEntry);
//     return await doc.toPromise();
//   }
//   public static createTemplateElement = createTemplateElement;
//   public async uninstallApp(appName: string, packageLoader: any, packageId: string) {
//     if (this.registeredIntegrations.has(appName)) {
//       await singleSpa.unloadApplication(appName, { waitForUnmount: true });
//       this.registeredIntegrations.delete(appName);
//       this.appLogger.info(`removed ${appName} from registeredPlugins`);
//     }
//     if (this.registeredWidgets.has(appName)) {
//       this.appLogger.warn(`trying to unmount root widget ${appName}, which is not supported`);
//     }
//     const removedPackage = packageLoader.delete(packageId);
//     this.events.next(EventTypes.AppOrPluginUninstall);
//     this.appLogger.info(`package ${packageId} removed ${removedPackage}`);
//     const doc = this.channels.db.apps.remove({ name: appName });
//     return await doc.toPromise();
//   }

//   private addSingleSpaEventListeners() {
//     window.addEventListener('single-spa:first-mount', this.onFirstMount.bind(this));
//     window.addEventListener('single-spa:before-routing-event', this.beforeRouting.bind(this));
//     window.addEventListener('single-spa:app-change', this.onAppChange.bind(this));
//     window.addEventListener('single-spa:routing-event', this.onRouting.bind(this));
//   }
//   /**
//    * register an app
//    * using this method we define the default
//    * (uninstallable) plugins and apps
//    */
//   public registerApp(appEntry: IAppEntry) {
//     const { app } = appEntry;
//     this.appLogger.info(`[@akashaproject/sdk-ui-plugin-loader] registering app ${app.name}`);
//     const appId = this.getIdFromName(app.name);
//     if (this.registeredIntegrations.has(appId)) {
//       this.appLogger.info(`App ${appId} already registered... skipping...`);
//       return;
//     }
//     if (!this.apps.find(a => a.app.name === appEntry.app.name)) {
//       this.apps.push(appEntry);
//     }

//     this.registerIntegration(appEntry, appId, MenuItemType.App);
//     this.events.next(EventTypes.AppInstall);
//     this.appLogger.info(`[@akashaproject/sdk-ui-plugin-loader]: *app* ${app.name} registered!`);
//   }
//   /**
//    * register a plugin
//    * using this method we define the default
//    * (uninstallable) plugins
//    */
//   public registerPlugin(pluginEntry: IPluginEntry) {
//     const { app } = pluginEntry;
//     this.appLogger.info(`[@akashaproject/sdk-ui-plugin-loader] registering app ${app.name}`);
//     const appId = this.getIdFromName(app.name);
//     if (this.registeredIntegrations.has(appId)) {
//       this.appLogger.info(`App ${appId} already registered... skipping...`);
//       return;
//     }
//     if (!this.plugins.find(p => p.app.name === pluginEntry.app.name)) {
//       this.plugins.push(pluginEntry);
//     }

//     this.registerIntegration(pluginEntry, appId, MenuItemType.Plugin);
//     this.events.next(EventTypes.PluginInstall);
//     this.appLogger.info(`[@akashaproject/sdk-ui-plugin-loader]: *plugin* ${app.name} registered!`);
//   }
//   /**
//    * Mounts a widget. Root widgets are mounted automatically.
//    * Integration widgets are mounted if the configured route
//    * matches exactly the current path.
//    * root widgets are uninstallable and
//    * they are loaded above other widgets.
//    *
//    * When we mount the integration widget, we must store the parcel in memory
//    * to be unmounted if the path changes.
//    */
//   public async registerWidget(widget: IWidgetEntry, widgetType: 'root' | 'integration') {
//     if (this.isMobile && widget.config.notOnMobile) {
//       this.appLogger.info(`will not display widget ** ${widget.app.name} ** on mobile`);
//       return;
//     }
//     this.appLogger.info(
//       `[@akashaproject/sdk-ui-plugin-loader] registering widget ${widget.app.name}`,
//     );
//     const widgetId = this.getIdFromName(widget.app.name);
//     widget.app.name = widgetId;
//     if (this.isRegisteringLayout) {
//       this.widgets.root.push(widget);
//       return;
//     }
//     if (this.registeredWidgets.has(widgetId)) {
//       this.appLogger.info(`Widget ${widgetId} already registered... skipping...`);
//       return;
//     }

//     const dependencies = this.getDependencies(widget.app, widgetId);

//     this.registeredWidgets.set(widgetId, { slot: widget.config.slot });
//     const domEl = document.getElementById(widget.config.slot);

//     const pProps = {
//       ...this.config,
//       ...widget.app,
//       domElement: domEl,
//       sdkModules: dependencies,
//       rxjsOperators: rxjsOperators,
//       globalChannel: this.globalChannel,
//       getMenuItems: () => this.getMenuItems(),
//       events: this.events,
//       isMobile: this.isMobile,
//       logger: this.appLogger.child({ widget: widgetId }),
//       basePath: widget.app.basePath,
//     };
//     const widgetS = singleSpa.mountRootParcel(this.createSingleSpaApp(widget.app), pProps);
//     await widgetS.mountPromise;
//     this.events.next(EventTypes.WidgetInstall);
//     this.appLogger.info(`[@akashaproject/sdk-ui-plugin-loader]: ${widget.app.name} registered!`);
//     if (widgetType === 'integration') {
//       return widgetS;
//     }
//   }
//   /**
//    * call to register singleSpa app
//    */
//   private registerIntegration(
//     integration: IPluginEntry,
//     integrationId: string,
//     menuItemType?: MenuItemType,
//   ) {
//     if (this.isRegisteringLayout) {
//       this.deferredIntegrations.push({ integration, integrationId, menuItemType });
//       return;
//     }

//     const dependencies = this.getDependencies(integration.app, integrationId);

//     singleSpa.registerApplication(
//       integrationId,
//       this.createSingleSpaApp(integration.app),
//       (location: Location): boolean => {
//         return this.pathPrefix(location, integration.app.activeWhen);
//       },
//       // custom props passed to the integration
//       {
//         ...this.config,
//         ...integration.config,
//         activeWhen: integration.app.activeWhen,
//         domElementGetter: () => document.getElementById(this.config.layout.pluginSlotId),
//         logger: this.appLogger.child({ plugin: integrationId }),
//         sdkModules: dependencies,
//         rxjsOperators: rxjsOperators,
//         globalChannel: this.globalChannel,
//         events: this.events,
//         isMobile: this.isMobile,
//       },
//     );
//     this.menuItems.items.push({
//       label: integration.app.title,
//       name: integrationId,
//       area: integration?.config?.area || MenuItemAreaType.OtherArea,
//       index: this.menuItems.nextIndex,
//       route: integration.app.activeWhen.path,
//       type: menuItemType,
//       logo: integration.app.logo,
//       subRoutes: this.createSubroutes(integration.app.menuItems),
//     });
//     this.menuItems.nextIndex += 1;
//     if (menuItemType === MenuItemType.Plugin) {
//       this.events.next(EventTypes.PluginInstall);
//     } else if (menuItemType === MenuItemType.App) {
//       this.events.next(EventTypes.AppInstall);
//     }

//     this.registerIntegrationWidgets(integration, integrationId);

//     this.registeredIntegrations.set(integrationId, {
//       title: integration.app.title || integrationId,
//     });
//   }
//   /* eslint-enable complexity */
//   private getDependencies(app: Application | IWidget, id: string) {
//     const dependencies = {};
//     if (app.sdkModules && app.sdkModules.length) {
//       for (const dep of app.sdkModules) {
//         if (this.channels.hasOwnProperty(dep.module)) {
//           Object.assign(dependencies, { [dep.module]: this.channels[dep.module] });
//           this.appLogger.info(`${id} has access to ${dep.module} -> channel`);
//         }
//       }
//     }
//     return dependencies;
//   }
//   private onFirstMount() {
//     // tslint:disable-next-line:no-console
//     console.timeEnd('AppLoader:firstMount');
//     const matchedPlugins = this.getPluginsForLocation(window.location);
//     if (window.location.pathname === '/' && matchedPlugins.length === 0) {
//       if (this.config.rootLoadedApp) {
//         singleSpa.navigateToUrl(this.config.rootLoadedApp.activeWhen.path);
//       } else {
//         this.appLogger.error('There is no rootLoadedApp set. Nothing to render!');
//       }
//     }
//   }
//   /**
//    * Handle widget loading when routing inside an app (subroutes).
//    * We need to re-iterate over the currently loaded widgets
//    * and see if there are any that does not match the route anymore
//    * otherwise the router will not work reliably.
//    */
//   private onRouting(_ev: CustomEvent<SingleSpaEventDetail>) {
//     const { pathname } = window.location;
//     const mountedApps = this.getPluginsForLocation(window.location);
//     let matchedApps = [];
//     if (mountedApps.length === 0 && window.location.pathname === '/') {
//       console.log(this.config, '<<< config');
//       if (this.config.rootLoadedApp) {
//         singleSpa.navigateToUrl(this.config.rootLoadedApp.activeWhen.path);
//       } else {
//         this.appLogger.error('There is no rootLoadedApp set. Nothing to render!');
//       }
//       return;
//     } else if (mountedApps.length) {
//       matchedApps = mountedApps.map(appName => {
//         const app = this.apps.find(appEntry => this.getIdFromName(appEntry.app.name) === appName);
//         const plugin = this.plugins.find(
//           plugEntry => this.getIdFromName(plugEntry.app.name) === appName,
//         );
//         if (app) return app;
//         return plugin;
//       });
//     }

//     this.currentlyMountedWidgets.forEach(widget => {
//       const routeRegex = pathToRegexp(widget.route);
//       if (!routeRegex.test(pathname)) {
//         if (widget.widget && widget.widget.getStatus() === 'MOUNTED') {
//           widget.widget.unmount();
//           this.currentlyMountedWidgets = this.currentlyMountedWidgets.filter(
//             w => w.route !== widget.route,
//           );
//           // const widgetNode = document.getElementById(this.getIdFromName(widget.widgetId));
//           // if (widgetNode) {
//           //   widgetNode.parentNode.removeChild(widgetNode);
//           // }
//           this.registeredWidgets.delete(widget.widgetId);
//         }
//       }
//     });

//     this.mountWidgetsOfApps(matchedApps);
//   }
//   private beforeRouting(_ev: CustomEvent<SingleSpaEventDetail>) {
//     /**
//      * we need to check if there are any integrations that WILL be loaded
//      * at the given location.
//      * Note that the integration may not be loaded/mounted yet so we cannot relay on
//      * ev.detail.appsByNewStatus param.
//      */
//     const currentPlugins = this.getPluginsForLocation(window.location);
//     const fourOhFourElem = document.getElementById('four-oh-four');
//     // cleanup 404 element if exist (recovering from a 404 page)
//     if (fourOhFourElem) {
//       fourOhFourElem.parentElement.removeChild(fourOhFourElem);
//     }
//     if (this.fourOhFourTimeout) {
//       clearTimeout(this.fourOhFourTimeout);
//       this.fourOhFourTimeout = null;
//     }
//     this.fourOhFourTimeout = setTimeout(() => {
//       if (!currentPlugins.length) {
//         const pluginsNode = document.getElementById(this.config.layout.pluginSlotId);
//         // create a 404 page and return it instead of a plugin
//         const FourOhFourNode: ChildNode = fourOhFour;
//         if (pluginsNode) {
//           pluginsNode.appendChild(FourOhFourNode);
//         }
//       }
//     }, 1500);
//     if (currentPlugins.length) {
//       this.appLogger.info(`active plugin %j`, currentPlugins);
//       const firstPlugin = currentPlugins.find(plugin => this.registeredIntegrations.has(plugin));
//       if (firstPlugin) {
//         setPageTitle(this.registeredIntegrations.get(firstPlugin).title);
//       } else {
//         this.appLogger.warn(
//           `could not find a registered active app from active plugins list %j`,
//           currentPlugins,
//         );
//       }
//     }
//   }
//   private getAppEntries(appNames) {
//     return appNames.map(appName => {
//       const app = this.apps.find(
//         application => this.getIdFromName(application.app.name) === appName,
//       );
//       const plugin = this.plugins.find(plug => this.getIdFromName(plug.app.name) === appName);
//       if (app) return app;
//       if (plugin) return plugin;
//     });
//   }

//   /**
//    * InsertPosition
//    *
//    * ```html
//    * <!-- beforebegin -->
//    * <TargetElement>
//    *  <!-- afterbegin -->
//    *    <!-- other child elements -->
//    *  <!-- beforeend -->
//    * </TargetElement>
//    * <!-- afterend -->
//    * ```
//    */

//   private createHtmlElements(
//     order: string[],
//     elementType: string,
//     parentElement: string,
//   ): Promise<void> {
//     const parentNode = document.getElementById(parentElement);
//     const created = [];
//     if (!parentNode) {
//       return this.appLogger.error(`Target element: ${parentElement} not found!`);
//     }

//     return new Promise(resolve => {
//       order.forEach(itemId => {
//         const itemIdx = order.indexOf(itemId);
//         let elem = document.getElementById(itemId);
//         if (!elem) {
//           elem = document.createElement(elementType);
//           elem.id = itemId;
//         }
//         if (itemIdx > 0) {
//           const prevElem = document.getElementById(order[itemIdx - 1]);
//           if (prevElem) {
//             prevElem.after(elem);
//           }
//         } else {
//           parentNode.insertAdjacentElement('afterbegin', elem);
//         }
//         created.push(itemId);
//       });
//       if (created.length === order.length) {
//         resolve();
//       }
//     });
//   }
//   private mountWidgetsOfApps(apps) {
//     apps.forEach(integration => {
//       const widgets = integration.app.widgets;
//       if (!widgets) return;
//       const widgetRoutes = Object.keys(widgets);
//       const path = window.location.pathname;
//       if (widgetRoutes.length) {
//         widgetRoutes
//           .filter(route => pathToRegexp(route).test(path))
//           .forEach(route => {
//             const widgetListForPath = widgets[route];
//             this.createHtmlElements(
//               widgetListForPath.map((w: IWidget) => this.getIdFromName(w.name)),
//               'div',
//               this.config.layout.widgetSlotId,
//             ).then(() => {
//               widgetListForPath.forEach(async (widget: IWidget, index: number) => {
//                 this.currentlyMountedWidgets.push({
//                   route: route,
//                   widgetId: this.getIdFromName(widget.name),
//                   widget: await this.registerWidget(
//                     {
//                       app: {
//                         ...widget,
//                         basePath: route,
//                       },
//                       config: {
//                         slot: this.getIdFromName(widget.name),
//                       },
//                     },
//                     'integration',
//                   ),
//                 });
//               });
//             });
//           });
//       }
//     });
//   }

//   private unmountWidgetsOfApps(apps: IPluginEntry[] | IAppEntry[]) {
//     const appsWidgetRoutes = apps
//       .map(app => {
//         if (app.app.widgets) {
//           return Object.keys(app.app.widgets);
//         }
//       })
//       .flat()
//       .filter(x => !!x);

//     appsWidgetRoutes.forEach(route => {
//       const cmw = this.currentlyMountedWidgets.find(w => w.route === route);
//       if (cmw && cmw.widget && cmw.widget.getStatus() === 'MOUNTED') {
//         cmw.widget.unmount();
//         this.currentlyMountedWidgets = this.currentlyMountedWidgets.filter(
//           w => w.route !== cmw.route,
//         );
//         this.registeredWidgets.delete(cmw.widgetId);
//         // const htmlElem: HTMLElement | null = document.getElementById(cmw.widgetId);
//         // if (htmlElem) {
//         //   htmlElem.parentNode.removeChild(htmlElem);
//         // }
//       }
//     });
//   }

//   private onAppChange(ev: CustomEvent<SingleSpaEventDetail>) {
//     this.appLogger.info(`single-spa:app-change %j`, ev.detail);
//     const appNamesToMount = ev.detail.appsByNewStatus.MOUNTED;
//     const appNamesToUnmount = ev.detail.appsByNewStatus.NOT_MOUNTED;
//     const appEntriesToMount = this.getAppEntries(appNamesToMount);
//     const appEntriesToUnmount = this.getAppEntries(appNamesToUnmount);
//     this.mountWidgetsOfApps(appEntriesToMount);
//     this.unmountWidgetsOfApps(appEntriesToUnmount);
//   }

//   /**
//    * Handle integration widgets.
//    * store them but don't mount them yet
//    */
//   private registerIntegrationWidgets(integration: IAppEntry | IPluginEntry, integrationId: string) {
//     const { widgets } = integration.app;
//     if (widgets) {
//       Object.keys(widgets).forEach(widgetRoute => {
//         const configuredWidgets = widgets[widgetRoute].map(wd => ({
//           app: wd,
//           config: { slot: this.config.layout.widgetSlotId },
//         }));
//         this.widgets.app[integrationId] = {
//           [widgetRoute]: configuredWidgets,
//         };
//       });
//     }
//   }
//   /**
//    * mount the layout widget
//    */
//   private async mountLayoutWidget() {
//     const domEl = document.getElementById(this.config.rootNodeId);
//     if (!domEl) {
//       this.appLogger.error(
//         '[@akashaproject/sdk-ui-plugin-loader]: dom element was not found, retrying...',
//       );
//       throw new Error('[@akashaproject/sdk-ui-plugin-loader]: root node element not found!');
//     }

//     const { loadingFn, ...otherProps } = this.config.layout;
//     try {
//       await new Promise(async resolve => {
//         const pProps = {
//           domElement: domEl,
//           isMobile: this.isMobile,
//           ...otherProps,
//           themeReadyEvent: () => {
//             resolve(null);
//           },
//         };
//         const layout = singleSpa.mountRootParcel(loadingFn, pProps);
//         await layout.mountPromise;
//       });
//     } catch (err) {
//       throw err;
//     }
//   }

//   private async loadLayout() {
//     try {
//       await this.mountLayoutWidget();
//       // after mounting all the root widgets
//       this.isRegisteringLayout = false;
//       for (const widget of this.widgets.root) {
//         await this.registerWidget(widget, 'root');
//       }
//       if (this.plugins) {
//         this.plugins.forEach(plugin => {
//           const isDeferred =
//             this.deferredIntegrations.findIndex(
//               di => di.integrationId === this.getIdFromName(plugin.app.name),
//             ) > -1;

//           if (!isDeferred) {
//             this.registerPlugin(plugin);
//           }
//         });
//       }

//       if (this.apps) {
//         this.apps.forEach(app => {
//           const isDeferred =
//             this.deferredIntegrations.findIndex(
//               di => di.integrationId === this.getIdFromName(app.app.name),
//             ) > -1;
//           if (!isDeferred) {
//             this.registerApp(app);
//           }
//         });
//       }
//       if (this.deferredIntegrations.length) {
//         this.deferredIntegrations.forEach(entry =>
//           this.registerIntegration(entry.integration, entry.integrationId, entry?.menuItemType),
//         );
//         // clear it
//         this.deferredIntegrations.length = 0;
//       }
//     } catch (err) {
//       this.appLogger.error('Cannot load layout! Err: %j', err);
//     }
//     this.appLogger.info('[@akashaproject/sdk-ui-plugin-loader]: starting single spa');
//   }
//   /**
//    * initialize the translations
//    */
//   private createSingleSpaApp(appOrWidget: IWidget | Application) {
//     return appOrWidget.loadingFn;
//   }
//   // save the list of installed apps to a local database
//   private saveInstalledApp() {
//     // todo
//   }

//   // remove app from installed apps
//   private getInstalledApps() {
//     // todo
//   }

//   private getPluginsForLocation(location: Location) {
//     return singleSpa.checkActivityFunctions(location);
//   }

//   public getMenuItems() {
//     return this.menuItems.items.slice(0);
//   }
//   // used to create menus in secondary sidebar
//   private createSubroutes(subRoutes: IPlugin['menuItems']): IMenuItem[] {
//     const routes = [];
//     let currentIndex = 0;
//     if (!subRoutes) {
//       return routes;
//     }
//     for (const [label, route] of Object.entries(subRoutes)) {
//       routes.push({
//         index: currentIndex,
//         label: label,
//         route: route,
//         type: MenuItemType.Internal,
//       });
//       currentIndex += 1;
//     }
//     return routes;
//   }
//   private getIdFromName(name) {
//     return name.toLowerCase().replace(' ', '-');
//   }
//   // @TODO: add a simple router (pathToRegxp?);
//   private pathPrefix(location: Location, activeWhen: IPluginConfig['activeWhen']) {
//     if (activeWhen && activeWhen.exact) {
//       return location.pathname === activeWhen.path;
//     }
//     return location.pathname.startsWith(`${activeWhen.path}`);
//   }
// }
// /* eslint-enable */
// /* tslint:enable */
