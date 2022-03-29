import { BehaviorSubject } from 'rxjs';
import * as singleSpa from 'single-spa';
import {
  EventTypes,
  MenuItemAreaType,
  UIEventData,
} from '@akashaproject/ui-awf-typings/lib/app-loader';
import { RootComponentProps, RequireAtLeastOne } from '@akashaproject/ui-awf-typings';
import { NavigationOptions, RouteRepository } from './types';
import getSDK from '@akashaproject/awf-sdk';
import { events } from '@akashaproject/sdk-typings';

export class RoutingPlugin {
  static readonly routeRepository: RouteRepository = {
    all: {},
    activeIntegrationNames: {},
    byArea: Object.values(MenuItemAreaType).reduce((acc, curr) => ({ ...acc, [curr]: [] }), {}),
  };
  static subject = new BehaviorSubject(RoutingPlugin.routeRepository);
  static logger;

  static initRouteObservation(uiEvents: RootComponentProps['uiEvents']) {
    const globalChannel = getSDK().api.globalChannel;
    globalChannel.subscribe({
      next(evData) {
        if (evData.event === events.APP_EVENTS.REMOVED) {
          const removed = evData.data as { name: string };
          const { all, activeIntegrationNames, byArea } = RoutingPlugin.routeRepository;
          delete all[removed.name];
          delete activeIntegrationNames[removed.name];
          for (const area in byArea) {
            byArea[area] = byArea[area].filter(route => route.name !== removed.name);
          }
          RoutingPlugin.subject.next(RoutingPlugin.routeRepository);
        }
      },
    });
    uiEvents.subscribe({
      next: (eventData: UIEventData) => {
        if (eventData.event === EventTypes.RegisterIntegration) {
          const appData = {
            ...eventData.data.menuItems,
            navRoutes: eventData.data.navRoutes,
            name: eventData.data.name,
          };
          RoutingPlugin.routeRepository.all[eventData.data.name] = appData;
          eventData.data.menuItems?.area?.forEach((area: MenuItemAreaType) =>
            RoutingPlugin.routeRepository.byArea[area].push(appData),
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

  static navigateTo = ({
    appName,
    getNavigationUrl,
  }: RequireAtLeastOne<NavigationOptions, 'appName' | 'getNavigationUrl'>) => {
    const app = RoutingPlugin.routeRepository.all[appName];
    let url;

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
      url = app?.route;
    }

    if (url) return singleSpa.navigateToUrl(url);
    RoutingPlugin.logger.error(
      `Path not found! Tried to find a path for application: ${appName}. Aborting.`,
    );
  };
}

export const register = async () => {
  return {
    loadingFn: () => Promise.resolve(),
  };
};

export const getPlugin = async (props: RootComponentProps) => {
  RoutingPlugin.logger = props.logger;
  RoutingPlugin.initRouteObservation(props.uiEvents);

  return {
    routing: {
      routeObserver: RoutingPlugin.subject,
      navigateTo: RoutingPlugin.navigateTo,
    },
  };
};
