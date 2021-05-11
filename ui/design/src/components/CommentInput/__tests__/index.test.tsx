import '@testing-library/jest-dom/extend-expect';
import { cleanup, fireEvent, waitFor } from '@testing-library/react';
import * as React from 'react';
import { act, create } from 'react-test-renderer';
import CommentInput from '../';
import { customRender, wrapWithTheme } from '../../../test-utils';

const testEthAddr = '0x00123123123';
const mockString = 'text 4 test';
const mockClassName = 'test-classname-comment-input';

const createDefaultComponent = (onPublish?: any) => {
  return (
    <CommentInput
      placeholderLabel="Write a comment"
      publishLabel="Publish"
      ethAddress={testEthAddr}
      onPublish={onPublish || jest.fn()}
      className={mockClassName}
    />
  );
};

describe('<CommentInput /> Component', () => {
  let componentWrapper = create(<></>);
  beforeEach(() => {
    act(() => {
      componentWrapper = create(wrapWithTheme(createDefaultComponent()));
    });
  });
  afterEach(() => {
    act(() => componentWrapper.unmount());
    cleanup();
  });

  it('should mount without errors', () => {
    const root = componentWrapper.root;
    const commentInputComp = root.findByType(CommentInput);
    expect(commentInputComp).toBeDefined();
  });

  it('should have a fake input when not clicked', () => {
    const { findByTestId } = customRender(createDefaultComponent(), {});
    expect(findByTestId('fake-input-wrapper')).toBeDefined();
  });
  it('should render commentTextarea and publish button, when fakeInput is clicked', async () => {
    const { findByTestId } = customRender(createDefaultComponent(), {});
    const fakeInputBtn = await findByTestId('fake-input-wrapper');
    fireEvent.click(fakeInputBtn);
    const commentTextarea = await waitFor(() => findByTestId('comment-textarea'));
    const publishButton = await waitFor(() => findByTestId('comment-publish-button'));
    expect(commentTextarea).toBeDefined();
    expect(publishButton).toBeDefined();
  });
  it('should call onPublish handler with inputValue and ethAddress as params', async () => {
    let publishArgs: any[] = [];
    const publishHandler = jest.fn((inputValue, ethAddress) => {
      publishArgs = [inputValue, ethAddress];
    });
    const { findByTestId } = customRender(createDefaultComponent(publishHandler), {});
    const fakeInputBtn = await findByTestId('fake-input-wrapper');
    fireEvent.click(fakeInputBtn);
    const commentTextarea = await waitFor(() => findByTestId('comment-textarea'));
    const publishButton = await waitFor(() => findByTestId('comment-publish-button'));
    fireEvent.change(commentTextarea, { target: { value: mockString } });
    fireEvent.click(publishButton);
    expect(publishArgs[0]).toStrictEqual(mockString);
    expect(publishArgs[1]).toEqual(testEthAddr);
  });
  it.skip('should reset the internal state onPublish', async () => {
    const { findByTestId } = customRender(createDefaultComponent(), {});
    const fakeInputBtn = await findByTestId('fake-input-wrapper');
    fireEvent.click(fakeInputBtn);
    const commentTextarea = await waitFor<Promise<any>>(() => findByTestId('comment-textarea'));
    const publishButton = await waitFor(() => findByTestId('comment-publish-button'));
    fireEvent.change(commentTextarea, { target: { value: mockString } });
    expect(commentTextarea.innerHTML).toStrictEqual(mockString);
    fireEvent.click(publishButton);
    expect(commentTextarea.value).toEqual('');
  });

  it('should be customizable via className passed as prop', async () => {
    const { container } = customRender(createDefaultComponent(), {});
    const rootNode = container.firstElementChild?.firstElementChild; // first elem is the grommet wrapper
    expect(rootNode?.classList.contains(mockClassName)).toBe(true);
  });
});
