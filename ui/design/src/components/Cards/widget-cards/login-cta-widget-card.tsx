import * as React from 'react';
import { Box, Text } from 'grommet';
import styled from 'styled-components';
import { WidgetAreaCardBox } from '../common/basic-card-box';
import { Button } from '../../Buttons';

const SignInButton = styled(Button)`
  flex-grow: 1;
  margin-right: 0.5em;
`;

const SignUpButton = styled(Button)`
  flex-grow: 1;
`;

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
      <Box direction={inlineActions ? 'row' : 'column'} align="center" gap="xsmall">
        <Box direction="column">
          <Text weight="bold" size="large">
            {props.title}
          </Text>
          <Text size="small" margin={{ top: '.25em', bottom: '1em' }}>
            {props.textContent}
          </Text>
        </Box>
        <Box
          direction="row"
          justify={inlineActions ? 'end' : 'stretch'}
          align="center"
          flex={inlineActions ? { shrink: 0 } : 'grow'}
          fill={inlineActions ? false : 'horizontal'}
        >
          <SignInButton onClick={props.onLoginClick} label={props.signInLabel} />
          <SignUpButton primary={true} onClick={props.onLoginClick} label={props.signUpLabel} />
        </Box>
      </Box>
    </LoginWidgetBox>
  );
};

export default LoginCTACard;
