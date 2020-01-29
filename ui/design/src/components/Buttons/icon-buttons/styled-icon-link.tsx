import { Anchor } from 'grommet';
import styled from 'styled-components';
import { ILinkIconButtonProps } from './icon-link';

const StyledIconLink = styled(Anchor)<ILinkIconButtonProps>`
  border-radius: ${props => props.theme.shapes.largeBorderRadius};
  border: none;
  padding: 0 0.8em;
  color: ${props => props.theme.colors.secondaryText};
  font-weight: 400;
  &:hover {
    text-decoration: none;
    color: ${props => props.theme.colors.accent};
    svg {
      & * {
        stroke: ${props => props.theme.colors.accent};
      }
    }
  }
  svg {
    height: 100%;
    width: 20px;
    stroke: ${props => props.theme.colors.lightGrey};
    & * {
      stroke: ${props => props.theme.colors.secondaryText};
    }
  }
`;

export default StyledIconLink;
