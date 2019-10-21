import { Button } from 'grommet';
import * as React from 'react';
import styled, { css } from 'styled-components';

interface IIconButtonProps {
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
  primary?: boolean;
}

const StyledIconButton = styled(Button)<IIconButtonProps>`
  border-radius: ${props => props.theme.shapes.borderRadius};
  border: none;
  padding: ${props => props.theme.spacing.components.iconButton.padding};
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
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.grey};
  ${props => {
    if (props.primary) {
      return css`
        background-color: ${props.theme.colors.blue};
        color: ${props.theme.colors.white};
        svg {
          stroke: ${props.theme.colors.white};
        }
        :hover {
          background-color: ${props.theme.colors.white};
          color: ${props.theme.colors.blue};
          border: 1px solid ${props.theme.colors.blue};
          svg {
            stroke: ${props.theme.colors.blue};
          }
        }
      `;
    }
  }}
`;

export default StyledIconButton;
