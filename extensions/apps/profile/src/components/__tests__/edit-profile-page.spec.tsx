import React from 'react';
import EditProfilePage from '../pages/edit-profile';
import userEvent from '@testing-library/user-event';
import { screen, renderWithAllProviders, genAppProps } from '@akashaorg/af-testing';
import { AnalyticsProvider } from '@akashaorg/ui-awf-hooks/lib/use-analytics';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { InMemoryCache } from '@apollo/client';
import { APOLLO_TYPE_POLICIES, NEW_PROFILE, PROFILE_DID } from '../__mocks__/constants';
import { getEmptyProfileMock, getProfileInfoMocks } from '../__mocks__/get-profile-info-mocks';
import { getEditProfileMocks } from '../__mocks__/get-edit-profile-mocks';

const baseComponent = (
  mocks: Readonly<MockedResponse<unknown, unknown>[]> | undefined,
  profileDID?: string,
) => (
  <MockedProvider mocks={mocks} cache={new InMemoryCache(APOLLO_TYPE_POLICIES)}>
    <AnalyticsProvider {...genAppProps()}>
      <EditProfilePage profileDID={profileDID ?? PROFILE_DID} />
    </AnalyticsProvider>
  </MockedProvider>
);

describe('< EditProfilePage /> component', () => {
  describe('should render edit profile page', () => {
    it('should display form with pre-filled profile information', async () => {
      const { mocks, profileData } = getProfileInfoMocks({ profileDID: PROFILE_DID });
      const { name, description, avatar, background, links } = profileData.akashaProfile;
      renderWithAllProviders(baseComponent(mocks), {});
      expect(await screen.findByLabelText(/name/i)).toHaveValue(name);
      expect(screen.getByLabelText(/bio/i)).toHaveValue(description);
      expect(screen.getByTestId('avatar-source')).toHaveAttribute('srcset', avatar.default.src);
      expect(screen.getByTestId('cover-image')).toHaveStyle(
        `background-image: url(${background.default.src})`,
      );
      links?.forEach(link => {
        expect(screen.getByDisplayValue(link.href)).toBeInTheDocument();
      });
      expect(await screen.findByRole('button', { name: 'avatar' })).toBeInTheDocument();
      expect(await screen.findByRole('button', { name: 'cover-image' })).toBeInTheDocument();
      expect(screen.getByLabelText('toggle')).not.toBeChecked();
      expect(screen.getByLabelText('toggle')).toBeEnabled();
      expect(screen.getByRole('button', { name: /cancel/i })).toBeEnabled();
      expect(screen.getByRole('button', { name: /save/i })).toBeDisabled();
    });

    it('should render a checked and disabled NSFW checkbox for a profile flagged as NSFW', async () => {
      const { mocks } = getProfileInfoMocks({ profileDID: PROFILE_DID, nsfw: true });
      renderWithAllProviders(baseComponent(mocks), {});
      expect(await screen.findByLabelText('toggle')).toBeChecked();
      expect(screen.getByLabelText('toggle')).toBeDisabled();
    });

    it('should display avatar image menu options', async () => {
      const user = userEvent.setup();
      const { mocks } = getProfileInfoMocks({ profileDID: PROFILE_DID });
      renderWithAllProviders(baseComponent(mocks), {});
      await user.click(await screen.findByRole('button', { name: 'avatar' }));
      expect(screen.getByText(/upload/i)).toBeInTheDocument();
      expect(screen.getByText(/edit/i)).toBeInTheDocument();
      expect(screen.getByText(/delete/i)).toBeInTheDocument();
    });

    it('should display cover image menu options', async () => {
      const user = userEvent.setup();
      const { mocks } = getProfileInfoMocks({ profileDID: PROFILE_DID });
      renderWithAllProviders(baseComponent(mocks), {});
      await user.click(await screen.findByRole('button', { name: 'cover-image' }));
      expect(screen.getByText(/upload/i)).toBeInTheDocument();
      expect(screen.getByText(/edit/i)).toBeInTheDocument();
      expect(screen.getByText(/delete/i)).toBeInTheDocument();
    });
  });

  describe('should create profile', () => {
    const emptyProfileMock = getEmptyProfileMock(PROFILE_DID);
    it('should submit form when proper name is provided', async () => {
      const user = userEvent.setup();
      const { mocks: editProfileMocks } = getEditProfileMocks({ profileDID: PROFILE_DID });
      renderWithAllProviders(baseComponent([...emptyProfileMock, ...editProfileMocks]), {});
      expect(await screen.findByRole('button', { name: /save/i })).toBeDisabled();
      await user.type(screen.getByLabelText(/name/i), NEW_PROFILE.name);
      expect(screen.getByTestId('edit-profile')).toHaveFormValues({ name: NEW_PROFILE.name });
      await user.click(screen.getByRole('button', { name: /save/i }));
    });

    it('should show error if name is less 3 characters long', async () => {
      const user = userEvent.setup();
      renderWithAllProviders(baseComponent(emptyProfileMock), {});
      await user.type(await screen.findByLabelText(/name/i), 'co');
      expect(screen.getByText(/must be at least 3 characters/i)).toBeInTheDocument();
    });

    it('should submit all form fields', async () => {
      const user = userEvent.setup();
      const { mocks: editProfileMocks } = getEditProfileMocks({ profileDID: PROFILE_DID });
      renderWithAllProviders(baseComponent([...emptyProfileMock, ...editProfileMocks]), {});
      expect(await screen.findByRole('button', { name: /save/i })).toBeDisabled();
      await user.type(screen.getByLabelText(/name/i), NEW_PROFILE.name);
      await user.type(screen.getByLabelText(/bio/i), NEW_PROFILE.bio);
      await user.click(screen.getByRole('button', { name: /add new/i }));
      await user.type(screen.getByRole('textbox', { name: 'link.0' }), NEW_PROFILE.link);
      await user.click(screen.getByLabelText('toggle'));
      expect(screen.getByTestId('edit-profile')).toHaveFormValues({
        name: NEW_PROFILE.name,
        bio: NEW_PROFILE.bio,
        'links.0.href': NEW_PROFILE.link,
        nsfw: true,
      });
      await user.click(screen.getByRole('button', { name: /save/i }));
    });

    it('should show or hide error based on URL field validity', async () => {
      const user = userEvent.setup();
      renderWithAllProviders(baseComponent(emptyProfileMock), {});
      await user.click(await screen.findByRole('button', { name: /add new/i }));
      await user.type(screen.getByRole('textbox', { name: 'link.0' }), 'htt');
      expect(screen.getByText(/hmm this doesn't look like a URL 🤔/i)).toBeInTheDocument();
      await user.type(
        screen.getByRole('textbox', { name: 'link.0' }),
        '{backspace}{backspace}{backspace}',
      );
      expect(screen.queryByText(/hmm this doesn't look like a URL 🤔/i)).not.toBeInTheDocument();
    });

    it('should enable save button on bio change', async () => {
      const user = userEvent.setup();
      const { mocks } = getProfileInfoMocks({ profileDID: PROFILE_DID });
      renderWithAllProviders(baseComponent(mocks), {});
      expect(await screen.findByRole('button', { name: /save/i })).toBeDisabled();
      await user.type(screen.getByLabelText(/bio/i), NEW_PROFILE.bio);
      expect(await screen.findByRole('button', { name: /save/i })).toBeEnabled();
    });

    it('should enable save button on valid link change', async () => {
      const user = userEvent.setup();
      const { mocks } = getProfileInfoMocks({ profileDID: PROFILE_DID });
      renderWithAllProviders(baseComponent(mocks), {});
      expect(await screen.findByRole('button', { name: /save/i })).toBeDisabled();
      await user.click(screen.getByRole('button', { name: /add new/i }));
      await user.type(screen.getByRole('textbox', { name: 'link.0' }), NEW_PROFILE.link);
      expect(await screen.findByRole('button', { name: /save/i })).toBeEnabled();
    });

    it('should enable save button on NSFW toggle', async () => {
      const user = userEvent.setup();
      const { mocks } = getProfileInfoMocks({ profileDID: PROFILE_DID });
      renderWithAllProviders(baseComponent(mocks), {});
      expect(await screen.findByRole('button', { name: /save/i })).toBeDisabled();
      await user.click(screen.getByLabelText('toggle'));
      expect(await screen.findByRole('button', { name: /save/i })).toBeEnabled();
    });
  });
});
