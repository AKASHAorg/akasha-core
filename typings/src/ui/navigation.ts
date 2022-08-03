import { RequireAtLeastOne } from './type-utils';
import { EntityTypes } from './ui-events';

export interface NavigationOptions {
  appName: string;
  getNavigationUrl: (navRoute: Record<string, string>) => string;
}

export type NavigateToParams = RequireAtLeastOne<NavigationOptions, 'appName' | 'getNavigationUrl'>;

export interface ModalNavigationOptions {
  name: string;
  pubKey?: string;
  entryId?: string;
  entryType?: EntityTypes;
  [key: string]: string | unknown | undefined;
}
