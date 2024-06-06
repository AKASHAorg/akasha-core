interface WorldConfigOverrides {
  defaultPlugins?: string[];
  defaultApps?: string[];
  defaultWidgets?: string[];
  layout?: string;
  homepageApp?: string;
  title?: string;
}
export const genWorldConfig = (overrides?: WorldConfigOverrides) => {
  return {
    defaultPlugins: [],
    defaultApps: [],
    defaultWidgets: [],
    layout: '@test/layout',
    homepageApp: '@test/homepageApp',
    title: 'Test World Title',
    registryOverrides: [],
    ...overrides,
  };
};
