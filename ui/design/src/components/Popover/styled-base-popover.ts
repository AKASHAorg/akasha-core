import PopoverBase from '@trendmicro/react-popover';
import styled from 'styled-components';

const StyledBasePopover = styled(PopoverBase)`
  && {
    background: ${props => props.theme.colors.white};
    color: ${props => props.theme.colors.dark};
    font-family: ${props => props.theme.shapes.fontFamily};
    font-size: ${props => props.theme.spacing.fontSize};
    font-weight: ${props => props.theme.shapes.fontWeight.regular};
    line-height: ${props => props.theme.spacing.lineHeight};
    width: ${props => props.theme.spacing.components.popover.width};
  }
`;

export { StyledBasePopover };
