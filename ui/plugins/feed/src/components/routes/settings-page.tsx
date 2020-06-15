import * as React from 'react';
import { RouteProps } from 'react-router';

export interface ISettingsPageProps {}

const SettingsPage: React.FC<ISettingsPageProps & RouteProps> = () => {
  return <div>Settings page</div>;
};

export default SettingsPage;
