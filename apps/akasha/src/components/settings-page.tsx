import * as React from 'react';
import DS from '@akashaproject/design-system';
import { RouteComponentProps } from 'react-router-dom';

const { Helmet } = DS;

export interface SettingsPageProps {
  globalChannel: any;
  sdkModules: any;
  logger: any;
}

const SettingsPage: React.FC<SettingsPageProps & RouteComponentProps> = () => {
  return (
    <>
      <Helmet>
        <title>AKASHA Settings | Ethereum.world</title>
      </Helmet>
      Settings Page
    </>
  );
};

export default SettingsPage;
