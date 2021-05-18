import * as React from 'react';
import { act, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ImagePopover from '../';

import { customRender, wrapWithTheme } from '../../../test-utils';

describe('<ImagePopover /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const targetNode = document.createElement('div');
  document.body.appendChild(targetNode);

  const handleClosePopover = jest.fn();
  const handleInsertImage = jest.fn();
  const handleUploadRequest = jest.fn();

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <ImagePopover
            dropzoneLabel="Drop image to upload"
            uploadImageLabel="Upload Image"
            uploadingImageLabel="Uploading image"
            byUrlLabel="By Url"
            insertLabel="Insert"
            uploadFailedLabel="Upload failed"
            fetchImageFailedLabel="Fetch image failed"
            target={targetNode}
            closePopover={handleClosePopover}
            insertImage={handleInsertImage}
            uploadRequest={handleUploadRequest}
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

  it('renders popover when clicked', () => {
    const { getByText } = componentWrapper;

    const uploadImageLabel = getByText('Upload Image');

    expect(uploadImageLabel).toBeDefined();
  });

  it('can switch between upload types in the popover', () => {
    const { getByRole } = componentWrapper;

    const uploadByUrlTab = getByRole('tab', { name: 'By Url' });
    userEvent.click(uploadByUrlTab);

    const insertButton = getByRole('button', { name: 'Insert' });

    // insert button should be in view now
    expect(insertButton).toBeDefined();
  });

  it.skip('can upload file', () => {
    const { getByTestId } = componentWrapper;

    // create a file
    const file = new File(['drflynn'], 'drflynn.png', { type: 'image/png' });

    // target and upload file into dropzone input
    const dropzone: any = getByTestId('dropzone-input');

    // wrapping into act since it will trigger state updates
    // act(() => {
    userEvent.upload(dropzone, file);
    // });

    expect(dropzone.files[0]).toStrictEqual(file);
    expect(dropzone.files.item(0)).toStrictEqual(file);
    expect(dropzone.files).toHaveLength(1);
  });
});
