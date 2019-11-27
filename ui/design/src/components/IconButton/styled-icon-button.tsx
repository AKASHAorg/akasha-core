import { Button } from 'grommet';
import * as React from 'react';
import styled, { css } from 'styled-components';

interface IIconButtonProps {
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
  primary?: boolean;
  share?: boolean;
}

const StyledIconButton = styled(Button)<IIconButtonProps>`
  height: 22px;
  border-radius: ${props => props.theme.shapes.largeBorderRadius};
  border: none;
  padding: 0 0.8em;
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
    if (props.share) {
      return css`
        border-radius: ${props.theme.shapes.smallBorderRadius};
        background-color: ${props.theme.colors.secondaryOpacity};
        color: ${props.theme.colors.white};
        &:hover {
          border: 1px solid ${props.theme.colors.secondaryOpacity};
          background-color: ${props.theme.colors.secondaryOpacity};
        }
      `;
    }
    return;
  }}
`;

export default StyledIconButton;
