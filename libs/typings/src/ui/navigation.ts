import { RequireAtLeastOne } from './type-utils';
import { EntityTypes } from './ui-events';

/**
 * Interface defining navigation object
 * @internal
 **/
interface NavigationOptions {
  appName: string;
  getNavigationUrl: (navRoute: Record<string, string>) => string;
}

/**
 * @deprecated
 **/
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

/**
 * Type defining params of navigate to function of a routing plugin
 **/
export type NavigateToParams = RequireAtLeastOne<NavigationOptions, 'appName' | 'getNavigationUrl'>;

/**
 * Type defining params of a modal navigation
 **/
export interface ModalNavigationOptions {
  name: string;
  message?: string;
  title?: string;
  did?: string;
  itemId?: string;
  itemType?: EntityTypes;
  [key: string]: string | unknown | undefined;
}
