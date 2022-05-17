import * as React from 'react';
import userEvent from '@testing-library/user-event';
import { act, cleanup } from '@testing-library/react';

import InstallModal from '../';
import { customRender, wrapWithTheme } from '../../../test-utils';

describe('<InstallModal /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const handleCancel = jest.fn();
  const handleCloseModal = jest.fn();

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <InstallModal
            onCancel={handleCancel}
            onCloseModal={handleCloseModal}
            integrationName="Integration Name"
            cancelLabel="Cancel Label"
            continueLabel="Continue Label"
            cancelTitleLabel="Cancel Title Label"
            cancelSubtitleLabel="Cancel Subtitle Label"
            doneLabel="Done Label"
            dismissLabel="Dismiss Label"
            modalTitleLabel="Modal Title Label"
            installTitleLabel="Install Title Label"
            savingInfoLabel="Saving Info Label"
            downloadingResourcesLabel="Downloading Resources Label"
            successTitleLabel="Success Title Label"
            successSubtitleLabel="Success Subtitle Label"
            successInfoLabel="Success Info Label"
            successSubInfoLabel="Success SubInfo Label"
            errorTitleLabel="Error Title Label"
            errorSubtitleLabel="Error Subtitle Label"
            errorInfoLabel="Error Info Label"
            errorSubInfoLabel="Error SubInfo Label"
            error={null}
            installStep={1}
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

    const modalTitle = getByText('Modal Title Label');

    expect(modalTitle).toBeDefined();
  });

  it('calls correct handlers when clicked', () => {
    const { getByText } = componentWrapper;

    // initial modal state: installing
    const cancelButton = getByText('Cancel Label');

    expect(cancelButton).toBeDefined();

    userEvent.click(cancelButton);

    // current modal state: cancel
    const cancelButton2 = getByText('Cancel Label');

    expect(cancelButton2).toBeDefined();
    expect(handleCancel).toBeCalledTimes(0);
    expect(handleCloseModal).toBeCalledTimes(0);

    userEvent.click(cancelButton2);

    expect(handleCancel).toBeCalledTimes(1);
    expect(handleCloseModal).toBeCalledTimes(1);
  });
});
