import PopoverBase from '@trendmicro/react-popover';
import styled from 'styled-components';

const StyledActionPopover = styled(PopoverBase)`
  && {
    background: ${props => props.theme.colors.white};
    color: ${props => props.theme.colors.dark};
    font-family: ${props => props.theme.shapes.fontFamily};
    font-size: ${props => props.theme.spacing.fontSize};
    font-weight: ${props => props.theme.shapes.fontWeight.regular};
    line-height: ${props => props.theme.spacing.lineHeight};
    width: ${props => props.theme.spacing.components.popover.width};
    word-wrap: break-word;
  }
`;

const StyledActionPopoverBody = styled(PopoverBase.Body)`
  && {
    padding: ${props => props.theme.spacing.components.popover.actionPopover.padding};
    word-wrap: break-word;
  }
`;

const StyledActionPopoverFooter = styled(PopoverBase.Footer)`
  && {
    background: ${props => props.theme.colors.white};
    padding: ${props => props.theme.spacing.components.popover.actionPopover.padding};
    padding-top: 0;
    text-align: right;
  }

  & > button:first-of-type {
    margin-right: ${props => props.theme.spacing.components.popover.actionPopover.buttonGap};
  }
`;

export { StyledActionPopover, StyledActionPopoverBody, StyledActionPopoverFooter };
