import { IPlugin, IWidget } from '.';

const validateServices = services => {
  return true;
};

export const validatePlugin = (plugin: IPlugin) => {
  let isValid = false;
  if (Array.isArray(plugin.services)) {
    isValid = validateServices(plugin.services);
  }
  return true;
};

export const validateWidget = (widget: IWidget) => {
  let isValid = false;
  if (Array.isArray(widget.services)) {
    isValid = validateServices(widget.services);
  }
  return true;
};
