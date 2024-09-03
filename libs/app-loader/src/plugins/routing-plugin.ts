import 'systemjs-webpack-interop/auto-public-path';
import * as singleSpa from 'single-spa';
import { MenuItemAreaType, NavigateToParams, IMenuItem } from '@akashaorg/typings/lib/ui';
import { ILogger } from '@akashaorg/typings/lib/sdk/log';

type RouteMenuItem = IMenuItem & { navRoutes: Record<string, string> };

export interface RouteRepository {
  all: Record<string, RouteMenuItem>;
  activeExtensionsNames: {
    apps?: string[];
    widgets?: string[];
  };
  byArea: { [key in MenuItemAreaType]?: Array<RouteMenuItem> };
}

export class RoutingPlugin {
  readonly #routeRepository: RouteRepository;
  readonly #logger: ILogger;
  static #instance: RoutingPlugin;
  readonly #encodeAppName: (name: string) => string;
  readonly #decodeAppName: (name: string) => string;
  #changeListeners: ((repository: RouteRepository) => void)[];
  private constructor(
    logger: ILogger,
    encodeAppName: (name: string) => string,
    decodeAppName: (name: string) => string,
  ) {
    this.#routeRepository = {
      all: {},
      activeExtensionsNames: {},
      byArea: Object.values(MenuItemAreaType).reduce((acc, curr) => ({ ...acc, [curr]: [] }), {}),
    };
    this.#logger = logger;
    this.#encodeAppName = encodeAppName;
    this.#decodeAppName = decodeAppName;
    this.#changeListeners = [];
  }
  /**
   * Get singleton instance
   **/
  static getInstance(
    logger: ILogger,
    encodeAppName: (name: string) => string,
    decodeAppName: (name: string) => string,
  ) {
    if (!this.#instance) {
      this.#instance = new RoutingPlugin(logger, encodeAppName, decodeAppName);
      this.#instance.#listenEvents();
    }
    return this.#instance;
  }

  #listenEvents() {
    window.addEventListener('single-spa:before-app-change', (e: CustomEvent) => {
      if (e.detail?.appsByNewStatus?.MOUNTED?.length) {
        this.#routeRepository.activeExtensionsNames = e.detail?.appsByNewStatus?.MOUNTED.reduce(
          (acc: { apps: string[]; widgets: string[] }, appName: string) => {
            if (this.#routeRepository.all[appName]) {
              acc.apps = [...acc.apps, appName];
            } else {
              acc.widgets = [...acc.widgets, appName];
            }
            return acc;
          },
          { apps: [], widgets: [] },
        );
      }
    });
  }

  addRouteToRepository(name: string, menuItem: IMenuItem, navRoutes: Record<string, string>) {
    const appMenuItemData = {
      ...menuItem,
      navRoutes: navRoutes,
      name: name,
    };

    this.#routeRepository.all[name] = appMenuItemData;
    menuItem?.area?.forEach((menuArea: MenuItemAreaType) =>
      this.#routeRepository.byArea[menuArea].push(appMenuItemData),
    );
  }

  registerRoute(routeData: {
    name: string;
    menuItems?: IMenuItem | IMenuItem[];
    navRoutes?: Record<string, string>;
  }) {
    if (this.#routeRepository.all[routeData.name]) {
      return;
    }
    if (Array.isArray(routeData.menuItems)) {
      routeData.menuItems.forEach(menuItem => {
        this.addRouteToRepository(routeData.name, menuItem, routeData.navRoutes);
      });
      this.#changeListeners.forEach(listnr => listnr(this.#routeRepository));
    } else {
      this.addRouteToRepository(routeData.name, routeData.menuItems, routeData.navRoutes);
      this.#changeListeners.forEach(listnr => listnr(this.#routeRepository));
    }
  }

  unregisterRoute(extensionName: string) {
    delete this.#routeRepository.all[extensionName];
    delete this.#routeRepository.activeExtensionsNames[extensionName];
    for (const area in this.#routeRepository.byArea) {
      if (this.#routeRepository.byArea.hasOwnProperty(area)) {
        this.#routeRepository.byArea[area] = this.#routeRepository.byArea[area].filter(
          (menuItem: RouteMenuItem) => menuItem.name !== extensionName,
        );
      }
    }
    this.#changeListeners.forEach(listnr => listnr(this.#routeRepository));
  }

  navigateTo({ appName, getNavigationUrl }: NavigateToParams, replace?: boolean) {
    const app = this.#routeRepository.all[appName];
    let url: string;

    if (getNavigationUrl) {
      try {
        url = getNavigationUrl(app?.navRoutes);
      } catch (err) {
        this.#logger.error(
          `Path not found! Tried to find a path for application: ${appName}. Defaulting to rootRoute!`,
        );
      }
    }
    if (!url) {
      url = '/';
    }

    const targetUrl = `/${this.#encodeAppName(appName)}${url}`;
    // no need to navigate because the paths are the same
    if (targetUrl === location.pathname && !location.search) {
      return;
    }

    if (replace) {
      window.history.replaceState(null, null, targetUrl);
    } else {
      singleSpa.navigateToUrl(targetUrl);
    }
  }

  getUrlForApp({ appName, getNavigationUrl }: NavigateToParams) {
    const app = this.#routeRepository.all[appName];
    let url = '';
    if (getNavigationUrl) {
      try {
        url = getNavigationUrl(app?.navRoutes);
      } catch (err) {
        this.#logger.error(
          `Path not found! Tried to find a path for application: ${appName}. Defaulting to rootRoute!`,
        );
        url = undefined;
      }
    }

    if (!url === undefined) {
      url = '/';
    }

    return `/${this.#encodeAppName(appName)}${url}`;
  }
  /**
   * handle redirections from search params
   * if redirectTo is found in the search param then it will redirect to that path
   * otherwise will use the fallback object {@link NavigateToParams}
   * @example
   * ```
   *  handleRedirect({
   *     search: new URLSearchParam(location.search),
   *     fallBack: {
   *       appName: '@akashaorg/app-lists',
   *       getNavigationUrl: (routes) => routes.someRoute
   *     }
   *  });
   * ```
   */

  handleRedirect(options: { search: URLSearchParams; fallback: NavigateToParams }) {
    const redirectTo = options.search.get('redirectTo');
    if (redirectTo) {
      // appName is at index 1 in "/@akashaorg/app-name/some-path"
      const [, appName, ...path] = redirectTo.split('/');
      const decodedAppName = this.#decodeAppName(appName);
      return this.navigateTo({
        appName: decodedAppName,
        getNavigationUrl: () => {
          return `/${path.join('/')}`;
        },
      });
    }
    return this.navigateTo(options.fallback);
  }

  subscribe(listener: () => void) {
    this.#changeListeners.push(listener);
    return () => {
      this.#changeListeners.filter(cb => cb !== listener);
    };
  }
}
