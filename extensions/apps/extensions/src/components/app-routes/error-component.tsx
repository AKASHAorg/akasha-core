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
      <ErrorLoaderTitle>{t('Error in extensions app')}</ErrorLoaderTitle>
      <ErrorLoaderDescription>{error}</ErrorLoaderDescription>
    </ErrorLoader>
  );
};

export const RouteErrorComponent = () => {
  const { t } = useTranslation('app-extensions');
  return (
    <ErrorLoader type="script-error">
      <ErrorLoaderTitle>{t('Oops, this page returned an error :(')}</ErrorLoaderTitle>
      <ErrorLoaderDescription>
        {t(
          'There is an error somewhere in this page and we need to display this card to avoid other issues.',
        )}
      </ErrorLoaderDescription>
    </ErrorLoader>
  );
};

export default ErrorComponent;
