import React from 'react';
import {
  ErrorLoader,
  ErrorLoaderTitle,
  ErrorLoaderDescription,
} from '@akashaorg/ui/lib/akasha-components/error-loader';
import { useTranslation } from 'react-i18next';

type ErrorComponentProps = {
  error: string;
};

const ErrorComponent: React.FC<ErrorComponentProps> = props => {
  const { error } = props;
  const { t } = useTranslation('app-world-builder');
  return (
    <ErrorLoader type="script-error">
      <ErrorLoaderTitle>{t('Error in World Builder app')}</ErrorLoaderTitle>
      <ErrorLoaderDescription>{error}</ErrorLoaderDescription>
    </ErrorLoader>
  );
};

export const RouteErrorComponent = () => (
  <ErrorLoader type="script-error">
    <ErrorLoaderTitle>{'Oops, this page returned an error :('}</ErrorLoaderTitle>
    <ErrorLoaderDescription>
      {
        'There is an error somewhere in this page and we need to display this card to avoid other issues.'
      }
    </ErrorLoaderDescription>
  </ErrorLoader>
);

export default ErrorComponent;
