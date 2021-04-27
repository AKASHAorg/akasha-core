import * as React from 'react';
import { create } from 'react-test-renderer';
import Spinner from '../';
import { wrapWithTheme } from '../../../test-utils';

describe('Spinner component', () => {
  it('renders correctly', () => {
    create(wrapWithTheme(<Spinner />));
  });
});
