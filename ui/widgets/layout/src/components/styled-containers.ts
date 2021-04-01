import DS from '@akashaproject/design-system';

const { css, styled } = DS;

export const BaseContainer: any = styled.div`
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

export const MainAreaContainer: any = styled(BaseContainer)`
  flex-grow: 1;
  flex-direction: column-reverse !important;
  max-width: 100%;
  margin-bottom: 0.5em;
  ${props => css<any>`
    @media screen and (min-width: ${props.theme.breakpoints.medium.value}px) {
      flex-direction: row !important;
    }
    @media screen and (max-width: ${props.theme.breakpoints.small.value}px) {
      padding: 0 0.25rem;
    }
  `}
`;

const TOPBAR_HEIGHT = 48;

export const WidgetContainer: any = styled(BaseContainer)`
  position: sticky;
  top: calc(${TOPBAR_HEIGHT}px + 0.5em);
`;

export const ScrollableWidgetArea: any = styled.div`
  ${props => css`
    &::-webkit-scrollbar {
      width: 0 !important;
    }
    @media screen and (min-width: ${props.theme.breakpoints.medium.value}px) {
      overflow-y: auto;
      overflow-x: hidden;
      height: calc(100vh - ${TOPBAR_HEIGHT}px - 1em);
    }
  `}
`;

export const SidebarWrapper: any = styled(BaseContainer)<{ visible: boolean }>`
  z-index: 999;
  flex-grow: 1;
  /* height: calc(100vh - ${TOPBAR_HEIGHT}rem); */
  /* top: ${TOPBAR_HEIGHT}rem; */
  position: sticky;
  @media screen and (max-width: ${props => props.theme.breakpoints.small.value}px) {
    ${props => {
      if (props.visible) {
        return css`
          position: fixed;
          /* top: ${TOPBAR_HEIGHT}rem; */
          width: 90vw;
          /* height: calc(100vh - ${TOPBAR_HEIGHT + 0.3}rem); */
        `;
      }
      return css`
        display: none;
      `;
    }}
  }
`;
