import * as React from 'react';
// import { create } from 'react-test-renderer';
import { render } from '@testing-library/react';

import AppsWidgetCard from '../';
import { wrapWithTheme } from '../../../test-utils';
import { appsDataSource } from '../../../utils/dummy-data';

describe('AppsWidgetCard component', () => {
  it('renders correctly', () => {
    render(
      wrapWithTheme(
        <AppsWidgetCard
          dataSource={appsDataSource}
          margin={{ margin: '0px' }}
          iconType={'trendingApps'}
          label={'Trending Apps'}
          labelColor={'#132540'}
          onClick={() => null}
          onAppClick={() => null}
        />,
      ),
    );
  });
});
