import DS from '@akashaorg/design-system';
import { ExtensionPointProps } from '@akashaorg/design-system/lib/utils/extension-point';

const { css, styled, ExtensionPoint } = DS;

const BaseStyledSlot = styled(ExtensionPoint)`
  border: 0;
  box-sizing: border-box;
  margin: 0px;
  padding: 0px;
`;

export const SidebarSlot: React.FC<ExtensionPointProps & { visible: boolean }> = styled(
  BaseStyledSlot,
)<{
  visible: boolean;
}>`
  display: ${props => (props.visible ? 'initial' : 'none')};
  flex-grow: 1;
  ${props => css`
    @media screen and (max-width: ${props.theme.breakpoints.small.value}px) {
      ${!props.visible && 'display: none'}
    }
  `}
`;

export const TopbarSlot: React.FC<ExtensionPointProps> = styled(ExtensionPoint)`
  z-index: 1001;
  position: sticky;
  top: 0;
  @media screen and (max-width: ${props => props.theme.breakpoints.medium.value}px) {
    z-index: 100;
  }
`;

export const PluginSlot: React.FC<ExtensionPointProps> = styled(BaseStyledSlot)`
  margin-top: 0.5em;
  width: 100%;
  ${props => css`
    @media screen and (min-width: ${props.theme.breakpoints.medium.value + 1}px) {
      width: 32rem;
    }
    @media screen and (min-width: ${props.theme.breakpoints.large.value}px) {
      width: 42rem;
    }
  `}
`;

export const FocusedPluginSlot: React.FC<ExtensionPointProps> = styled(PluginSlot)`
  align-self: center;
`;

export const WidgetSlot: React.FC<ExtensionPointProps> = styled(BaseStyledSlot)`
  display: none;
  ${props => css`
    @media screen and (min-width: ${props.theme.breakpoints.small.value}px) {
      max-width: 30em;
      display: flex;
      flex-direction: column;
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

export const CookieWidgetSlot: React.FC<ExtensionPointProps> = styled(BaseStyledSlot)`
  position: fixed;
  bottom: 0;
  margin-left: -12rem;
  max-width: 34rem;
  @media screen and (max-width: ${props => props.theme.breakpoints.medium.value}px) {
    margin-left: 0;
    left: 0;
    right: 0;
    max-width: 100%;
  }
`;

export const ModalSlot: React.FC<ExtensionPointProps> = styled(ExtensionPoint)`
  z-index: 300;
`;
