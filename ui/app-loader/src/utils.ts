import { AppOrWidgetDefinition } from '@akashaproject/ui-awf-typings/lib/app-loader';

export const getNameFromDef = (def: AppOrWidgetDefinition) => {
  if (typeof def === 'string') {
    return def;
  } else if (typeof def === 'object' && def.hasOwnProperty('name')) {
    return def.name;
  } else {
    return null;
  }
};

export const toNormalDef = (
  def: AppOrWidgetDefinition,
): { name: string; version: string } | null => {
  if (typeof def === 'string') {
    return {
      name: def,
      version: 'latest',
    };
  } else if (
    typeof def === 'object' &&
    def.hasOwnProperty('version') &&
    def.hasOwnProperty('name')
  ) {
    return def;
  } else {
    return null;
  }
};
