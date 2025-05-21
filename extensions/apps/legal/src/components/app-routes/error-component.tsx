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
  const { t } = useTranslation('app-legal');
  return (
    <ErrorLoader type="script-error" title={t('Error in legal app')}>
      <ErrorLoaderTitle>{t('Error in legal app')}</ErrorLoaderTitle>
      <ErrorLoaderDescription>{error}</ErrorLoaderDescription>
    </ErrorLoader>
  );
};

export default ErrorComponent;
