import React from 'react';
import { act, cleanup } from '@testing-library/react';

import { customRender } from '@akashaorg/design-system-core/lib/test-utils';

import ManageCollaboratorsModal from '..';

describe('<ManageCollaboratorsModal /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const handleCloseModal = jest.fn();
  const handleInputChange = jest.fn();
  const handleSearch = jest.fn();
  const handleClickCollaborator = jest.fn();

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        <ManageCollaboratorsModal
          titleLabel="Collaborators"
          inputValue=""
          inputPlaceholderLabel="Search for a name or @name"
          collaborators={[]}
          searchResults={[]}
          noCollaboratorsLabel="You have not invited any collaborators yet"
          noSearchItemsLabel="We couldn't find matching profiles"
          addButtonLabel="Add"
          removeButtonLabel="Remove"
          onInputChange={handleInputChange}
          onSearch={handleSearch}
          closeModal={handleCloseModal}
          onClickCollaborator={handleClickCollaborator}
        />,

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

    const modalTitle = getByText('Collaborators');
    expect(modalTitle).toBeDefined();
  });
});
