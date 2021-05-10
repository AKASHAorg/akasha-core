import * as React from 'react';
// import { create } from 'react-test-renderer';
import { render } from '@testing-library/react';

import { TagProfileCard } from '../tag-profile-card';
import { wrapWithTheme } from '../../../test-utils';
import { trendingTagsData } from '../../../utils/dummy-data';

describe('TagProfileCard component', () => {
  it('renders correctly', () => {
    render(
      wrapWithTheme(
        <TagProfileCard
          tag={trendingTagsData[0]}
          subscribedTags={['Ethereum']}
          handleSubscribeTag={() => null}
          handleUnsubscribeTag={() => null}
        />,
      ),
    );
  });
});
