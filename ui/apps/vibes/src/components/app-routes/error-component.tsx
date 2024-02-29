import React from 'react';
import { useTranslation } from 'react-i18next';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';

type ErrorComponentProps = {
  error: string;
};

const ErrorComponent: React.FC<ErrorComponentProps> = props => {
  const { error } = props;
  const { t } = useTranslation('app-vibes');
  return <ErrorLoader type="script-error" title={t('Error in vibes app')} details={error} />;
};

export default ErrorComponent;
