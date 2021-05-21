import * as React from 'react';
import { act, cleanup, fireEvent, waitFor } from '@testing-library/react';

import EditableAvatar from '../';
import { createFile, customRender, wrapWithTheme } from '../../../test-utils';

describe('<EditableAvatar /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const handleChange = jest.fn();

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <EditableAvatar ethAddress={'0x01230123450012312'} onChange={handleChange} />,
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

  it('should have 1 input type file', async () => {
    const { getAllByTestId } = componentWrapper;

    const fileInput = await waitFor(() => getAllByTestId('avatar-file-input'));

    expect(fileInput).toHaveLength(1);
    expect(fileInput[0].getAttribute('type')).toEqual('file');
  });

  it('should trigger onChange event when input is changed', async () => {
    const { findByTestId } = componentWrapper;

    const fileInput = await waitFor(() => findByTestId('avatar-file-input'));

    fireEvent.change(fileInput, { target: { file: createFile('test-file.png') } });
    expect(handleChange).toBeCalledTimes(1);
  });
});
