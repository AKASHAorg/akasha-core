import React from 'react';
import { act, cleanup, fireEvent } from '@testing-library/react';

import ProfileSubCard from '../';

import { customRender, wrapWithTheme } from '../../../test-utils';
import { ICWorldAppsData } from '../../../utils/dummy-data';

describe('<ProfileSubCard /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const handleCTAClick = jest.fn();
  const handleAppClick = jest.fn();

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <ProfileSubCard
            titleLabel="Published Apps"
            ctaLabel="See All"
            apps={ICWorldAppsData}
            onCTAClick={handleCTAClick}
            onAppClick={handleAppClick}
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
    const title = getByText(/Published Apps/);

    expect(title).toBeDefined();
  });

  it('calls handler when CTA is clicked', () => {
    const { getByText } = componentWrapper;
    const cta = getByText(/See All/);

    expect(handleCTAClick).toBeCalledTimes(0);

    fireEvent.click(cta);

    expect(handleCTAClick).toBeCalledTimes(1);
  });

  it('calls handler when an app is clicked', () => {
    const { getByText } = componentWrapper;
    const app = getByText(ICWorldAppsData[0].name);

    expect(handleAppClick).toBeCalledTimes(0);

    fireEvent.click(app);

    expect(handleAppClick).toBeCalledTimes(1);
  });
});
