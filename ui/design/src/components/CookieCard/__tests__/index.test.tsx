import * as React from 'react';
import { act, cleanup, fireEvent } from '@testing-library/react';

import CookieWidgetCard from '../';
import { customRender, wrapWithTheme } from '../../../test-utils';

describe('<CookieWidgetCard /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const handleClickEssential = jest.fn();

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <CookieWidgetCard
            titleLabel={'Cookies 🍪'}
            contentLabel={
              'To help provide you with the best experience when visiting this Website, we use cookies for security and product improvement purposes in accordance with our'
            }
            privacyUrlLabel={'Privacy Policy'}
            privacyUrl={'https://ethereum.world/privacy-policy'}
            onlyEssentialLabel={'Only essential'}
            acceptAllLabel={'Accept all'}
            onClickAcceptAll={() => null}
            onClickOnlyEssential={handleClickEssential}
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
    const title = getByText('Cookies 🍪');

    expect(title).toBeDefined();
  });

  it('has action buttons', async () => {
    const { getByRole } = componentWrapper;
    const onlyEssentialButton = getByRole('button', { name: 'Only essential' });
    const acceptAllButton = getByRole('button', { name: 'Accept all' });
    expect(onlyEssentialButton).toBeDefined();
    expect(acceptAllButton).toBeDefined();
  });

  it('triggers button callback when clicked', () => {
    const { getByRole } = componentWrapper;
    const onlyEssentialButton = getByRole('button', { name: 'Only essential' });
    fireEvent.click(onlyEssentialButton);
    expect(handleClickEssential).toHaveBeenCalledTimes(1);
  });
});
