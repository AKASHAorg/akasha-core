import * as React from 'react';
import { act, cleanup } from '@testing-library/react';

import TopicsWidgetCard from '../';
import { customRender, wrapWithTheme } from '../../../test-utils';
import { topicsDataSource } from '../../../utils/dummy-data';

describe('<TopicsWidgetCard /> Component', () => {
  let componentWrapper = customRender(<></>, {});
  const handleClick = jest.fn();
  const handleTopicClick = jest.fn();

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <TopicsWidgetCard
            dataSource={topicsDataSource}
            label="Hot Topics"
            iconType="hotTopics"
            labelColor="#132540"
            margin={{ margin: '0px' }}
            onClick={handleClick}
            onTopicClick={handleTopicClick}
          />,
        ),
        {},
      );
    });
  });

  afterEach(() => {
    act(() => componentWrapper.unmount());
    cleanup();
  });

  it('renders correctly', () => {
    expect(componentWrapper).toBeDefined();
  });

  it('has correct title', () => {
    const { getByText } = componentWrapper;
    const title = getByText(/hot topics/i);
    expect(title).toBeDefined();
  });

  it('has 3 topics from datasource', () => {
    const { getByText } = componentWrapper;
    const ethereumworld = getByText('#ethereumworld');
    const akashaworld = getByText('#akashaworld');
    const cryptoworld = getByText('#cryptoworld');

    expect(ethereumworld).toBeDefined();
    expect(akashaworld).toBeDefined();
    expect(cryptoworld).toBeDefined();
  });
});
