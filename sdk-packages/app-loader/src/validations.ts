import { IPlugin, IWidget } from '@akashaproject/ui-awf-typings/app-loader';

const validateServices = (services: any) => {
  return true;
};

export const validatePlugin = (plugin: IPlugin) => {
  let isValid = true;
  if (Array.isArray(plugin.sdkModules)) {
    isValid = validateServices(plugin.sdkModules);
  }
  return isValid;
};

export const validateWidget = (widget: IWidget) => {
  let isValid = true;
  if (Array.isArray(widget.sdkModules)) {
    isValid = validateServices(widget.sdkModules);
  }
  return isValid;
};
