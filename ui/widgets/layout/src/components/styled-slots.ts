import DS from '@akashaproject/design-system';
import { BaseContainer } from './styled-containers';

const { css, styled } = DS;

export const SidebarSlot: any = styled(BaseContainer)<{
  visible: boolean;
}>`
  flex-grow: 1;
  ${props => css`
    @media screen and (max-width: ${props.theme.breakpoints.small.value}px) {
      ${props.visible && 'height: calc(100vh - 3rem)'}
      ${!props.visible && 'display: none'}
    }
  `}
`;

export const TopbarSlot: any = styled.div`
  z-index: 100;
  position: sticky;
  top: 0;
  width: 100%;
`;

export const PluginSlot: any = styled(BaseContainer)`
  flex-grow: 1;
  flex-shrink: 1;
  margin-top: 0.5em;
  ${props => css`
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

export const WidgetSlot: any = styled(BaseContainer)`
  display: none;
  margin-top: 1em;
  ${props => css`
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

export const ModalSlot: any = styled.div`
  z-index: 300;
`;
