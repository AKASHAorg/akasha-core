import * as React from 'react';
import MessageCard from '../';
import { screen } from '@testing-library/react';
import { customRender } from '../../../test-utils';

describe('<MessageCard /> Component', () => {
  const message = 'Message';

  it('renders correctly', () => {
    customRender(<MessageCard message={message} />, {});
    expect(screen.getByText(message)).toBeInTheDocument();
  });
});
