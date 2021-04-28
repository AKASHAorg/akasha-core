import * as React from 'react';
// import { create } from 'react-test-renderer';
import { render } from '@testing-library/react';

import { TagSearchCard } from '../tag-search-card';
import { wrapWithTheme } from '../../../test-utils';
import { trendingTagsData } from '../../../utils/dummy-data';

describe('TagSearchCard component', () => {
  it('renders correctly', () => {
    render(
      wrapWithTheme(
        <TagSearchCard
          tag={trendingTagsData[0]}
          subscribedTags={['Ethereum']}
          tagAnchorLink={'/social-app/tags'}
          mentionsLabel={'posts'}
          subscribeLabel={'subscribe'}
          subscribedLabel={'subscribed'}
          unsubscribeLabel={'unsubscribe'}
          handleSubscribeTag={() => null}
          handleUnsubscribeTag={() => null}
        />,
      ),
    );
  });
});
