import * as React from 'react';
import singleSpaReact from 'single-spa-react';
import ReactDOM from 'react-dom';
import DS from '@akashaproject/design-system';
import { RootExtensionProps } from '@akashaproject/ui-awf-typings';
import { rootRoute } from '../routes';
import { withProviders, ThemeWrapper } from '@akashaproject/ui-awf-hooks';
import { BrowserRouter as Router, useRouteMatch } from 'react-router-dom';

const { Icon, styled, css } = DS;

const BookmarkIcon = styled(Icon)`
  border-radius: 50%;
  ${props => {
    if (props.accentColor) {
      return css`
        background-color: ${props.theme.colors.accentOpacity};
      `;
    }
    return css`
      background-color: ${props.theme.colors.background};
    `;
  }}

  width: 1.25rem;
  height: 1.25rem;
  @media screen and (max-width: ${props => props.theme.breakpoints.small.value}px) {
    width: 1.5rem;
    height: 1.5rem;
  }
`;

const BookmarksTopbarButton = (props: RootExtensionProps) => {
  const match = useRouteMatch(rootRoute);

  return (
    <BookmarkIcon
      type="bookmark"
      clickable={true}
      onClick={() => props.singleSpa.navigateToUrl(rootRoute)}
      accentColor={!!match}
    />
  );
};

const ButtonWrapper = (props: RootExtensionProps) => (
  <Router>
    <BookmarksTopbarButton {...props} />
  </Router>
);

const reactLifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: withProviders(ButtonWrapper),
  errorBoundary: (_err, errorInfo, props: RootExtensionProps) => {
    if (props.logger) {
      props.logger.error(`${JSON.stringify(errorInfo)}, ${errorInfo}`);
    }

    return (
      <ThemeWrapper {...props}>
        <Icon type="error" size="sm" />
      </ThemeWrapper>
    );
  },
});

export const bootstrap = reactLifecycles.bootstrap;

export const mount = reactLifecycles.mount;

export const unmount = reactLifecycles.unmount;
