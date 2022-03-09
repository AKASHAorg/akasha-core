import { IMenuItem, MenuItemAreaType } from '@akashaproject/ui-awf-typings/lib/app-loader';

type RouteMenuItem = IMenuItem & { navRoutes: Record<string, string> };

export interface RouteRepository {
  all: Record<string, RouteMenuItem>;
  activeIntegrationNames: {
    apps?: string[];
    widgets?: string[];
  };
  byArea: { [key in MenuItemAreaType]?: Array<RouteMenuItem> };
}

export interface NavigationOptions {
  appName: string;
  getNavigationUrl: (navRoute: Record<string, string>) => string;
}
