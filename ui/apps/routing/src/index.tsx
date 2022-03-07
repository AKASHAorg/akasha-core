import { BehaviorSubject } from 'rxjs';
import { MenuItemAreaType } from '@akashaproject/ui-awf-typings/lib/app-loader';

interface RouteRepository {
  all?: {
    [key: string]: Record<string, string | string[]>;
  };
  active?: {
    [key: string]: Record<string, unknown>;
  };
  byArea?: { [key in MenuItemAreaType]?: Array<Record<string, unknown>> };
}

export class RoutingPlugin {
  static readonly routeRepository: RouteRepository = {
    all: {},
    active: {},
    byArea: Object.values(MenuItemAreaType).reduce((acc, curr) => ({ ...acc, [curr]: [] }), {}),
  };
  static subject = new BehaviorSubject(RoutingPlugin.routeRepository);
  static observationActive = false;

  static initRouteObservation() {
    if (RoutingPlugin.observationActive) return;
    RoutingPlugin.observationActive = true;

    window.addEventListener('single-spa:app-registered', (evt: CustomEvent) => {
      if (evt.detail) {
        RoutingPlugin.routeRepository.all[evt.detail.app] = evt.detail.menuItems;
        if (evt.detail.menuItems?.area?.length) {
          evt.detail.menuItems.area.forEach(area =>
            RoutingPlugin.routeRepository.byArea[area].push(evt.detail.menuItems),
          );
        }
        RoutingPlugin.subject.next(RoutingPlugin.routeRepository);
      }
    });
    window.addEventListener('single-spa:before-app-change', (e: CustomEvent) => {
      if (e.detail?.appsByNewStatus?.MOUNTED?.length) {
        RoutingPlugin.routeRepository.active = e.detail?.appsByNewStatus?.MOUNTED.reduce(
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
}

export const register = async () => {
  RoutingPlugin.initRouteObservation();
  return {
    loadingFn: () => Promise.resolve(),
    name: 'app-routing',
  };
};

export const getPlugin = async () => {
  RoutingPlugin.initRouteObservation();

  return {
    routing: {
      routeObserver: RoutingPlugin.subject,
    },
  };
};
