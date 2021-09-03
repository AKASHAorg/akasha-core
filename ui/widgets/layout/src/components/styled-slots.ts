import DS from '@akashaproject/design-system';
import { ExtensionPointProps } from '@akashaproject/design-system/lib/utils/extension-point';

const { css, styled, ExtensionPoint } = DS;

const BaseStyledSlot = styled(ExtensionPoint)`
  border: 0;
  box-sizing: border-box;
  display: flex;
  flex-basis: auto;
  flex-direction: column;
  flex-shrink: 0;
  margin: 0px;
  min-height: 0px;
  min-width: 0px;
  padding: 0px;
  position: relative;
  z-index: 0;
`;

// eslint-disable-next-line prettier/prettier
export const SidebarSlot: React.FC<ExtensionPointProps> = styled(BaseStyledSlot)<{
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

export const TopbarSlot: React.FC<ExtensionPointProps> = styled(ExtensionPoint)`
  z-index: 100;
  position: sticky;
  top: 0;
  width: 100%;
`;

export const PluginSlot: React.FC<ExtensionPointProps> = styled(BaseStyledSlot)`
  margin-top: 0.5em;
  ${props => css`
    @media screen and (min-width: ${props.theme.breakpoints.small.value}px) {
      width: 30rem;
    }
    @media screen and (min-width: ${props.theme.breakpoints.medium.value}px) {
      width: 32rem;
    }
    @media screen and (min-width: ${props.theme.breakpoints.large.value}px) {
      width: 42rem;
    }
  `}
`;

export const WidgetSlot: React.FC<ExtensionPointProps> = styled(BaseStyledSlot)`
  display: none;
  margin-bottom: 0.5em;
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
