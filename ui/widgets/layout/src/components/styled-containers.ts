import DS from '@akashaproject/design-system';
import React from 'react';

const { css, styled, Box } = DS;

export const BaseContainer: React.FC<Record<string, unknown>> = styled.div`
  border: 0;
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
  max-width: 100%;
  margin-bottom: 0.5em;
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
const WIDGET_AREA_MARGIN_TOP = '0.5rem';

export const WidgetContainer: React.FC<Record<string, unknown>> = styled(BaseContainer)`
  position: sticky;
  top: ${TOPBAR_HEIGHT}px;
  max-height: calc((100vh - ${TOPBAR_HEIGHT}px) - ${WIDGET_AREA_MARGIN_TOP});
`;
export const WidgetAreaContainer: React.FC<Record<string, unknown>> = styled(Box)``;
export const ScrollableWidgetArea: React.FC<Record<string, unknown>> = styled.div`
  flex-grow: 1;
  margin-top: ${WIDGET_AREA_MARGIN_TOP};
  max-height: 100%;
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
  z-index: 10;
  flex-grow: 1;
  top: ${TOPBAR_HEIGHT}px;
  position: sticky;
  flex-direction: column;
  align-items: flex-end;
`;
