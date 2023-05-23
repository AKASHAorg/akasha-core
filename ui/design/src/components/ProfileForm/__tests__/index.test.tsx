import * as React from 'react';
import { act, cleanup, fireEvent } from '@testing-library/react';

import ProfileForm from '..';
import { customRender, wrapWithTheme } from '../../../test-utils';
import { boxProviderData } from '../../../utils/dummy-data';
import { UpdateProfileStatus } from '@akashaorg/typings/ui';

describe('<ProfileForm /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const handleSave = jest.fn();

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <ProfileForm
            modalSlotId={''}
            nameLabel={'Name'}
            saveLabel={'Save'}
            urlLabel={'By url'}
            avatarLabel={'Avatar'}
            cancelLabel={'Cancel'}
            deleteLabel={'Delete Image'}
            coverImageLabel={'Cover Image'}
            uploadLabel={'Upload an image'}
            titleLabel={'Ethereum Address'}
            descriptionLabel={'Description'}
            socialLinksTitle={'Social Links'}
            socialLinksButtonLabel={'Add Social Links'}
            nameFieldPlaceholder={'Type your name here'}
            descriptionFieldPlaceholder={'Add a description about you here'}
            // ethAddress={'0x003410499401674320006570047391024572456'}
            providerData={boxProviderData}
            updateStatus={UpdateProfileStatus.UPDATE_IDLE}
            onSave={handleSave}
            onCancel={() => null}
            ensSectionTitle={'ENS'}
            ensPrefillButtonLabel={'Prefill ens data'}
            ensData={{ name: 'ens.eth' }}
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

  // it('has correct title', () => {
  //   const { getAllByText } = componentWrapper;
  //   const title = getAllByText(/ethereum address/i);
  //   expect(title).toBeDefined();
  // });

  it.skip('has input and text area fields', () => {
    const { getAllByRole } = componentWrapper;
    const inputs = getAllByRole('textbox');
    expect(inputs).toBeDefined();
  });

  it.skip('has correct name placeholder', () => {
    const { getAllByPlaceholderText } = componentWrapper;
    const nameInputPlaceholder = getAllByPlaceholderText('Type your name here');
    expect(nameInputPlaceholder).toBeDefined();
  });

  it.skip('has correct description placeholder', () => {
    const { getAllByPlaceholderText } = componentWrapper;
    const nameInputPlaceholder = getAllByPlaceholderText('Add a description about you here');
    expect(nameInputPlaceholder).toBeDefined();
  });

  it.skip('renders action buttons', () => {
    const { getAllByRole } = componentWrapper;
    const cancelButton = getAllByRole('button', { name: 'Cancel' });
    const saveButton = getAllByRole('button', { name: 'Save' });
    expect(cancelButton).toBeDefined();
    expect(saveButton).toBeDefined();
  });

  it.skip('has save button initially disabled', () => {
    const { getAllByRole } = componentWrapper;
    const saveButton = getAllByRole('button', { name: 'Save' });
    fireEvent.click(saveButton[0]);
    expect(saveButton[0]).toHaveProperty('disabled', true);
  });
});
