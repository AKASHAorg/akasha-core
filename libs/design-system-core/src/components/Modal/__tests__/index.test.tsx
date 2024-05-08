import * as React from 'react';
import { act, fireEvent, waitFor } from '@testing-library/react';
import { customRender } from '../../../test-utils';
import Modal from '../';
import { ButtonProps } from '../../Button/types';

const buttonLabel = 'Show modal';
const modalText = 'Modal text';
let showModal = false;
const actions = [
  { label: 'Cancel', variant: 'text' },
  { label: 'OK', variant: 'primary' },
] as ButtonProps[];
const renderCombo = showModal => (
  <>
    <button onClick={() => mockSetShowModal(true)}> {buttonLabel}</button>
    <Modal show={showModal} onClose={() => mockSetShowModal(false)} actions={actions}>
      <p>{modalText}</p>
    </Modal>
  </>
);

const mockSetShowModal = jest.fn(value => (showModal = value));

describe('<Closed Modal /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(renderCombo(showModal), {});
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    expect(componentWrapper).toBeDefined();
  });

  it('hide modal by default correctly', () => {
    const { queryByText } = componentWrapper;
    const modal = queryByText(modalText);

    expect(modal).toBeNull();
  });

  it('calls modal handler function when clicked', async () => {
    const { getByText } = componentWrapper;

    const button = getByText(buttonLabel);
    await fireEvent.click(button);

    expect(mockSetShowModal).toHaveBeenCalledTimes(1);
  });

  it('render modal correctly when clicked', async () => {
    const { getByText, rerender } = componentWrapper;

    const button = getByText(buttonLabel);
    await fireEvent.click(button);
    rerender(renderCombo(showModal));
    const modal = waitFor(() => getByText(modalText));

    expect(modal).toBeDefined();
  });
});

describe('<Open Modal /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        <Modal show={true} onClose={() => mockSetShowModal(false)} actions={actions}>
          <p>{modalText}</p>
        </Modal>,
        {},
      );
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('hide modal correctly when close button is clicked', async () => {
    const { getByRole, getByText } = componentWrapper;

    const button = getByRole('button', { name: 'Cancel' });
    await fireEvent.click(button);
    const modal = getByText(modalText);

    expect(modal).toBeDefined();
  });
});
