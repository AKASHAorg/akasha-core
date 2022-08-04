import { IAppConfig } from './apps';
import { IntegrationRegistrationOptions } from './app-loader';

export type IWidgetConfig = Omit<IAppConfig, 'routes' | 'menuItems'>;
export type WidgetRegistrationFn = (props: IntegrationRegistrationOptions) => IWidgetConfig;
