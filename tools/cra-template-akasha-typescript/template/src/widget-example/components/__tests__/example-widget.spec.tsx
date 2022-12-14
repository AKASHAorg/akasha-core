import React from 'react';
import { ExampleWidget } from '../example/example-widget';
import { createRoot } from 'react-dom/client';
import { genAppProps } from '@akashaorg/af-testing';
it('renders without crashing', () => {
  const container = document.createElement('app');
  const root = createRoot(container);
  root.render(<ExampleWidget {...genAppProps()} />);
});
