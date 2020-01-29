import { Button } from 'grommet';
import * as React from 'react';
import styled, { css } from 'styled-components';

export interface IIconButtonProps {
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
  primary?: boolean;
  secondary?: boolean;
}

const StyledIconButton = styled(Button)<IIconButtonProps>`
  height: 22px;
  border-radius: ${props => props.theme.shapes.largeBorderRadius};
  border: none;
  padding: 0 0.8em;
  border: 1px solid ${props => props.theme.colors.grey};
  &:hover {
    box-shadow: none;
    border: 1px solid ${props => props.theme.colors.grey};
    background-color: ${props => props.theme.colors.white};
  }
  svg {
    stroke: ${props => props.theme.colors.grey};
  }
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${props => props.theme.colors.lightBackground};
  color: ${props => props.theme.colors.grey};
  ${props => {
    if (props.primary) {
      return css`
        background-color: ${props.theme.colors.accent};
        color: ${props.theme.colors.white};
        border: 1px solid ${props.theme.colors.accent};
        svg {
          stroke: ${props.theme.colors.white};
        }
        :hover {
          background-color: ${props.theme.colors.white};
          color: ${props.theme.colors.accent};
          border: 1px solid ${props.theme.colors.accent};
          svg {
            stroke: ${props.theme.colors.accent};
          }
        }
      `;
    }
    if (props.secondary) {
      return css`
        border-radius: ${props.theme.shapes.smallBorderRadius};
        background-color: ${props.theme.colors.secondaryOpacity};
        color: ${props.theme.colors.white};
        border: none;
        &:hover {
          border: none;
          background-color: ${props.theme.colors.secondaryOpacity};
        }
      `;
    }
    return;
  }}
`;

export default StyledIconButton;
