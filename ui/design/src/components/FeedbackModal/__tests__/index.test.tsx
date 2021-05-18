import React from 'react';
import { act, cleanup } from '@testing-library/react';

import FeedbackModal from '../';

import { customRender, wrapWithTheme } from '../../../test-utils';

describe('<FeedbackModal /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const handleCloseModal = jest.fn();

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <FeedbackModal
            titleLabel="We'd love to hear your feedback!"
            subtitleLabel="If you find any bugs or problems please let us know"
            openAnIssueLabel="Open an Issue"
            emailUsLabel="Email Us"
            footerTextLabel='Join our Discord channel to meet everyone, say "Hello!", provide feedback and share ideas.'
            footerLinkText1Label="Join in"
            footerLinkText2Label="Discord"
            openIssueLink=""
            emailUsLink=""
            joinDiscordLink=""
            closeModal={handleCloseModal}
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

  it('renders modal when clicked', () => {
    const { getByText } = componentWrapper;
    const modalTitle = getByText(/We'd love /);
    const modalSubtitle = getByText(/If you find /);

    expect(modalTitle).toBeDefined();
    expect(modalSubtitle).toBeDefined();
  });

  it('has two buttons in the modal', () => {
    const { getByRole } = componentWrapper;

    const openAnIssueButton = getByRole('button', { name: 'Open an Issue' });
    const emailUsButton = getByRole('button', { name: 'Email Us' });

    expect(openAnIssueButton).toBeDefined();
    expect(emailUsButton).toBeDefined();
  });
});
