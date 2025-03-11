import React, { ChangeEvent, useContext, useEffect, useMemo, useState } from 'react';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import {
  AkashaProfile,
  Extension,
  NotificationEvents,
  NotificationTypes,
} from '@akashaorg/typings/lib/ui';
import SearchBar from '@akashaorg/design-system-components/lib/components/SearchBar';
import { useCloseActions } from '@akashaorg/design-system-core/lib/utils';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import Spinner from '@akashaorg/design-system-core/lib/components/Spinner';
import ProfileAvatarButton from '@akashaorg/design-system-core/lib/components/ProfileAvatarButton';
import { CheckIcon, ExclamationTriangleIcon, TrashIcon } from '@heroicons/react/24/outline';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import {
  transformSource,
  useAkashaStore,
  useMentions,
  useProfilesList,
  useRootComponentProps,
} from '@akashaorg/ui-core-hooks';
import { useTranslation } from 'react-i18next';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import { useNavigate } from '@tanstack/react-router';
import { AtomContext } from './main-page';
import { useAtom } from 'jotai';
import { DRAFT_EXTENSIONS, MAX_CONTRIBUTORS } from '../../../constants';
import {
  ErrorLoader,
  ErrorLoaderDescription,
  ErrorLoaderTitle,
} from '@akashaorg/ui/lib/akasha-components/error-loader';

export type ExtensionEditContributorsPageProps = {
  extensionId: string;
};

export const ExtensionEditContributorsPage: React.FC<ExtensionEditContributorsPageProps> = ({
  extensionId,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation('app-extensions');

  const { uiEvents } = useRootComponentProps();
  const uiEventsRef = React.useRef(uiEvents);

  const {
    data: { authenticatedDID },
  } = useAkashaStore();

  const showNotification = React.useCallback(
    (type: NotificationTypes, title: string, description?: string) => {
      uiEventsRef.current.next({
        event: NotificationEvents.ShowNotification,
        data: {
          type,
          title,
          description,
        },
      });
    },
    [],
  );

  const formValue = useMemo(() => {
    try {
      return JSON.parse(sessionStorage.getItem(extensionId)) || {};
    } catch (error) {
      showNotification(NotificationTypes.Error, error);
    }
  }, [extensionId, showNotification]);

  // fetch the draft extensions that are saved only on local storage
  const draftExtensions: Extension[] = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem(`${DRAFT_EXTENSIONS}-${authenticatedDID}`)) || [];
    } catch (error) {
      showNotification(NotificationTypes.Error, error);
    }
  }, [authenticatedDID, showNotification]);

  const extensionData = draftExtensions.find(draftExtension => draftExtension.id === extensionId);

  const [showSuggestions, setShowSuggestions] = useState(false);
  const autoCompleteRef = useCloseActions(() => {
    setShowSuggestions(false);
  });

  const [searchValue, setSearchValue] = useState('');
  const [addedContributors, setAddedContributors] = useState([]);

  const defaultContributorsDIDs = useMemo(() => {
    return formValue.lastCompletedStep > 2 ? formValue?.contributors : extensionData?.contributors;
  }, [extensionData, formValue]);

  // fetch the contributors profiles
  const { profilesData, loading, error } = useProfilesList(defaultContributorsDIDs);

  // hydrate the list of added contributors with profiles
  useEffect(() => {
    if (profilesData.length > 0) {
      setAddedContributors(profilesData);
    }
  }, [profilesData]);

  // contributors are a set of profiles for which the user is following and the profile is also
  // following the user, same as for mentions, that's why the same hook can be used
  const { setMentionQuery, mentions: contributors } = useMentions(authenticatedDID);
  const handleGetContributors = (query: string) => {
    setMentionQuery(query);
  };

  const handleChange = (ev: ChangeEvent<HTMLInputElement>) => {
    const query = ev.currentTarget.value;
    setSearchValue(query);
    handleGetContributors(query);
    setShowSuggestions(true);
  };

  const handleAddContributor = (profile: AkashaProfile) => {
    if (addedContributors?.length < MAX_CONTRIBUTORS) {
      setAddedContributors(prev => {
        const res = Array.from(new Set([profile, ...prev]));
        return res;
      });
      setSearchValue('');
      setShowSuggestions(false);
    }
  };

  const handleRemoveContributor = (profile: AkashaProfile) => {
    setAddedContributors(prev => prev.filter(addedProfile => profile.id !== addedProfile?.id));
  };

  const handleNavigateBack = () => {
    navigate({
      to: '/edit-extension/$extensionId/step3',
    });
  };

  const [, setForm] = useAtom<FormData>(useContext(AtomContext));

  const handleSave = () => {
    setForm(prev => {
      return {
        ...prev,
        // save only the DIDs of the contributors
        contributors: addedContributors.map(contribProfile => contribProfile?.did?.id),
      };
    });
    navigate({
      to: '/edit-extension/$extensionId/step3',
    });
  };

  return (
    <Stack className="p-0 max-h-100vh min-h-100vh md:min-h-[566px]">
      <Stack
        direction="row"
        spacing={2}
        justifyContent="center"
        alignItems="center"
        className="p-4"
      >
        <Text variant="h6">{t('Add Contributors')}</Text>
      </Stack>
      <Divider />
      <Stack direction="column" spacing={6} className="p-4 overflow-auto grow">
        <Stack spacing={1} direction="column">
          <Text variant="body2" color={{ light: 'grey4', dark: 'grey6' }} weight="light">
            {t('Add anyone who contributed to the creation of this extension.')}
          </Text>
        </Stack>
        <Stack direction="column" justifyContent="center" spacing={2} ref={autoCompleteRef}>
          <SearchBar
            inputPlaceholderLabel={t('Search for a contributor')}
            fullWidth
            inputValue={searchValue}
            onInputChange={handleChange}
            onFocus={() => setShowSuggestions(true)}
          />
          {addedContributors?.length === MAX_CONTRIBUTORS && (
            <Stack direction="row" spacing={2}>
              <Icon
                icon={<ExclamationTriangleIcon />}
                size="sm"
                color={{ light: 'warningLight', dark: 'warningDark' }}
              />
              <Text
                variant="body2"
                color={{ light: 'warningLight', dark: 'warningDark' }}
                weight="light"
              >
                {t('You reached the 16 contributors limit.')}
              </Text>
            </Stack>
          )}
          {showSuggestions && searchValue?.length > 1 && (
            <Stack direction="row" className="relative z-10">
              <Card className="p-0 absolute max-h-96 w-full overflow-y-auto scrollbar">
                {contributors?.length === 0 && (
                  <Stack spacing={2} className="p-4">
                    <Text variant="body2" weight="bold" color={{ light: 'grey4', dark: 'grey6' }}>
                      {t('No matches found.')}
                    </Text>
                    <Text variant="body2" color={{ light: 'grey4', dark: 'grey6' }}>
                      {t('To add a user as a contributor, you should follow each other.')}
                    </Text>
                  </Stack>
                )}
                {contributors?.length > 0 && (
                  <Stack direction="column" spacing={2}>
                    {contributors?.map((profile, index) => (
                      <button key={index} onClick={() => handleAddContributor(profile)}>
                        <Stack
                          direction="row"
                          justifyContent="between"
                          alignItems="center"
                          className="p-4 hover:bg-secondary"
                        >
                          <ProfileAvatarButton
                            profileId={profile?.did?.id}
                            label={profile?.name}
                            avatar={transformSource(profile?.avatar?.default)}
                            alternativeAvatars={profile?.avatar?.alternatives?.map(alternative =>
                              transformSource(alternative),
                            )}
                          />
                          {addedContributors?.some(
                            contrib => contrib?.did?.id === profile?.did?.id,
                          ) && <Icon icon={<CheckIcon />} accentColor />}
                        </Stack>
                      </button>
                    ))}
                  </Stack>
                )}
              </Card>
            </Stack>
          )}
        </Stack>
        <Stack spacing={4}>
          <Stack direction="row" justifyContent="between">
            <Text variant="h6" weight="bold">
              {t('Extension Contributors')}
            </Text>
            {loading && (
              <Stack alignItems="center" justifyContent="center">
                <Spinner />
              </Stack>
            )}
            {error && (
              <Stack>
                <ErrorLoader type="script-error">
                  <ErrorLoaderTitle>
                    {t('There was an error loading the contributors')}
                  </ErrorLoaderTitle>
                  <ErrorLoaderDescription>{error.message}</ErrorLoaderDescription>
                </ErrorLoader>
              </Stack>
            )}
            {addedContributors?.length > 0 && (
              <Stack direction="row">
                <Text
                  variant="footnotes2"
                  color={{ light: 'secondaryLight', dark: 'secondaryDark' }}
                  weight="light"
                >
                  {addedContributors.length}
                </Text>
                <Text variant="footnotes2" color={{ light: 'grey4', dark: 'grey6' }} weight="light">
                  {`/${MAX_CONTRIBUTORS}`}
                </Text>
              </Stack>
            )}
          </Stack>
          {addedContributors?.length === 0 && (
            <Text variant="body2" color={{ light: 'grey4', dark: 'grey6' }} weight="light">
              {t('You haven’t added any contributors yet.')}
            </Text>
          )}
          {addedContributors?.length > 0 && (
            <Stack direction="column" spacing={4}>
              {addedContributors?.map((profile, index) => (
                <Stack
                  key={index}
                  direction="row"
                  justifyContent="between"
                  alignItems="center"
                  spacing={2}
                >
                  <ProfileAvatarButton
                    profileId={profile?.did?.id}
                    label={profile?.name}
                    avatar={transformSource(profile?.avatar?.default)}
                    alternativeAvatars={profile?.avatar?.alternatives?.map(alternative =>
                      transformSource(alternative),
                    )}
                  />
                  <button onClick={() => handleRemoveContributor(profile)}>
                    <Icon
                      icon={<TrashIcon />}
                      solid={false}
                      size="md"
                      color={{ light: 'errorLight', dark: 'errorDark' }}
                    />
                  </button>
                </Stack>
              ))}
            </Stack>
          )}
        </Stack>
      </Stack>
      <Divider />
      <Stack direction="row" alignItems="center" justifyContent="end" spacing={4} className="p-4">
        <Button variant="link" onClick={handleNavigateBack}>
          {t('Cancel')}
        </Button>
        <Button onClick={handleSave} disabled={addedContributors?.length === 0}>
          {t('Save')}
        </Button>
      </Stack>
    </Stack>
  );
};
