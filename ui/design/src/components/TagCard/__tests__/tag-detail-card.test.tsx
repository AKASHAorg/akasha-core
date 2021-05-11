import * as React from 'react';
// import { create } from 'react-test-renderer';
import { render } from '@testing-library/react';

import { TagDetailCard } from '../tag-detail-card';
import { wrapWithTheme } from '../../../test-utils';
import { trendingTagsData } from '../../../utils/dummy-data';

describe('TagDetailCard component', () => {
  it('renders correctly', () => {
    render(
      wrapWithTheme(
        <TagDetailCard
          tag={trendingTagsData[0]}
          handleSubscribe={() => null}
          handleUnsubscribe={() => null}
        />,
      ),
    );
  });
});
