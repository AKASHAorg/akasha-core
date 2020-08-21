import * as React from 'react';
import DS from '@akashaproject/design-system';

const { Helmet } = DS;

export interface SettingsPageProps {
  globalChannel: any;
  sdkModules: any;
  logger: any;
  onLoginModalShow: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = () => {
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
