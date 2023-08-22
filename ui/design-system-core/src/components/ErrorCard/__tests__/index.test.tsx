import * as React from 'react';
import { act, fireEvent } from '@testing-library/react';
import ErrorCard from '../';
import { customRender } from '../../../test-utils';

describe('<ErrorCard /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const titleLabel = 'This page is for our marvelous AKASHA World moderators';
  const subtitleLabel =
    'To view this page, you must be an AKASHA World Moderator and log in with your wallet to continue.';
  const buttonLabel = 'Connect a wallet';

  const buttonHandler = jest.fn(() => {
    /** */
  });

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        <ErrorCard
          boxSize="18.75rem"
          errorType="no-authentication"
          titleLabel={titleLabel}
          subtitleLabel={subtitleLabel}
          buttonLabel={buttonLabel}
          hasButton={true}
          onClick={buttonHandler}
        />,
        {},
      );
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    expect(componentWrapper).toBeDefined();
  });

  it('has image with correct src', () => {
    const { getByRole } = componentWrapper;

    const image = getByRole('img');

    expect(image).toHaveAttribute('src', expect.stringMatching(/no-authentication.webp/));
  });

  it('has correct title and subtitle', () => {
    const { getByText } = componentWrapper;

    const title = getByText(titleLabel);
    const subtitle = getByText(subtitleLabel);

    expect(title).toBeDefined();
    expect(subtitle).toBeDefined();
  });

  it('calls button handler', () => {
    const { getByText } = componentWrapper;

    const button = getByText(buttonLabel);

    expect(button).toBeDefined();
    expect(buttonHandler).toBeCalledTimes(0);

    fireEvent.click(button);

    expect(buttonHandler).toBeCalledTimes(1);
  });
});
