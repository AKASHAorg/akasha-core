import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import ExtensionEditStep3Form from '@akashaorg/design-system-components/lib/components/ExtensionEditStep3Form';
import { useAkashaStore, useMentions, useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import { transformSource } from '@akashaorg/ui-awf-hooks';
import { CONTACT_INFO, DRAFT_EXTENSIONS } from '../../../constants';
import { Extension, NotificationEvents, NotificationTypes } from '@akashaorg/typings/lib/ui';

type ExtensionEditStep3PageProps = {
  extensionId: string;
};

export const ExtensionEditStep3Page: React.FC<ExtensionEditStep3PageProps> = ({ extensionId }) => {
  const navigate = useNavigate();
  const { t } = useTranslation('app-extensions');
  const { uiEvents } = useRootComponentProps();

  const {
    data: { authenticatedDID },
  } = useAkashaStore();

  const draftExtensions: Extension[] = useMemo(
    () => JSON.parse(localStorage.getItem(`${DRAFT_EXTENSIONS}-${authenticatedDID}`)) || [],
    [authenticatedDID],
  );
  const extensionData = draftExtensions.find(draftExtension => draftExtension.id === extensionId);

  const formValue = useMemo(
    () => JSON.parse(sessionStorage.getItem(extensionId)) || {},
    [extensionId],
  );

  const defaultValues = useMemo(() => {
    return formValue.lastCompletedStep > 2
      ? {
          ...formValue,
          contactInfo: formValue?.links
            ?.map(elem => {
              if (elem.label === `${extensionId}-${CONTACT_INFO}`) {
                return elem.href;
              }
            })
            .filter(link => link),
        }
      : {
          ...extensionData,
          contactInfo: extensionData?.links
            ?.map(elem => {
              if (elem.label === `${extensionId}-${CONTACT_INFO}`) {
                return elem.href;
              }
            })
            .filter(link => link),
        };
  }, [extensionData, formValue, extensionId]);

  const formDefault = useMemo(() => {
    return {
      license: defaultValues.license,
      contributors: defaultValues.contributors,
      contactInfo: defaultValues.contactInfo,
      keywords: defaultValues.keywords,
    };
  }, [defaultValues]);

  const { setMentionQuery, mentions, allFollowing } = useMentions(authenticatedDID);
  const handleGetMentions = (query: string) => {
    setMentionQuery(query);
  };

  const handleUpdateExtension = step3Data => {
    const newDraftExtensions = draftExtensions.map(oldDraftExt =>
      oldDraftExt.id === extensionId ? { ...oldDraftExt, ...formValue, ...step3Data } : oldDraftExt,
    );
    localStorage.setItem(
      `${DRAFT_EXTENSIONS}-${authenticatedDID}`,
      JSON.stringify(newDraftExtensions),
    );
    sessionStorage.removeItem(extensionId);
    uiEvents.next({
      event: NotificationEvents.ShowNotification,
      data: {
        type: NotificationTypes.Success,
        title: t('Extension Info Updated'),
        description: t('{{extensionName}} updated succesfully', { extensionName: formValue.name }),
      },
    });
    navigate({
      to: '/my-extensions',
    });
  };

  return (
    <Stack spacing="gap-y-4">
      <Stack padding={16}>
        <Text variant="h5" weight="semibold" align="center">
          {t('Present your Extension')}
        </Text>
      </Stack>
      <ExtensionEditStep3Form
        addLabel={t('Add')}
        licenseFieldLabel={t('License')}
        licenseOtherPlaceholderLabel={t('Please specify your license type')}
        collaboratorsFieldLabel={t('Collaborators')}
        collaboratorsDescriptionLabel={t('Add people who helped you create the extension')}
        collaboratorsSearchPlaceholderLabel={t('Search for a contributor')}
        extensionContributorsLabel={t('Extension Contributors')}
        contactInfoFieldLabel={t('Contact Info')}
        contactInfoDescriptionLabel={t(
          'Add your contact information here for users to contact you about questions or suggestions',
        )}
        contactInfoPlaceholderLabel={t('Contact url/email')}
        tagsLabel={t('Tags')}
        tagsDescriptionLabel={t('Adding tags increases your extensions discoverability.')}
        addTagsPlaceholderLabel={t('Type a tag and press space, comma or enter')}
        tagsAddedLabel={t('tags added')}
        noteLabel={t('Important note')}
        noteDescriptionLabel={t(
          'Extensions that are saved locally will be lost if cache is cleared or if accessed from a different device.',
        )}
        defaultValues={formDefault}
        handleGetFollowingProfiles={handleGetMentions}
        followingProfiles={mentions}
        allFollowingProfiles={allFollowing}
        transformSource={transformSource}
        cancelButton={{
          label: t('Back'),
          disabled: false,
          handleClick: () => {
            navigate({
              to: '/edit-extension/$extensionId/step2',
            });
          },
        }}
        nextButton={{
          label: t('Save'),
          handleClick: data => {
            const step3Data = {
              ...data,
              links: [
                // remove the old contact info data from links
                ...formValue.links.filter(link => link.label !== `${extensionId}-${CONTACT_INFO}`),
                // add latest contact info
                ...data.contactInfo.map(info => {
                  return {
                    label: `${extensionId}-${CONTACT_INFO}`,
                    href: info,
                  };
                }),
              ],
            };
            handleUpdateExtension(step3Data);
          },
        }}
      />
    </Stack>
  );
};
