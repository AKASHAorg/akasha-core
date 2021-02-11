import * as React from 'react';
import { Box, Text } from 'grommet';
import styled from 'styled-components';
import { WidgetAreaCardBox } from '../common/basic-card-box';
import { Button } from '../../Buttons';

const SignInButton = styled(Button)`
  flex: 1;
  margin-right: 0.5em;
`;

const SignUpButton = styled(Button)`
  flex: 1;
`;

// @ts-ignore-next-line
const LoginWidgetBox = styled(WidgetAreaCardBox)`
  padding: 1em;
`;
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
const LoginCTACard: React.FC<ILoginWidgetCardProps> = props => {
  const { inlineActions = false } = props;
  return (
    <LoginWidgetBox callToAction={true}>
      {props.image && props.image}
      <Box direction={inlineActions ? 'row' : 'column'} align="center">
        <Box direction="column">
          <Text weight="bold" size="large">
            {props.title}
          </Text>
          <Text size="small" margin={{ top: '.25em', bottom: '1em' }}>
            {props.textContent}
          </Text>
        </Box>
        <Box direction="row" justify="end" pad="0 0 0 2em" align="center" flex={{ shrink: 0 }}>
          <SignInButton onClick={props.onLoginClick} label={props.signInLabel} />
          <SignUpButton primary={true} onClick={props.onLoginClick} label={props.signUpLabel} />
        </Box>
      </Box>
    </LoginWidgetBox>
  );
};

export default LoginCTACard;
