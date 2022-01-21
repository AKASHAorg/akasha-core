import * as React from 'react';
import DS from '@akashaproject/design-system';
import routes, { SIGN_UP } from '../../routes';
const { ErrorLoader, Button } = DS;

interface SuggestSignupProps {
  onNavigate: (route: string) => void;
}

const SuggestSignup: React.FC<SuggestSignupProps> = props => {
  const handleSignUpClick = () => {
    props.onNavigate(routes[SIGN_UP]);
  };

  return (
    <ErrorLoader
      type="not-registered"
      title={'No account associated with this Ethereum address'}
      details={'Please sign up to create an Ethereum World account'}
      style={{ padding: '1em 3em' }}
    >
      <Button primary={true} label={'Sign Up'} onClick={handleSignUpClick} />
    </ErrorLoader>
  );
};

export default SuggestSignup;
