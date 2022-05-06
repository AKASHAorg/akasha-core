export const genExtConfig = (mountsIn: string | (() => string)) => {
  return {
    mountsIn,
    loadingFn: () => true,
    parent: '@test/parent',
  };
};

export const genMountPoints = (namePrefix?: string, data?: Record<string, unknown>) => {
  const count = 5;
  const mountPoints = new Map();
  for (let i = 0; i < count; i++) {
    mountPoints.set(`${namePrefix ? `${namePrefix}-` : ''}${i}-mount-point`, {
      name: `${namePrefix}-${i}-mount-point`,
      ...data,
    });
  }
  return mountPoints;
};

export const genExtConfigs = () => {
  const count = 5;
  const extConfigs = new Map();
  for (let i = 0; i < count; i++) {
    extConfigs.set(`${i}-extension`, genExtConfig(`${i}-mount-point`));
  }
  return extConfigs;
};

export const genExtConfigsByMountPoint = (configs: Map<string, any>) => {
  const extConfigsByMountPoint = new Map();
  configs.forEach((config, name) => {
    extConfigsByMountPoint.set(config.mountsIn, [config]);
  });
  return extConfigsByMountPoint;
};
