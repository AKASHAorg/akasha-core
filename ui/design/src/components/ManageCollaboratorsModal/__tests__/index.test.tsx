import React from 'react';
import { act, cleanup } from '@testing-library/react';

import ManageCollaboratorsModal from '..';

import { customRender, wrapWithTheme } from '../../../test-utils';

describe('<ManageCollaboratorsModal /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const handleCloseModal = jest.fn();
  const handleInputChange = jest.fn();
  const handleSearch = jest.fn();
  const handleClickCollaborator = jest.fn();
  const handleDropClose = jest.fn();

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <ManageCollaboratorsModal
            titleLabel="Collaborators"
            inputValue=""
            inputPlaceholderLabel="Search for a name or @name"
            collaborators={[]}
            searchResults={[]}
            noCollaboratorsLabel="You have not invited any collaborators yet"
            noSearchItemsLabel="We couldn't find matching profiles"
            dropOpen={false}
            addButtonLabel="Add"
            removeButtonLabel="Remove"
            onInputChange={handleInputChange}
            onSearch={handleSearch}
            closeModal={handleCloseModal}
            onClickCollaborator={handleClickCollaborator}
            closeDrop={handleDropClose}
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

    const modalTitle = getByText('Collaborators');
    expect(modalTitle).toBeDefined();
  });
});
