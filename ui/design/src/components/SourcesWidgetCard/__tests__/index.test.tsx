import * as React from 'react';
// import { create } from 'react-test-renderer';
import { render } from '@testing-library/react';

import SourcesWidgetCard from '../';
import { wrapWithTheme } from '../../../test-utils';

describe('SourcesWidgetCard component', () => {
  it('renders correctly', () => {
    render(
      wrapWithTheme(
        <SourcesWidgetCard
          titleLabel={'My feed sources'}
          tagsNumber={15}
          profilesNumber={35}
          appsNumber={50}
        />,
      ),
    );
  });
});
