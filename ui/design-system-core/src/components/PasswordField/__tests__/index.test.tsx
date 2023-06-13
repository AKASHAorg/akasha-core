import * as React from 'react';
import { act, cleanup } from '@testing-library/react';
import PasswordField from '../';
import { customRender } from '../../../test-utils';

describe('<PasswordField /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        <PasswordField strengthLevel={4} placeholderLabel="Enter your password" />,
        {},
      );
    });
  });

  afterEach(() => {
    act(() => componentWrapper.unmount());
    cleanup();
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    expect(componentWrapper).toBeDefined();
  });

  it('shows correct text for password strength level', () => {
    const { getByText } = componentWrapper;

    const label = getByText('Strong');

    expect(label).toBeDefined();
  });
});
