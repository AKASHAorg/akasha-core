import PopoverBase from '@trendmicro/react-popover';
import styled from 'styled-components';

const StyledListPopover = styled(PopoverBase)`
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

const StyledListPopoverBody = styled(PopoverBase.Body)`
  && {
    padding: ${props => props.theme.spacing.components.popover.searchPopover.padding};
  }
`;

export { StyledListPopover, StyledListPopoverBody };
