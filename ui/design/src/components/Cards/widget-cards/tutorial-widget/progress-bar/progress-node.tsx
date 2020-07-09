import * as React from 'react';
import styled, { css } from 'styled-components';
import { Icon } from '../../../../Icon';

export interface IProgressNode {
  state: NodeState;
}

export type NodeState = 0 | 1 | 2 | 3;

const StyledNode = styled.div<{ state: NodeState }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1rem;
  height: 1rem;
  border-radius: 100%;
  ${props => {
    if (props.state > 0) {
      return css`
        border: 1px solid ${props.theme.colors.accent};
      `;
    }
    return css`
      border: 1px solid ${props.theme.colors.border};
    `;
  }};
  ${props => {
    if (props.state > 1) {
      return css`
        background-color: ${props.theme.colors.accent};
      `;
    }
    return css`
      background-color: ${props.theme.colors.white};
    `;
  }};
  ${props => {
    if (props.state === 2) {
      return css`
        & * {
          stroke: ${props.theme.colors.accent};
        }
      `;
    }
    return css`
      & * {
        stroke: ${props.theme.colors.white};
      }
    `;
  }};
`;

const ProgressNode: React.FC<IProgressNode> = props => {
  const { state } = props;
  return (
    <StyledNode state={state}>
      <Icon type="checkSimple" />
    </StyledNode>
  );
};

export { ProgressNode };
