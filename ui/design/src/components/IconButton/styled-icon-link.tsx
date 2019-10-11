import { Anchor, Box } from 'grommet';
import * as React from 'react';
import styled from 'styled-components';

interface IStyledIconLinkProps {
  iconPosition?: 'start' | 'end';
}

const StyledIconLink = styled(Anchor)<IStyledIconLinkProps>`
  border-radius: ${props => props.theme.shapes.borderRadius};
  border: none;
  padding: ${props => props.theme.spacing.components.iconButton.padding};
  color: ${props => props.theme.colors.lightGrey};
  font-weight: 400;
  :hover {
    text-decoration: none;
    color: ${props => props.theme.colors.blue};
    svg {
      stroke: ${props => props.theme.colors.blue};
    }
  }
  /* font-size: ${props => props.theme.spacing.components.iconButton.fontSize.sm}; */
  svg {
    height: 1em;
    stroke: ${props => props.theme.colors.lightGrey};
  }
`;

export default StyledIconLink;
