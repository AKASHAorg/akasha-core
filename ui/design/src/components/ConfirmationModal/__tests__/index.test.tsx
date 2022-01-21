import * as React from 'react';
import { act, cleanup, fireEvent } from '@testing-library/react';

import ConfirmationModal from '../';
import { customRender, wrapWithTheme } from '../../../test-utils';

describe('<ConfirmationModal /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const handleModalCancel = jest.fn();
  const handleModalConfirm = jest.fn();

  const MODAL_TITLE = 'Test modal title';
  const MODAL_TEXT_DETAILS = 'Are you sure you want to perform this action?';
  const CANCEL_BUTTON_LABEL = 'Cancel';
  const CONFIRM_BUTTON_LABEL = 'Confirm';
  const CLOSE_BUTTON_LABEL = 'Close';

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <ConfirmationModal
            modalTitle={MODAL_TITLE}
            textDetails={MODAL_TEXT_DETAILS}
            onCancel={handleModalCancel}
            onClose={handleModalCancel}
            onConfirm={handleModalConfirm}
            cancelLabel={CANCEL_BUTTON_LABEL}
            confirmLabel={CONFIRM_BUTTON_LABEL}
            closeLabel={CLOSE_BUTTON_LABEL}
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
    const title = getByText(MODAL_TITLE);

    expect(title).toBeDefined();
  });

  it('has action buttons', async () => {
    const { getByRole } = componentWrapper;
    const cancelButton = getByRole('button', { name: CANCEL_BUTTON_LABEL });
    const confirmButton = getByRole('button', { name: CONFIRM_BUTTON_LABEL });
    expect(cancelButton).toBeDefined();
    expect(confirmButton).toBeDefined();
  });

  it('triggers cancel callback when clicked', async () => {
    const { getByRole } = componentWrapper;
    const cancelButton = getByRole('button', { name: CANCEL_BUTTON_LABEL });
    fireEvent.click(cancelButton);
    expect(handleModalCancel).toHaveBeenCalledTimes(1);
  });

  it('triggers confirm callback when clicked', () => {
    const { getByRole } = componentWrapper;
    const confirmButton = getByRole('button', { name: CONFIRM_BUTTON_LABEL });
    fireEvent.click(confirmButton);
    expect(handleModalConfirm).toHaveBeenCalledTimes(1);
  });
});
