import React from 'react';
import {
  ErrorLoader,
  ErrorLoaderDescription,
  ErrorLoaderTitle,
} from '@akashaorg/ui/lib/akasha-components/error-loader';
import { useTranslation } from 'react-i18next';

type ErrorComponentProps = {
  error: string;
};

const ErrorComponent: React.FC<ErrorComponentProps> = props => {
  const { error } = props;
  const { t } = useTranslation('ui-widget-topbar');
  return (
    <ErrorLoader type="script-error">
      <ErrorLoaderTitle>{t('Error in topbar widget')}</ErrorLoaderTitle>
      <ErrorLoaderDescription>{error}</ErrorLoaderDescription>
    </ErrorLoader>
  );
};

export default ErrorComponent;
