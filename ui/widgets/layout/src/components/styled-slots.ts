import DS from '@akashaproject/design-system';
import { css, StyledComponent } from 'styled-components';
import { BaseContainer } from './styled-containers';

const { styled } = DS;

export const SidebarSlot: StyledComponent<any, any, any, any> = styled(BaseContainer)`
  flex-grow: 1;
`;

export const TopbarSlot: StyledComponent<any, any, any, never> = styled.div`
  z-index: 100;
  position: sticky;
  top: 0;
  width: 100%;
`;

export const PluginSlot: StyledComponent<any, any, any, never> = styled(BaseContainer)`
  flex-grow: 1;
  flex-shrink: 1;
  margin-top: 0.5em;
  ${props => css<any>`
    @media screen and (min-width: ${props.theme.breakpoints.small.value}px) {
      max-width: 30em;
    }
    @media screen and (min-width: ${props.theme.breakpoints.medium.value}px) {
      max-width: 32em;
    }
    @media screen and (min-width: ${props.theme.breakpoints.large.value}px) {
      max-width: 42em;
    }
  `}
`;

export const WidgetSlot: StyledComponent<any, any, any, never> = styled(BaseContainer)`
  display: none;
  ${props => css<any>`
    @media screen and (min-width: ${props.theme.breakpoints.small.value}px) {
      max-width: 30em;
      display: flex;
    }

    @media screen and (min-width: ${props.theme.breakpoints.medium.value}px) {
      max-width: 18em;
      margin-left: 1em;
    }

    @media screen and (min-width: ${props.theme.breakpoints.large.value}px) {
      max-width: 21em;
    }
  `}
  > div {
    flex-shrink: 0;
    width: 100%;
  }
`;
export const ModalSlot: StyledComponent<any, any, any, never> = styled.div`
  z-index: 300;
`;
