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
`;
export interface ILoginWidgetCardProps {
  onLoginClick: () => void;
  onLearnMoreClick: () => void;
  title: string;
  textContent: string;
  image?: React.ReactElement;
  learnMoreLabel: string;
  connectLabel: string;
  inlineActions?: boolean;
}
const LoginCTACard: React.FC<ILoginWidgetCardProps> = props => {
  const { inlineActions = false } = props;
  return (
    <LoginWidgetBox callToAction={true}>
      {props.image && props.image}
      <Box direction={inlineActions ? 'row' : 'column'}>
        <Box direction="column">
          <Text weight="bold" size="medium">
            {props.title}
          </Text>
          <Text size="small" margin={{ top: '.25em', bottom: '1em' }}>
            {props.textContent}
          </Text>
        </Box>
        <Box direction="row" justify="between" align="center" flex={{ shrink: 0 }}>
          <LearnMoreButton onClick={props.onLearnMoreClick} label={props.learnMoreLabel} />
          <ConnectButton primary={true} onClick={props.onLoginClick} label={props.connectLabel} />
        </Box>
      </Box>
    </LoginWidgetBox>
  );
};

export default LoginCTACard;
