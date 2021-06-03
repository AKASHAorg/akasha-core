import { IAppConfig, IWidgetConfig } from '@akashaproject/ui-awf-typings/lib/app-loader';

const validateServices = (_services: unknown) => {
  return true;
};

export const validatePlugin = (plugin: IAppConfig) => {
  let isValid = true;
  if (Array.isArray(plugin.sdkModules)) {
    isValid = validateServices(plugin.sdkModules);
  }
  return isValid;
};

export const validateWidget = (widget: IWidgetConfig) => {
  let isValid = true;
  if (Array.isArray(widget.sdkModules)) {
    isValid = validateServices(widget.sdkModules);
  }
  return isValid;
};
