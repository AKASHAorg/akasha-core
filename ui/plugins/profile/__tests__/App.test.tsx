import 'jest-styled-components';
import * as React from 'react';
import TestRenderer from 'react-test-renderer';
import App from '../src/components/App';

test('App renders coreclty', () => {
  /* tslint:disable */
  const renderer = TestRenderer.create(
    <App
      activeWhen={{ path: '/' }}
      rootNodeId="root-node"
      sdkModules={{}}
      mountParcel={() => {}}
      logger={() => {}}
    />,
  );
  expect(renderer.root).toBeDefined();
});
