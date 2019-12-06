import { IApp } from '../state/profiles/interfaces';

export const fetchApps = (appIds: string[] | string): Promise<{ apps: IApp[] }> => {
  if (Array.isArray(appIds)) {
    return Promise.resolve({
      apps: [],
    });
  }
  return Promise.resolve({
    apps: [],
  });
};
