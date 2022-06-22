import DS from '@akashaorg/design-system';
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
  /* keep at center, since sidebar is now fixed */
  margin: 0 auto;
  @media screen and (min-width: ${props => props.theme.breakpoints.smallDesktop.value + 24}px) {
    /* reserve some space for the scollbar */
    padding-right: 16px;
  }
  @media screen and (min-width: ${props => props.theme.breakpoints.largeDesktop.value}px) {
    margin: 0;
    flex-grow: 1;
  }
`;

export const PluginContainer = styled(BaseContainer)`
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

const TOPBAR_HEIGHT = 48;
const WIDGET_AREA_MARGIN_TOP = '0.5rem';

export const WidgetContainer: React.FC<Record<string, unknown>> = styled(BaseContainer)``;

export const WidgetAreaContainer: React.FC<Record<string, unknown>> = styled(Box)`
  position: sticky;
  top: ${TOPBAR_HEIGHT}px;
`;

export const SidebarAreaContainer: React.FC<Record<string, unknown>> = styled(Box)`
  position: fixed;
  top: ${TOPBAR_HEIGHT}px;
  margin-top: -${TOPBAR_HEIGHT}px;
  @media screen and (min-width: ${props => props.theme.breakpoints.medium.value + 1}px) {
    margin-top: 0;
  }
  @media screen and (min-width: ${props => props.theme.breakpoints.largeDesktop.value}px) {
    position: sticky;
  }
`;

export const ScrollableWidgetArea: React.FC<Record<string, unknown>> = styled.div`
  flex-grow: 1;
  margin-top: ${WIDGET_AREA_MARGIN_TOP};
  max-height: 100%;
  @media screen and (max-width: ${props => props.theme.breakpoints.medium.value}px) {
    display: none;
  }
  ${props => css`
    &::-webkit-scrollbar {
      width: 0 !important;
    }
    min-width: 22rem;

    @media screen and (max-width: ${props.theme.breakpoints.large.value}px) {
      min-width: 16rem;
    }
    @media screen and (min-width: ${props.theme.breakpoints.medium.value}px) {
      overflow-y: auto;
      overflow-x: hidden;
    }
  `}
`;

export const SidebarWrapper: React.FC<Record<string, unknown>> = styled(BaseContainer)`
  z-index: 100;
  flex-direction: column;
  align-items: flex-start;
  @media screen and (min-width: ${props => props.theme.breakpoints.medium.value}px) {
    position: fixed;
    max-width: 100%;
    left: 0;
    top: 0;
  }
  @media screen and (min-width: ${props => props.theme.breakpoints.xlarge.value}px) {
    top: 3rem;
  }
  @media screen and (min-width: ${props => props.theme.breakpoints.largeDesktop.value}px) {
    align-items: flex-end;
    margin-right: 1rem;
    position: sticky;
    flex-grow: 1;
  }
`;
