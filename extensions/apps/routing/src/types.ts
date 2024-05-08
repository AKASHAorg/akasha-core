import { IMenuItem, MenuItemAreaType } from '@akashaorg/typings/lib/ui';

type RouteMenuItem = IMenuItem & { navRoutes: Record<string, string> };

export interface RouteRepository {
  all: Record<string, RouteMenuItem>;
  activeIntegrationNames: {
    apps?: string[];
    widgets?: string[];
  };
  byArea: { [key in MenuItemAreaType]?: Array<RouteMenuItem> };
}
