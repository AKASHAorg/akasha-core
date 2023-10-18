import React from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore-next-line
import EditProfilePage from '../pages/edit-profile';

import * as hooks from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';
import * as loginHook from '@akashaorg/ui-awf-hooks/lib/use-login.new';

import userEvent from '@testing-library/user-event';

import { renderWithAllProviders, act, screen, genUser, waitFor } from '@akashaorg/af-testing';
import { Profile } from '@akashaorg/typings/lib/ui';
import { MemoryRouter as Router } from 'react-router-dom';

describe('< ProfileInfoPage />', () => {
  const BaseComponent = (
    <Router initialEntries={['/@akashaorg/app-profile/']}>
      <EditProfilePage handleFeedback={jest.fn} />
    </Router>
  );

  const profile = genUser('pkh:eip155:5:0xc47a483494db8fe455ba29a53a7f75349dfc02ff');

  beforeEach(async () => {
    userEvent.setup();
    await act(async () => {
      renderWithAllProviders(BaseComponent, {});
    });
  });

  beforeAll(() => {
    (
      jest.spyOn(hooks, 'useGetProfileByDidQuery') as unknown as jest.SpyInstance<{
        data: {
          isViewer: boolean;
          akashaProfile: Profile;
        };
        status: 'success' | 'error';
      }>
    ).mockReturnValue({ data: { isViewer: true, akashaProfile: profile }, status: 'success' });

    (
      jest.spyOn(loginHook, 'useGetLogin') as unknown as jest.SpyInstance<{
        data: { id: string };
        status: 'success' | 'error';
      }>
    ).mockReturnValue({
      data: { id: 'did:pkh:eip155:5:0xc47a483494db8fe455ba29a53a7f75349dfc02ff' },
      status: 'success',
    });
  });

  it('should render edit page', async () => {
    expect(screen.getByRole('heading', { name: 'Avatar & Cover Image' })).toBeInTheDocument();
  });

  it('should initially have a disabled save button', async () => {
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
  });

  it('should have an enabled save button when name changes', async () => {
    const nameInput = screen.getByLabelText(/Name/i);

    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'Orion');
    await waitFor(() => expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled());
  });

  it('should show error when name contains illegal characters', async () => {
    const nameInput = screen.getByLabelText(/Name/i);

    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, '&**$$');
    await waitFor(() =>
      expect(
        screen.getByText('Name should contain only alphabets, numbers or -_.'),
      ).toBeInTheDocument(),
    );
  });

  it('should show error when name is less than 3 characters long', async () => {
    const nameInput = screen.getByLabelText(/Name/i);

    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'O');
    await waitFor(() =>
      expect(screen.getByText('Must be at least 3 characters')).toBeInTheDocument(),
    );
  });
});
