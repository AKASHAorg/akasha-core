import * as React from 'react';
import { act, fireEvent } from '@testing-library/react';
import MessageCard from '../';
import { customRender } from '../../../test-utils';

describe('<MessageCard /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const title = 'Title';
  const message = 'Message';

  const handleClose = jest.fn();

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        <MessageCard title={title} message={message} elevation="1" onClose={handleClose} />,
        {},
      );
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    expect(componentWrapper).toBeDefined();
  });

  it('has correct title and message', () => {
    const { getByText } = componentWrapper;

    const titleLabel = getByText(title);
    const messageLabel = getByText(message);

    expect(titleLabel).toBeDefined();
    expect(messageLabel).toBeDefined();
  });

  it('calls handler when clicked', () => {
    const { getByRole } = componentWrapper;

    const closeButton = getByRole('button', { name: 'close' });
    expect(closeButton).toBeDefined();
    expect(handleClose).toBeCalledTimes(0);

    fireEvent.click(closeButton);

    expect(handleClose).toBeCalledTimes(1);
  });
});
