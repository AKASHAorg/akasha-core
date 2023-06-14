import * as React from 'react';
import { act } from '@testing-library/react';
import Sidebar from '../';
import { customRender } from '../../../test-utils';
import { sidebarItems } from '../../../utils/dummy-data';

describe('<Sidebar /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const guestTitle = 'Guest';
  const guestSubtitle = 'Connect to see exclusive member only features.';
  const ctaText = 'Add magic to your world by installing cool apps developed by the community';
  const ctaButtonLabel = 'Check them out!';
  const footerLabel = 'Get in Touch';

  const footerIcons = [
    { name: 'github', link: '', icon: 'akasha' },
    { name: 'discord', link: '', icon: 'akasha' },
    { name: 'telegram', link: '', icon: 'akasha' },
    { name: 'twitter', link: '', icon: 'akasha' },
  ];

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        <Sidebar
          guestTitle={guestTitle}
          guestSubtitle={guestSubtitle}
          ctaText={ctaText}
          ctaButtonLabel={ctaButtonLabel}
          footerLabel={footerLabel}
          loggedUser={{}}
          listItems={sidebarItems}
          footerIcons={footerIcons}
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

  it('has correct guest title and subtitle', () => {
    const { getByText } = componentWrapper;

    const title = getByText(guestTitle);
    const subtitle = getByText(guestSubtitle);

    expect(title).toBeDefined();
    expect(subtitle).toBeDefined();
  });
});
