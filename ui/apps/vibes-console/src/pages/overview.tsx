import React from 'react';

import { NavigateToParams } from '@akashaorg/typings/lib/ui';

export const DEFAULT_LIMIT = 10;

export type BasePageProps = {
  user?: string | null;
  navigateTo: (args: NavigateToParams) => void;
};

export type DashboardProps = BasePageProps & {
  isAuthorised: boolean;
};

export const Dashboard: React.FC<DashboardProps> = () => {
  return <div>overview here...</div>;
};
