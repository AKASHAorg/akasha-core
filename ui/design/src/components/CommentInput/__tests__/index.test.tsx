import * as React from 'react';
import { act, cleanup, fireEvent, waitFor } from '@testing-library/react';

import CommentInput from '../';
import { customRender, wrapWithTheme } from '../../../test-utils';
import userEvent from '@testing-library/user-event';

const testEthAddr = '0x00123123123';
const mockString = 'text 4 test';
const mockClassName = 'test-classname-comment-input';

describe('<CommentInput /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  let publishArgs: unknown[] = [];
  const publishHandler = jest.fn((inputValue, ethAddress) => {
    publishArgs = [inputValue, ethAddress];
  });

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <CommentInput
            placeholderLabel="Write a comment"
            publishLabel="Publish"
            ethAddress={testEthAddr}
            onPublish={publishHandler}
            className={mockClassName}
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

  it('should have a fake input when not clicked', () => {
    const { getByTestId } = componentWrapper;

    const fakeInput = getByTestId('fake-input-wrapper');
    expect(fakeInput).toBeDefined();
  });

  it('should render commentTextarea and publish button, when fakeInput is clicked', async () => {
    const { getByTestId } = componentWrapper;

    // target and click fakeInput
    const fakeInput = getByTestId('fake-input-wrapper');
    expect(fakeInput).toBeDefined();
    userEvent.click(fakeInput);

    const commentTextarea = getByTestId('comment-textarea');
    const publishButton = getByTestId('comment-publish-button');

    expect(commentTextarea).toBeDefined();
    expect(publishButton).toBeDefined();
  });

  it('should call onPublish handler with inputValue and ethAddress as params', async () => {
    const { getByTestId } = componentWrapper;

    // target and click fakeInput
    const fakeInput = getByTestId('fake-input-wrapper');
    userEvent.click(fakeInput);

    const commentTextarea = getByTestId('comment-textarea');
    const publishButton = getByTestId('comment-publish-button');

    fireEvent.change(commentTextarea, { target: { value: mockString } });
    fireEvent.click(publishButton);

    expect(publishArgs[0]).toStrictEqual(mockString);
    expect(publishArgs[1]).toEqual(testEthAddr);
  });

  it.skip('should reset internal state on publish', async () => {
    const { getByTestId, findByTestId } = componentWrapper;

    // target and click fakeInput
    const fakeInput = getByTestId('fake-input-wrapper');
    userEvent.click(fakeInput);

    // target and change input in comment area
    const commentTextarea = await waitFor(() => findByTestId('comment-textarea'));
    fireEvent.change(commentTextarea, { target: { value: mockString } });

    expect(commentTextarea.innerHTML).toStrictEqual(mockString);

    // target and click publish button
    const publishButton = getByTestId('comment-publish-button');
    fireEvent.click(publishButton);

    // assert the value
    // expect(commentTextarea.value).toEqual('');
  });

  it.skip('should be customizable via className passed as prop', async () => {
    const { container } = componentWrapper;
    const rootNode = container.firstElementChild?.firstElementChild; // first elem is the grommet wrapper
    expect(rootNode?.classList.contains(mockClassName)).toBe(true);
  });
});
