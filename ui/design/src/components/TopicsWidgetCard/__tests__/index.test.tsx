import * as React from 'react';
// import { create } from 'react-test-renderer';
import { render } from '@testing-library/react';

import TopicsWidgetCard from '../';
import { wrapWithTheme } from '../../../test-utils';
import { topicsDataSource } from '../../../utils/dummy-data';

describe('TopicsWidgetCard component', () => {
  it('renders correctly', () => {
    render(
      wrapWithTheme(
        <TopicsWidgetCard
          label={'Hot Topics'}
          labelColor={'#132540'}
          iconType={'hotTopics'}
          margin={{ margin: '0px' }}
          dataSource={topicsDataSource}
          onClick={() => null}
          onTopicClick={() => null}
        />,
      ),
    );
  });
});
