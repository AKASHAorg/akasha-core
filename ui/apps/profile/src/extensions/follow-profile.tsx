import React from 'react';
import ReactDOM from 'react-dom';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import singleSpaReact from 'single-spa-react';
import FollowProfile from '../components/follow-profile';
import { withProviders } from '@akashaorg/ui-awf-hooks';
import { RootExtensionProps } from '@akashaorg/typings/ui';

const App = (props: RootExtensionProps) => {
  const { loggedInProfileId, profileStreamId, isLoggedIn, isFollowing, followStreamId } =
    props.extensionData;
  return (
    <FollowProfile
      loggedInProfileId={String(loggedInProfileId)}
      profileStreamId={String(profileStreamId)}
      isLoggedIn={!!isLoggedIn}
      isFollowing={!!isFollowing}
      followStreamId={String(followStreamId)}
      navigateTo={props.plugins['@akashaorg/app-routing']?.routing?.navigateTo}
    />
  );
};

const reactLifecycles = singleSpaReact({
  React,
  ReactDOMClient: ReactDOM,
  rootComponent: withProviders(App),
  errorBoundary: (error, errorInfo, props: RootExtensionProps) => {
    if (props.logger) {
      props.logger.error(`${JSON.stringify(error)}, ${errorInfo}`);
    }
    return (
      <ErrorLoader
        type="script-error"
        title="Error in share profile modal"
        details={error.message}
      />
    );
  },
});

export const bootstrap = reactLifecycles.bootstrap;

export const mount = reactLifecycles.mount;

export const unmount = reactLifecycles.unmount;
