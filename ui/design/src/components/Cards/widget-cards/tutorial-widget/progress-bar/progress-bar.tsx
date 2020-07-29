import * as React from 'react';
import { ProgressNode, NodeState } from './progress-node';
import {
  StyledProgressBar,
  StyledContainer,
  StyledTimeline,
  StyledNodesBox,
} from './styled-progress';
// import { Box } from 'grommet';

export interface IProgressBar {
  // a number from 0 to 6
  currentState: number;
}

const ProgressBar: React.FC<IProgressBar> = props => {
  const { currentState } = props;
  const [progressBarState, setProgressBarState] = React.useState<0 | 1 | 2>(0);
  const [node1State, setNode1State] = React.useState<NodeState>(1);
  const [node2State, setNode2State] = React.useState<NodeState>(0);
  const [node3State, setNode3State] = React.useState<NodeState>(0);
  if (currentState < 2 && progressBarState !== 0) {
    setProgressBarState(0);
  }
  if (currentState > 2 && progressBarState !== 1 && currentState < 5) {
    setProgressBarState(1);
  }
  if (currentState > 4 && progressBarState !== 2) {
    setProgressBarState(2);
  }
  switch (currentState) {
    case 1:
      if (node1State !== 2) {
        setNode1State(2);
      }
      if (node2State !== 0) {
        setNode2State(0);
      }
      if (node3State !== 0) {
        setNode3State(0);
      }
      break;
    case 2:
      if (node1State !== 3) {
        setNode1State(3);
      }
      if (node2State !== 1) {
        setNode2State(1);
      }
      if (node3State !== 0) {
        setNode3State(0);
      }
      break;
    case 3:
      if (node1State !== 3) {
        setNode1State(3);
      }
      if (node2State !== 2) {
        setNode2State(2);
      }
      if (node3State !== 0) {
        setNode3State(0);
      }
      break;
    case 4:
      if (node1State !== 3) {
        setNode1State(3);
      }
      if (node2State !== 3) {
        setNode2State(3);
      }
      if (node3State !== 1) {
        setNode3State(1);
      }
      break;
    case 5:
      if (node1State !== 3) {
        setNode1State(3);
      }
      if (node2State !== 3) {
        setNode2State(3);
      }
      if (node3State !== 2) {
        setNode3State(2);
      }
      break;
    case 6:
      if (node1State !== 3) {
        setNode1State(3);
      }
      if (node2State !== 3) {
        setNode2State(3);
      }
      if (node3State !== 3) {
        setNode3State(3);
      }
      break;

    default:
      break;
  }

  return (
    <StyledContainer>
      <StyledTimeline>
        <StyledProgressBar state={progressBarState} />
      </StyledTimeline>

      <StyledNodesBox direction="row" justify="between" fill="horizontal">
        <ProgressNode state={node1State} />
        <ProgressNode state={node2State} />
        <ProgressNode state={node3State} />
      </StyledNodesBox>
    </StyledContainer>
  );
};

export { ProgressBar };
