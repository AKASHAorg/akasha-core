import { RequireAtLeastOne } from './type-utils';
import { EntityTypes } from './ui-events';

export interface NavigationOptions {
  appName: string;
  getNavigationUrl: (navRoute: Record<string, string>) => string;
}

export type IContentClickDetails = {
  authorId: string;
  id: string;
  //flag to check reflect action
  reflect?: boolean;
  replyTo?: {
    authorId?: string;
    itemId?: string;
  };
};

export type NavigateToParams = RequireAtLeastOne<NavigationOptions, 'appName' | 'getNavigationUrl'>;

export interface ModalNavigationOptions {
  name: string;
  message?: string;
  title?: string;
  did?: string;
  itemId?: string;
  itemType?: EntityTypes;
  [key: string]: string | unknown | undefined;
}
