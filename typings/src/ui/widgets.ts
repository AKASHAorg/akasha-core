import { IAppConfig } from './apps';

export type IWidgetConfig = Omit<IAppConfig, 'routes' | 'menuItems'>;
