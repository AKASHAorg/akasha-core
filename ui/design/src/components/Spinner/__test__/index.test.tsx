import * as React from 'react';
import { create } from 'react-test-renderer';
import Spinner from '../';
import { wrapWithTheme } from '../../../test-utils';

describe('Spinner component', () => {
  it('should match the snapshot', () => {
    const spinner = create(wrapWithTheme(<Spinner />));
    expect(spinner.toJSON()).toMatchSnapshot('spinner-snapshot');
  });
});
