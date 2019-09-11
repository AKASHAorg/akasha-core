import { i18n as I18nType } from 'i18next';
import * as React from 'react';
import TestRenderer from 'react-test-renderer';
import App from '../src/components/App';

test('App renders coreclty', () => {
  const renderer = TestRenderer.create(
    <App
      activeWhen={{ path: '/' }}
      rootNodeId="root-node"
      sdkModules={{}}
      mountParcel={() => {}}
      logger={() => {}}
    />,
  );
  console.log(renderer.toJSON());
});
