import * as React from 'react';
import singleSpaReact from 'single-spa-react';
import ReactDOM from 'react-dom';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';

const SignInButtons = (props: RootComponentProps) => {
  return (
    <nav>
      <button onClick={() => props.navigateToModal({ name: 'signin' })}>Sign In</button>
      <button onClick={() => props.navigateToModal({ name: 'signup' })}>Sign Up</button>
    </nav>
  );
};

const reactLifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: SignInButtons,
  errorBoundary: (err, errorInfo, props) => {
    if (props.logger) {
      props.logger('Error: %s; Info: %s', err, errorInfo);
    }
    return <div>!</div>;
  },
});

export const bootstrap = reactLifecycles.bootstrap;

export const mount = reactLifecycles.mount;

export const unmount = reactLifecycles.unmount;
