import React from 'react';
import { act, cleanup } from '@testing-library/react';

import ManageCollaboratorsModal from '../';

import { customRender, wrapWithTheme } from '../../../test-utils';

describe('<ManageCollaboratorsModal /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const handleCloseModal = jest.fn();

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <ManageCollaboratorsModal titleLabel="Collaborators" closeModal={handleCloseModal} />,
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
