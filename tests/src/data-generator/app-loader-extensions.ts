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
