import React from 'react';
import { act, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ReportModal from '../';

import { customRender, wrapWithTheme } from '../../../test-utils';

describe('<ReportModal /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const handleSelectReason = jest.fn();
  const handleSetExplanation = jest.fn();
  const handleCloseModal = jest.fn();
  const handleReport = jest.fn();

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <ReportModal
            titleLabel="Report a Post"
            successTitleLabel="Thank you for helping us keep Akasha World safe! 🙌"
            successMessageLabel="We have received your message"
            reasonPrefix="TI"
            contentId="0845"
            footerLabel="Feel like you want to contribute more to improve our community?"
            footerCTAUrl="https://discord.gg/A5wfg6ZCRt"
            footerCTALabel="Join our Moderation Discord channel"
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
            reason="Other"
            descriptionLabel="Explanation"
            descriptionPlaceholder="Please explain your reason(s)"
            explanation="some explanation"
            footerText1Label="If you are unsure, you can refer to our"
            footerLink1Label="Code of Conduct"
            footerUrl1="https://akasha.ethereum.world/legal/code-of-conduct"
            footerText2Label="and"
            footerLink2Label="Terms of Service"
            footerUrl2="https://akasha.ethereum.world/legal/terms-of-service"
            cancelLabel="Cancel"
            reportLabel="Report"
            requesting={false}
            success={false}
            onSelectReason={handleSelectReason}
            onSetExplanation={handleSetExplanation}
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

  it('calls handler when selecting a radio option', async () => {
    const { getByRole } = componentWrapper;

    // target an option
    const illegalOption = getByRole('radio', { name: 'Illegal' });

    expect(handleSelectReason).toBeCalledTimes(0);

    // click illegalOption
    await userEvent.click(illegalOption);

    // handler is now called
    expect(handleSelectReason).toBeCalledTimes(1);
  });

  it('calls handler when typing into the input field', async () => {
    const { getByRole } = componentWrapper;

    const input = getByRole('textbox');
    expect(input).toBeDefined();

    expect(handleSetExplanation).toBeCalledTimes(0);

    // type into the input field
    await userEvent.type(input, 'optional explanation supporting the report action');

    // handler is now called
    expect(handleSetExplanation).toBeCalled();
  });

  it('has two buttons', () => {
    const { getAllByRole } = componentWrapper;

    const buttons = getAllByRole('button');
    expect(buttons).toHaveLength(2);
  });
});
