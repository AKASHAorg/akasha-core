import DS from '@akashaproject/design-system';
import { ExtensionPointProps } from '@akashaproject/design-system/lib/utils/extension-point';

const { css, styled, ExtensionPoint } = DS;

const BaseStyledSlot = styled(ExtensionPoint)`
  border: 0;
  box-sizing: border-box;
  margin: 0px;
  padding: 0px;
`;

// eslint-disable-next-line prettier/prettier
export const SidebarSlot: React.FC<ExtensionPointProps> = styled(BaseStyledSlot)<{
  visible: boolean;
}>`
  flex-grow: 1;
  position: sticky;
  top: 0;
  ${props => css`
    @media screen and (max-width: ${props.theme.breakpoints.small.value}px) {
      ${props.visible && 'height: calc(100vh - 3rem)'}
      ${!props.visible && 'display: none'}
    }
  `}
`;

export const TopbarSlot: React.FC<ExtensionPointProps> = styled(ExtensionPoint)`
  z-index: 100;
  position: sticky;
  top: 0;
`;

export const FocusedPluginSlot: React.FC<ExtensionPointProps> = styled(ExtensionPoint)``;

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

export const WidgetSlot: React.FC<ExtensionPointProps> = styled(BaseStyledSlot)`
  display: none;
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

export const ModalSlot: React.FC<ExtensionPointProps> = styled(ExtensionPoint)`
  z-index: 300;
`;
