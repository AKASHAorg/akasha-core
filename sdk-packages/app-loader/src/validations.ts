import { IPlugin, IWidget } from './interfaces';

const validateServices = (services: any) => {
  return true;
};

export const validatePlugin = (plugin: IPlugin) => {
  let isValid = true;
  if (Array.isArray(plugin.services)) {
    isValid = validateServices(plugin.services);
  }
  return isValid;
};

export const validateWidget = (widget: IWidget) => {
  let isValid = true;
  if (Array.isArray(widget.services)) {
    isValid = validateServices(widget.services);
  }
  return isValid;
};
