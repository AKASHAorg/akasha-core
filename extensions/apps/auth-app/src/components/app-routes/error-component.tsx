import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ErrorLoader,
  ErrorLoaderDescription,
  ErrorLoaderTitle,
} from '@akashaorg/ui/lib/akasha-components/error-loader';

type ErrorComponentProps = {
  error: string;
};

const ErrorComponent: React.FC<ErrorComponentProps> = props => {
  const { error } = props;
  const { t } = useTranslation('app-extensions');
  return (
    <ErrorLoader type="script-error">
      <ErrorLoaderTitle>{t('Error in authentication app')}</ErrorLoaderTitle>
      <ErrorLoaderDescription>{error}</ErrorLoaderDescription>
    </ErrorLoader>
  );
};

export default ErrorComponent;
