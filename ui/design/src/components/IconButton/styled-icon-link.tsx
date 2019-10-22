import { Anchor } from 'grommet';
import styled from 'styled-components';

interface IStyledIconLinkProps {
  iconPosition?: 'start' | 'end';
}

const StyledIconLink = styled(Anchor)<IStyledIconLinkProps>`
  border-radius: ${props => props.theme.shapes.largeBorderRadius};
  border: none;
  padding: ${props => props.theme.spacing.components.iconButton.padding};
  color: ${props => props.theme.colors.grey};
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
    & * {
      stroke: ${props => props.theme.colors.grey};
    }
  }
`;

export default StyledIconLink;
