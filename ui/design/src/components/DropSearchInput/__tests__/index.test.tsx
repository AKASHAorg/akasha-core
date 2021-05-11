import * as React from 'react';
import { act, cleanup, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import DropSearchInput from '..';
import { customRender, wrapWithTheme } from '../../../test-utils';

const suggestionsFromSpace = {
  users: [
    {
      name: 'Gilbert Carter',
      imageUrl: 'https://placebeard.it/640/480',
    },
    {
      name: 'Johan Gimli',
      imageUrl: 'https://placebeard.it/640/480',
    },
  ],
  tags: ['#gitcoin', '#gitcoinbounties'],
  apps: [
    {
      name: 'GitCoin',
      imageUrl: 'https://placebeard.it/640/480',
    },
  ],
};

describe('<DropSearchInput /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const handleGetData = jest.fn();

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <DropSearchInput
            dataSource={suggestionsFromSpace}
            placeholder="Search something..."
            resultsLabel="See all results"
            appsLabel="Apps"
            tagsLabel="Tags"
            usersLabel="Users"
            getData={handleGetData}
            onClickUser={() => null}
            onClickTag={() => console.log('HELLO!!!!!!!!')}
            onClickApp={() => null}
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

  it('has correct placeholder', () => {
    const { getByPlaceholderText } = componentWrapper;
    const title = getByPlaceholderText('Search something...');

    expect(title).toBeDefined();
  });

  it('types into the input and displays suggestions in dropdown', async () => {
    const { getByRole, findByText } = componentWrapper;
    const input = getByRole('textbox');

    // perform type action to reveal dropdown
    userEvent.type(input, 'gil');

    const suggested = await findByText('Gilbert Carter');
    expect(suggested).toBeDefined();
  });

  it('can toggle tabs in the dropdown when available', async () => {
    const { getByText, getByRole, findByText } = componentWrapper;
    const input = getByRole('textbox');

    // perform type action to reveal dropdown
    userEvent.type(input, 'gil');

    // target tabs
    const tagsTab = getByText('Tags');
    const appsTab = getByText('Apps');

    // click on Tags tab
    fireEvent.click(tagsTab);

    const suggestedTagItem = await findByText('#gitcoin');
    expect(suggestedTagItem).toBeDefined();

    // click on Apps tab
    fireEvent.click(appsTab);

    const suggestedAppItem = await findByText('GitCoin');
    expect(suggestedAppItem).toBeDefined();
  });
});
