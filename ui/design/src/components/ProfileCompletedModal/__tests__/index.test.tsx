import React from 'react';
import { act, cleanup } from '@testing-library/react';

import ProfileCompletedModal from '../';

import { customRender, wrapWithTheme } from '../../../test-utils';

describe('<ProfileCompletedModal /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const handleClick = jest.fn();

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <ProfileCompletedModal
            titleLabel="Welcome to the alpha!🙌"
            subtitleLabel="So happy to see you! Thank you for being part of this adventure! 🚀"
            buttonLabel="Let's rock"
            onClick={handleClick}
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

  it('has correct title and subtitle', () => {
    const { getByText } = componentWrapper;
    const modalTitle = getByText(/Welcome to the /);
    const modalSubtitle = getByText(/So happy to see /);

    expect(modalTitle).toBeDefined();
    expect(modalSubtitle).toBeDefined();
  });

  it('has an action button in the modal', () => {
    const { getByRole } = componentWrapper;

    const ctaButton = getByRole('button', { name: "Let's rock" });

    expect(ctaButton).toBeDefined();
  });
});
