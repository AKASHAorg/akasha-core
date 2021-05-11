import * as React from 'react';
// import { create } from 'react-test-renderer';
import { render } from '@testing-library/react';

import EnsFormCard from '../';
import { wrapWithTheme } from '../../../test-utils';

describe('EnsFormCard component', () => {
  it('renders correctly', () => {
    render(
      wrapWithTheme(
        <EnsFormCard
          titleLabel={'Add a Username'}
          nameLabel={'Select a username'}
          errorLabel={'Sorry, this username has already been taken. Please choose another one.'}
          cancelLabel={'Cancel'}
          saveLabel={'Save'}
          options={[
            {
              type: 0,
              label: 'Display my AKASHA Ethereum name',
              value: 'mysubdomain.akasha.eth',
              defaultChecked: false,
              textDetails: <>`Username Powered by ENS`</>,
            },
          ]}
          onSave={() => null}
          onCancel={() => null}
        />,
      ),
    );
  });
});
