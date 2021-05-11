import * as React from 'react';
// import { create } from 'react-test-renderer';
import { render } from '@testing-library/react';

import MdCard from '../';
import { wrapWithTheme } from '../../../test-utils';

describe('MdCard component', () => {
  it('renders correctly', () => {
    render(wrapWithTheme(<MdCard mdText={`**Hello**`} />));
  });
});
