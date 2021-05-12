import * as React from 'react';
import { waitFor, render } from '@testing-library/react';
import Spinner from '../';
import { wrapWithTheme } from '../../../test-utils';

describe('Spinner component', () => {
  it('renders correctly', async () => {
    const spinner = render(wrapWithTheme(<Spinner />));
    await waitFor(() => expect(spinner).toBeDefined());
  });
});
