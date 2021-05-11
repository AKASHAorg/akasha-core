import * as React from 'react';
// import { create } from 'react-test-renderer';
import { render } from '@testing-library/react';

import CookieWidgetCard from '../';
import { wrapWithTheme } from '../../../test-utils';

describe('CookieWidgetCard component', () => {
  it('renders correctly', () => {
    render(
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
          onClickOnlyEssential={() => null}
        />,
      ),
    );
  });
});
