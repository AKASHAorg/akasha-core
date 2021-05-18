import React from 'react';
import { Box } from 'grommet';
import { ToastProvider } from 'react-toast-notifications';
import { act, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ModerateModal from '../';
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
        <ToastProvider autoDismiss={true} autoDismissTimeout={5000}>
          <ModerateModal
            titleLabel="Make a Decision"
            altTitleLabel="Review a Decision"
            contentType="post"
            decisionLabel="Decision"
            optionLabels={['Delist', 'Keep']}
            optionValues={['Delist', 'Keep']}
            descriptionLabel="Evaluation"
            descriptionPlaceholder="Please explain the reason(s)"
            footerText1Label="If you are unsure, you can refer to our"
            footerLink1Label="Code of Conduct"
            footerUrl1="/legal/code-of-conduct"
            cancelLabel="Cancel"
            user="0x003410490050000320006570034567114572000"
            contentId="01f50jfyy4pzg1fedt3ge2jnvh"
            baseUrl=""
            isReview={false}
            closeModal={() => setModalOpen(false)}
            onModalClose={() => setModalOpen(false)}
            signData={jest.fn()}
          />
        </ToastProvider>
      )}
    </Box>
  );
};

describe('<ModerateModal /> Component', () => {
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

  it('has correct title', () => {
    const { getByText } = componentWrapper;

    const modalTitle = getByText('Make a Decision');
    expect(modalTitle).toBeDefined();
  });

  it('has two radio options', () => {
    const { getAllByRole } = componentWrapper;

    const options = getAllByRole('radio');
    expect(options).toHaveLength(2);
  });

  it('can select radio option', () => {
    const { getByRole } = componentWrapper;

    // target the radio options
    const delistOption = getByRole('radio', { name: 'Delist' });
    const keepOption = getByRole('radio', { name: 'Keep' });

    // delistOption is initially checked by default
    expect(delistOption).toBeChecked();
    expect(keepOption).not.toBeChecked();

    // select keepOption
    userEvent.click(keepOption);

    // keepOption is now checked
    expect(delistOption).not.toBeChecked();
    expect(keepOption).toBeChecked();
  });

  it('can type into the input field', () => {
    const { getByRole } = componentWrapper;

    const input = getByRole('textbox');
    expect(input).toBeDefined();

    // button label will match default selected option - Delist
    const actionButton = getByRole('button', { name: 'Delist' });

    // button should be initially disabled
    expect(actionButton).toHaveAttribute('disabled');

    // type into the input field
    userEvent.type(input, 'some reason(s) supporting the moderation decision');

    // input value should match typed in value
    expect(input).toHaveValue('some reason(s) supporting the moderation decision');
    // action button should no longer be disabled
    expect(actionButton.hasAttribute('disabled')).not.toBeTruthy();
  });

  it('has two buttons', () => {
    const { getAllByRole } = componentWrapper;

    const buttons = getAllByRole('button');
    expect(buttons).toHaveLength(2);
  });
});
