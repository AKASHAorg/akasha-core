import React from 'react';
import { act, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ReportModal from '../';

import { customRender, wrapWithTheme } from '../../../test-utils';

describe('<ReportModal /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const handleCloseModal = jest.fn();
  const handleReport = jest.fn();

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <ReportModal
            titleLabel="Report a Post"
            successTitleLabel="Thank you for helping us keep Ethereum World safe! 🙌"
            successMessageLabel="We will investigate this post and take appropriate action."
            optionsTitleLabel="Please select a reason"
            optionLabels={[
              'Suspicious, deceptive, or spam',
              'Abusive or harmful to others',
              'Self-harm or suicide',
              'Illegal',
              'Nudity',
              'Violence',
            ]}
            optionValues={[
              'Suspicious, deceptive, or spam',
              'Abusive or harmful to others',
              'Self-harm or suicide',
              'Illegal',
              'Nudity',
              'Violence',
            ]}
            descriptionLabel="Explanation"
            descriptionPlaceholder="Please explain your reason(s)"
            footerText1Label="If you are unsure, you can refer to our"
            footerLink1Label="Code of Conduct"
            footerUrl1="https://akasha.ethereum.world/legal/code-of-conduct"
            footerText2Label="and"
            footerLink2Label="Terms of Service"
            footerUrl2="https://akasha.ethereum.world/legal/terms-of-service"
            cancelLabel="Cancel"
            reportLabel="Report"
            blockLabel="Block User"
            closeLabel="Close"
            requesting={false}
            success={false}
            closeModal={handleCloseModal}
            onReport={handleReport}
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

    const modalTitle = getByText('Report a Post');
    expect(modalTitle).toBeDefined();
  });

  it('has six radio options', () => {
    const { getAllByRole } = componentWrapper;

    const options = getAllByRole('radio');
    expect(options).toHaveLength(6);
  });

  it('can select radio option', () => {
    const { getByRole } = componentWrapper;

    // target an option
    const illegalOption = getByRole('radio', { name: 'Illegal' });

    expect(illegalOption).not.toBeChecked();

    // select illegalOption
    userEvent.click(illegalOption);

    // illegalOption is now checked
    expect(illegalOption).toBeChecked();
  });

  it('enables action button when an option is selected', () => {
    const { getByRole } = componentWrapper;

    // target an option
    const illegalOption = getByRole('radio', { name: 'Illegal' });
    // target report action handler
    const actionButton = getByRole('button', { name: 'Report' });

    // button should be initially disabled
    expect(actionButton).toHaveAttribute('disabled');

    // select illegalOption
    userEvent.click(illegalOption);

    // illegalOption is now checked
    expect(illegalOption).toBeChecked();
    // action button should no longer be disabled
    expect(actionButton.hasAttribute('disabled')).not.toBeTruthy();
  });

  it('can type into the input field', () => {
    const { getByRole } = componentWrapper;

    const input = getByRole('textbox');
    expect(input).toBeDefined();

    // type into the input field
    userEvent.type(input, 'optional explanation supporting the report action');

    // input value should match typed in value
    expect(input).toHaveValue('optional explanation supporting the report action');
  });

  it('has two buttons', () => {
    const { getAllByRole } = componentWrapper;

    const buttons = getAllByRole('button');
    expect(buttons).toHaveLength(2);
  });
});
