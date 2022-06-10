import React from 'react';
import { act, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ModerateModal from '../';

import { customRender, wrapWithTheme } from '../../../test-utils';

describe('<ModerateModal /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const handleCloseModal = jest.fn();
  const handleModerate = jest.fn();

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <ModerateModal
            titleLabel="Make a Decision"
            altTitleLabel="Review a Decision"
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
            requesting={false}
            isReview={false}
            closeModal={handleCloseModal}
            onModerate={handleModerate}
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

    const modalTitle = getByText('Make a Decision');
    expect(modalTitle).toBeDefined();
  });

  it('has two radio options', () => {
    const { getAllByRole } = componentWrapper;

    const options = getAllByRole('radio');
    expect(options).toHaveLength(2);
  });

  it('can select radio option', async () => {
    const { getByRole } = componentWrapper;

    // target the radio options
    const delistOption = getByRole('radio', { name: 'Delist' });
    const keepOption = getByRole('radio', { name: 'Keep' });

    // delistOption is initially checked by default
    expect(delistOption).toBeChecked();
    expect(keepOption).not.toBeChecked();

    // select keepOption
    await userEvent.click(keepOption);

    // keepOption is now checked
    expect(delistOption).not.toBeChecked();
    expect(keepOption).toBeChecked();
  });

  it('can type into the input field', async () => {
    const { getByRole } = componentWrapper;

    const input = getByRole('textbox');
    expect(input).toBeDefined();

    // button label will match default selected option - Delist
    const actionButton = getByRole('button', { name: 'Delist' });

    // button should be initially disabled
    expect(actionButton).toHaveAttribute('disabled');

    // type into the input field
    await userEvent.type(input, 'some reason(s) supporting the moderation decision');

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
