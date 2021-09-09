import DS from '@akashaproject/design-system';
import React from 'react';

const { css, styled, Box } = DS;

export const BaseContainer: React.FC<Record<string, unknown>> = styled.div`
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

export const MainAreaContainer: React.FC<Record<string, unknown>> = styled(BaseContainer)`
  /* flex-direction: column-reverse !important; */
  max-width: 100%;
  margin-bottom: 0.5em;
  height: 100%;
  border: 0;
  justify-content: flex-start;
  flex-grow: 1;
  flex-direction: column;
  ${props => css`
    @media screen and (max-width: ${props.theme.breakpoints.small.value}px) {
      padding: 0 0.25rem;
    }
  `}
`;

const TOPBAR_HEIGHT = 48;

export const WidgetContainer: React.FC<Record<string, unknown>> = styled(BaseContainer)`
  position: sticky;
  top: ${TOPBAR_HEIGHT}px;
  flex-grow: 1;
  max-height: calc(100vh - ${TOPBAR_HEIGHT}px);
`;

export const WidgetAreaContainer: React.FC<Record<string, unknown>> = styled(Box)``;

export const ScrollableWidgetArea: React.FC<Record<string, unknown>> = styled.div`
  flex-grow: 1;
  margin-top: 0.5rem;
  height: calc(100vh - ${TOPBAR_HEIGHT}px - 0.5em);
  ${props => css`
    &::-webkit-scrollbar {
      width: 0 !important;
    }
    min-width: 22rem;
    @media screen and (min-width: ${props.theme.breakpoints.medium.value}px) {
      overflow-y: auto;
      overflow-x: hidden;
    }
  `}
`;

export const SidebarWrapper: React.FC<Record<string, unknown>> = styled(BaseContainer)`
  z-index: 999;
  flex-grow: 1;
  max-height: calc(100vh - ${TOPBAR_HEIGHT}px);
  top: ${TOPBAR_HEIGHT}px;
  position: sticky;
  flex-direction: column;
  align-items: flex-end;
  @media screen and (max-width: ${props => props.theme.breakpoints.small.value}px) {
    ${props => {
      if (props.visible) {
        return css`
          position: fixed;
          /* top: ${TOPBAR_HEIGHT}rem; */
          /* width: 90vw; */
          /* height: calc(100vh - ${TOPBAR_HEIGHT + 0.3}rem); */
        `;
      }
      return css`
        display: none;
      `;
    }}
  }
`;
