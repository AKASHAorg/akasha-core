import * as React from 'react';
import { act, cleanup } from '@testing-library/react';

import SourcesWidgetCard from '..';
import { customRender, wrapWithTheme } from '../../../test-utils';

describe('<SourcesWidgetCard /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <SourcesWidgetCard
            titleLabel={'My feed sources'}
            tagsNumber={15}
            profilesNumber={35}
            appsNumber={50}
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
    const title = getByText('My feed sources');

    expect(title).toBeDefined();
  });

  it('has correct number of tags, profiles and apps', () => {
    const { getByText } = componentWrapper;
    const tagsNumber = getByText('15');
    const profilesNumber = getByText('35');
    const appsNumber = getByText('50');

    expect(tagsNumber).toBeDefined();
    expect(profilesNumber).toBeDefined();
    expect(appsNumber).toBeDefined();
  });
});
