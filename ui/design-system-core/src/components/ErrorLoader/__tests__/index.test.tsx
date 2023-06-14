import * as React from 'react';
import { act } from '@testing-library/react';
import ErrorLoader from '..';
import { customRender } from '../../../test-utils';

describe('<ErrorLoader /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const titleLabel = 'No Ethereum address detected';
  const details =
    'You need to login or allow access to your current Ethereum address in your Web3 Ethereum client like MetaMask, and then reload, please.';

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        <ErrorLoader type="script-error" title={titleLabel} details={details} />,
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

    expect(image).toHaveAttribute('src', expect.stringMatching(/general-error.webp/));
  });

  it('has correct title and subtitle', () => {
    const { getByText } = componentWrapper;

    const title = getByText(titleLabel);
    const detailsLabel = getByText(details);

    expect(title).toBeDefined();
    expect(detailsLabel).toBeDefined();
  });
});
