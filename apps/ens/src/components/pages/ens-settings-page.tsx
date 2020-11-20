import * as React from 'react';
import DS from '@akashaproject/design-system';
import { SETTINGS_PAGE } from '../../routes';

const { Helmet } = DS;
export interface EnsSettingsPageProps {
  sdkModules: any;
  globalChannel: any;
  logger: any;
}

const EnsSettingsPage: React.FC<EnsSettingsPageProps> = () => {
  return (
    <div>
      <Helmet.Helmet>
        <title>ENS | {SETTINGS_PAGE}</title>
      </Helmet.Helmet>
      ENS Settings Page
    </div>
  );
};

export default EnsSettingsPage;
