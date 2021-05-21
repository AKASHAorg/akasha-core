import React from 'react';
import { act, cleanup } from '@testing-library/react';

import ShareModal from '../';

import { customRender, wrapWithTheme } from '../../../test-utils';

describe('<ShareModal /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const handleCloseModal = jest.fn();
  const handleProfileShare = jest.fn();

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <ShareModal
            link="ethereum.world/gilbert"
            copyLabel="Copy"
            shareTitleLabel="Share the profile"
            shareSubtitleLabel="Share a profile by copying the link below"
            shareSocialLabel="Or share it on every social platform"
            closeModal={handleCloseModal}
            handleProfileShare={handleProfileShare}
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
    const { getAllByText } = componentWrapper;
    const modalTitle = getAllByText('Share the profile');
    const modalSubtitle = getAllByText(/Share a profile by /);

    expect(modalTitle).toBeDefined();
    expect(modalSubtitle).toBeDefined();
  });

  it('has the profile link in the input', () => {
    const { getAllByRole } = componentWrapper;

    const input = getAllByRole('textbox');

    expect(input[0]).toHaveValue('ethereum.world/gilbert');
  });

  it('has three social apps icon', () => {
    const { getAllByTestId } = componentWrapper;

    const twitterIcon = getAllByTestId('twitter');
    const redditIcon = getAllByTestId('reddit');
    const facebookIcon = getAllByTestId('facebook');

    expect(twitterIcon).toBeDefined();
    expect(redditIcon).toBeDefined();
    expect(facebookIcon).toBeDefined();
  });

  // it('calls handler when button is clicked', () => {
  //   const { getByRole } = componentWrapper;

  //   const copyButton = getByRole('button', { name: 'Copy' });
  //   expect(handleProfileShare).toBeCalledTimes(0);

  //   userEvent.click(copyButton[0]);
  //   expect(handleProfileShare).toBeCalledTimes(1);
  // });
});
