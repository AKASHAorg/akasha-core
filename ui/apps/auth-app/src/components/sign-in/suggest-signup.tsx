import * as React from 'react';
import { useTranslation } from 'react-i18next';
import DS from '@akashaorg/design-system';

import routes, { SIGN_UP } from '../../routes';

const { ErrorLoader, Button } = DS;

interface SuggestSignupProps {
  onNavigate: (route: string) => void;
}

const SuggestSignup: React.FC<SuggestSignupProps> = props => {
  const { t } = useTranslation('app-auth-ewa');

  const handleSignUpClick = () => {
    props.onNavigate(routes[SIGN_UP]);
  };

  return (
    <ErrorLoader
      type="not-registered"
      title={t('No account associated with this Ethereum address')}
      details={t('Please sign up to create an Ethereum World account')}
      style={{ padding: '1em 3em' }}
    >
      <Button primary={true} label={t('Sign Up')} onClick={handleSignUpClick} />
    </ErrorLoader>
  );
};

export default SuggestSignup;
