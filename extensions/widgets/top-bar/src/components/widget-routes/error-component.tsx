import React from 'react';
import ErrorLoader from '@akashaorg/ui/lib/akasha-components/error-loader';
import { useTranslation } from 'react-i18next';

type ErrorComponentProps = {
  error: string;
};

const ErrorComponent: React.FC<ErrorComponentProps> = props => {
  const { error } = props;
  const { t } = useTranslation('ui-widget-topbar');
  return <ErrorLoader type="script-error" title={t('Error in topbar widget')} details={error} />;
};

export default ErrorComponent;
