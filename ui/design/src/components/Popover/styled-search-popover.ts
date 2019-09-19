import PopoverBase from '@trendmicro/react-popover';
import styled from 'styled-components';

const StyledSearchPopover = styled(PopoverBase)`
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

const StyledSearchPopoverHeader = styled(PopoverBase.Header)`
  && {
    padding: ${props => props.theme.spacing.components.popover.searchPopover.padding};
  }
`;

const StyledSearchPopoverBody = styled(PopoverBase.Body)`
  && {
    padding: 0;
  }
`;

const StyledListContainer = styled.div`
  max-height: ${props => props.theme.spacing.components.popover.searchPopover.maxHeight};
  margin: 0 ${props => props.theme.spacing.components.popover.searchPopover.padding};
  overflow-y: scroll;
`;

const StyledAddIconContainer = styled.div`
  margin-right: ${props => props.theme.spacing.components.popover.searchPopover.iconGap};
`;

const StyledSearchPopoverFooter = styled(PopoverBase.Footer)`
  && {
    background: ${props => props.theme.colors.white};
    padding: ${props => props.theme.spacing.components.popover.searchPopover.padding};
  }
`;

export {
  StyledSearchPopover,
  StyledSearchPopoverHeader,
  StyledSearchPopoverBody,
  StyledListContainer,
  StyledAddIconContainer,
  StyledSearchPopoverFooter,
};
