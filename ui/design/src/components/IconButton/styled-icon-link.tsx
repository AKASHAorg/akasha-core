import { Anchor, Box } from 'grommet';
import * as React from 'react';
import styled, { css } from 'styled-components';

interface IStyledIconLinkProps {
  iconPosition?: 'start' | 'end';
  size?: string;
}

const StyledIconLink = styled(Anchor)<IStyledIconLinkProps>`
  border-radius: ${props => props.theme.shapes.borderRadius};
  border: none;
  padding: ${props => props.theme.spacing.components.iconButton.padding};
  color: ${props => props.theme.colors.lightGrey};
  font-weight: 400;
  display: flex;
  :hover {
    text-decoration: none;
    color: ${props => props.theme.colors.blue};
    svg {
      stroke: ${props => props.theme.colors.blue};
    }
  }
  /* font-size: ${props => props.theme.spacing.components.iconButton.fontSize.sm}; */
  svg {
    height: 100%;
    stroke: ${props => props.theme.colors.lightGrey};
    ${props => {
      if (props.size) {
        return css`
          width: ${props.theme.spacing.components.iconButton.fontSize[props.size]};
        `;
      }
      return css`
        width: ${props.theme.spacing.components.iconButton.fontSize.small};
      `;
    }}
  }
`;

export default StyledIconLink;
