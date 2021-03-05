import * as React from 'react';
export interface ILoginWidgetCardProps {
  onLoginClick: () => void;
  onLearnMoreClick?: () => void;
  title: string;
  textContent: string;
  image?: React.ReactElement;
  learnMoreLabel?: string;
  signInLabel: string;
  signUpLabel: string;
  inlineActions?: boolean;
}
declare const LoginCTACard: React.FC<ILoginWidgetCardProps>;
export default LoginCTACard;
