import * as React from 'react';
import { act, cleanup } from '@testing-library/react';

import EnsFormCard from '../';
import { customRender, wrapWithTheme } from '../../../test-utils';
import userEvent from '@testing-library/user-event';

describe('<EnsFormCard /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const handleSave = jest.fn();

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
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
            onSave={handleSave}
          />,
        ),
        {},
      );
    });
  });

  afterEach(() => {
    act(() => {
      componentWrapper.unmount();
    });
    cleanup();
  });

  it('renders correctly', () => {
    expect(componentWrapper).toBeDefined();
  });

  it('has correct title', () => {
    const { getAllByText } = componentWrapper;
    const title = getAllByText(/Add a Username/i);
    expect(title).toBeDefined();
  });

  it('has radio options', () => {
    const { getAllByRole } = componentWrapper;
    const options = getAllByRole('radio', { name: 'Display my AKASHA Ethereum name' });

    userEvent.click(options[0]);

    expect(options[0]).toBeDefined();
  });

  it('renders action buttons', () => {
    const { getAllByRole } = componentWrapper;
    const cancelButton = getAllByRole('button', { name: 'Cancel' });
    const saveButton = getAllByRole('button', { name: 'Save' });
    expect(cancelButton).toBeDefined();
    expect(saveButton).toBeDefined();
  });
});
