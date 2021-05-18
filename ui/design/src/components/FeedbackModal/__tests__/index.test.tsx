import React from 'react';
import { Box } from 'grommet';
import { act, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import FeedbackModal from '../';
import Icon from '../../Icon';
import { customRender, wrapWithTheme } from '../../../test-utils';

const BaseComponent = () => {
  const iconRef = React.useRef<HTMLDivElement>(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  return (
    <Box width="medium" pad={{ top: 'large' }}>
      <div ref={iconRef}>
        <Icon type="eye" testId="eye-icon" onClick={() => setModalOpen(true)} />
      </div>
      {iconRef?.current && modalOpen && (
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
          closeModal={() => null}
        />
      )}
    </Box>
  );
};

describe('<FeedbackModal /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(wrapWithTheme(<BaseComponent />), {});
    });

    /* this block of code is specific to modals and popovers
      that will be rendered after an icon is clicked */

    const { getByTestId } = componentWrapper;
    const icon = getByTestId('eye-icon');
    // perform click action to reveal modal
    userEvent.click(icon);
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
