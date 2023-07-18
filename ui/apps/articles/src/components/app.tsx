import * as React from 'react';
import { RootComponentProps } from '@akashaorg/typings/ui';
import { I18nextProvider } from 'react-i18next';
import Spinner from '@akashaorg/design-system-core/lib/components/Spinner';

import AppRoutes from './app-routes';

const Application: React.FC<RootComponentProps> = props => {
  return (
    <React.Suspense fallback={<Spinner />}>
      <I18nextProvider i18n={props.plugins?.translation?.i18n}>
        <AppRoutes {...props} />
      </I18nextProvider>
    </React.Suspense>
  );
};

export default Application;
