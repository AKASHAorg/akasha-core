import * as React from 'react';
import { create } from 'react-test-renderer';
import { wrapWithTheme } from '../../test-utils';
import Spinner from './';

describe('Spinner component', () => {
  test('Matches the snapshot', () => {
    const spinner = create(wrapWithTheme(<Spinner />));
    expect(spinner.toJSON()).toMatchSnapshot('spinner-snapshot');
  });
});
