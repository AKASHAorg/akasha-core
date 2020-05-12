import * as React from 'react';
import DS from '@akashaproject/design-system';

const { Box, Button, WidgetAreaCardBox, Text, styled } = DS;

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
        <LearnMoreButton onClick={props.onLearnMoreClick} label="Learn More" />
        <ConnectButton primary={true} onClick={props.onLoginClick} label="Connect Address" />
      </Box>
    </LoginWidgetBox>
  );
};

export default LoginCTACard;
