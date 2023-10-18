import 'systemjs-webpack-interop/auto-public-path';
import { BehaviorSubject } from 'rxjs';
import * as singleSpa from 'single-spa';
import {
  MenuItemAreaType,
  NavigateToParams,
  RootComponentProps,
  RouteRegistrationEvents,
  RoutesRegisterEvent,
} from '@akashaorg/typings/lib/ui';
import getSDK from '@akashaorg/awf-sdk';
import { APP_EVENTS } from '@akashaorg/typings/lib/sdk';
import { RouteRepository } from './types';
import { filterEvent } from '@akashaorg/ui-awf-hooks';

export class RoutingPlugin {
  static readonly routeRepository: RouteRepository = {
    all: {},
    activeIntegrationNames: {},
    byArea: Object.values(MenuItemAreaType).reduce((acc, curr) => ({ ...acc, [curr]: [] }), {}),
  };
  static subject = new BehaviorSubject(RoutingPlugin.routeRepository);
  static logger;
  static decodeAppName;
  static encodeAppName;

  static initRouteObservation(uiEvents: RootComponentProps['uiEvents']) {
    const globalChannel = getSDK().api.globalChannel;
    globalChannel.subscribe({
      next(evData) {
        if (evData.event === APP_EVENTS.REMOVED) {
          const removed = evData.data as { name: string };
          const { all, activeIntegrationNames, byArea } = RoutingPlugin.routeRepository;
          delete all[removed.name];
          delete activeIntegrationNames[removed.name];
          for (const area in byArea) {
            if (byArea.hasOwnProperty(area)) {
              byArea[area] = byArea[area].filter(menuItem => menuItem.name !== removed.name);
            }
          }
          RoutingPlugin.subject.next(RoutingPlugin.routeRepository);
        }
      },
    });
    uiEvents.pipe(filterEvent(RouteRegistrationEvents.RegisterRoutes)).subscribe({
      next: (eventData: RoutesRegisterEvent) => {
        // allow only one entry per app
        if (RoutingPlugin.routeRepository.all[eventData.data.name]) {
          return;
        }
        if (Array.isArray(eventData.data.menuItems)) {
          eventData.data.menuItems.forEach(item => {
            const appMenuItemData = {
              ...item,
              navRoutes: eventData.data.navRoutes,
              name: eventData.data.name,
            };
            RoutingPlugin.routeRepository.all[eventData.data.name] = appMenuItemData;
            item?.area?.forEach((area: MenuItemAreaType) =>
              RoutingPlugin.routeRepository.byArea[area].push(appMenuItemData),
            );
            RoutingPlugin.subject.next(RoutingPlugin.routeRepository);
          });
        } else {
          const appMenuItemData = {
            ...eventData.data.menuItems,
            navRoutes: eventData.data.navRoutes,
            name: eventData.data.name,
          };
          RoutingPlugin.routeRepository.all[eventData.data.name] = appMenuItemData;
          eventData.data.menuItems?.area?.forEach((area: MenuItemAreaType) =>
            RoutingPlugin.routeRepository.byArea[area].push(appMenuItemData),
          );
          RoutingPlugin.subject.next(RoutingPlugin.routeRepository);
        }
      },
    });

    window.addEventListener('single-spa:before-app-change', (e: CustomEvent) => {
      if (e.detail?.appsByNewStatus?.MOUNTED?.length) {
        RoutingPlugin.routeRepository.activeIntegrationNames =
          e.detail?.appsByNewStatus?.MOUNTED.reduce(
            (acc, appName) => {
              if (RoutingPlugin.routeRepository.all[appName]) {
                acc.apps = [...acc.apps, appName];
              } else {
                acc.widgets = [...acc.widgets, appName];
              }
              return acc;
            },
            { apps: [], widgets: [] },
          );
        RoutingPlugin.subject.next(RoutingPlugin.routeRepository);
      }
    });
  }

  static navigateTo = ({ appName, getNavigationUrl }: NavigateToParams, replace?: boolean) => {
    const app = RoutingPlugin.routeRepository.all[appName];
    let url: string;

    if (getNavigationUrl) {
      try {
        url = getNavigationUrl(app?.navRoutes);
      } catch (err) {
        RoutingPlugin.logger.error(
          `Path not found! Tried to find a path for application: ${appName}. Defaulting to rootRoute!`,
        );
      }
    }
    if (!url) {
      url = '/';
    }

    const targetUrl = `/${RoutingPlugin.encodeAppName(appName)}${url}`;
    // no need to navigate because the paths are the same
    if (targetUrl === location.pathname && !location.search) {
      return;
    }

    if (replace) {
      window.history.replaceState(null, null, targetUrl);
    } else {
      singleSpa.navigateToUrl(targetUrl);
    }
  };

  static getUrlForApp = ({ appName, getNavigationUrl }: NavigateToParams) => {
    const app = RoutingPlugin.routeRepository.all[appName];
    let url = '';
    if (getNavigationUrl) {
      try {
        url = getNavigationUrl(app?.navRoutes);
      } catch (err) {
        RoutingPlugin.logger.error(
          `Path not found! Tried to find a path for application: ${appName}. Defaulting to rootRoute!`,
        );
        url = undefined;
      }
    }

    if (!url === undefined) {
      url = '/';
    }

    return `/${RoutingPlugin.encodeAppName(appName)}${url}`;
  };
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

  static handleRedirect = (options: { search: URLSearchParams; fallback: NavigateToParams }) => {
    const redirectTo = options.search.get('redirectTo');
    if (redirectTo) {
      // appName is at index 1 in "/@akashaorg/app-name/some-path"
      const [, appName, ...path] = redirectTo.split('/');
      const decodedAppName = RoutingPlugin.decodeAppName(appName);
      return RoutingPlugin.navigateTo({
        appName: decodedAppName,
        getNavigationUrl: () => {
          return `/${path.join('/')}`;
        },
      });
    }
    return RoutingPlugin.navigateTo(options.fallback);
  };
}

export const getPlugin = async (
  props: RootComponentProps & {
    encodeAppName: (name: string) => string;
    decodeAppName: (name: string) => string;
  },
) => {
  RoutingPlugin.logger = props.logger;
  RoutingPlugin.initRouteObservation(props.uiEvents);
  RoutingPlugin.decodeAppName = props.decodeAppName;
  RoutingPlugin.encodeAppName = props.encodeAppName;
  return {
    routing: {
      routeObserver: RoutingPlugin.subject,
      navigateTo: RoutingPlugin.navigateTo,
      handleRedirect: RoutingPlugin.handleRedirect,
      getUrlForApp: RoutingPlugin.getUrlForApp,
    },
  };
};
