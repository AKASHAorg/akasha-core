import * as React from 'react';
import { Box, Text } from 'grommet';
import styled from 'styled-components';
import { WidgetAreaCardBox } from '../common/basic-card-box';
import { Button } from '../../Buttons';

const LearnMoreButton = styled(Button)`
  flex: 1;
  margin-right: 0.5em;
`;

const ConnectButton = styled(Button)`
  flex: 1;
`;

// @ts-ignore-next-line
const LoginWidgetBox = styled(WidgetAreaCardBox)`
  padding: 1em;
  margin-top: 2em;
  margin-bottom: 0.5em;
`;
export interface ILoginWidgetCardProps {
  onLoginClick: () => void;
  onLearnMoreClick: () => void;
  title: string;
  textContent: string;
  image: React.ReactElement;
  learnMoreLabel: string;
  connectLabel: string;
}
const LoginCTACard: React.FC<ILoginWidgetCardProps> = props => {
  return (
    <LoginWidgetBox callToAction={true}>
      {props.image}
      <Text weight="bold" size="large">
        {props.title}
      </Text>
      <Text margin={{ top: '.25em', bottom: '1em' }}>{props.textContent}</Text>
      <Box direction="row" justify="between">
        <LearnMoreButton onClick={props.onLearnMoreClick} label={props.learnMoreLabel} />
        <ConnectButton primary={true} onClick={props.onLoginClick} label={props.connectLabel} />
      </Box>
    </LoginWidgetBox>
  );
};

export default LoginCTACard;
