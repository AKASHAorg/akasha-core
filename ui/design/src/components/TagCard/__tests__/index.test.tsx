import * as React from 'react';
// import { create } from 'react-test-renderer';
import { render } from '@testing-library/react';

import TagCard from '../';
import { wrapWithTheme } from '../../../test-utils';
import { trendingTagsData } from '../../../utils/dummy-data';

describe('TagCard component', () => {
  it('renders correctly', () => {
    render(
      wrapWithTheme(
        <TagCard
          tag={trendingTagsData[0]}
          handleSubscribe={() => null}
          handleUnsubscribe={() => null}
        />,
      ),
    );
  });
});
