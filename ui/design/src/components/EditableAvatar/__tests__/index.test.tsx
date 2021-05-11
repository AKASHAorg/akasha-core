import '@testing-library/jest-dom/extend-expect';
import { cleanup, fireEvent, waitFor } from '@testing-library/react';
import * as React from 'react';
import { act, create, ReactTestRenderer } from 'react-test-renderer';
import { createFile, customRender, wrapWithTheme } from '../../../test-utils';
import { MockFileReader, WindowWithFileReader } from '../../../test-utils/mocks';
import EditableAvatar from '../';

describe('<EditableAvatar /> Component', () => {
  let componentWrapper: ReactTestRenderer = create(<></>);
  const originalFileReader = FileReader;

  beforeEach(() => {
    (window as WindowWithFileReader).FileReader = MockFileReader;
    act(() => {
      componentWrapper = create(
        wrapWithTheme(
          <EditableAvatar onChange={jest.fn()} ethAddress={'0x1230am3421h3i14cvv21n4'} />,
        ),
      );
    });
  });

  afterEach(() => {
    (window as WindowWithFileReader).FileReader = originalFileReader;
    act(() => componentWrapper.unmount());
    cleanup();
  });

  it('should have 1 input type file', async () => {
    const { getAllByTestId } = customRender(
      <EditableAvatar onChange={jest.fn()} ethAddress={'0x1230am3421h3i14cvv21n4'} />,
      {},
    );
    const fileInput = await waitFor(() => getAllByTestId('avatar-file-input'));
    expect(fileInput).toHaveLength(1);
    expect(fileInput[0].getAttribute('type')).toEqual('file');
  });

  it('should trigger onChange event when input is changed', async () => {
    const onChange = jest.fn();
    const { findByTestId } = customRender(
      <EditableAvatar onChange={onChange} ethAddress={'0x1230am3421h3i14cvv21n4'} />,
      {},
    );
    const fileInput = await waitFor(() => findByTestId('avatar-file-input'));
    fireEvent.change(fileInput, { target: { file: createFile('test-file.png') } });
    expect(onChange).toBeCalledTimes(1);
  });
});
