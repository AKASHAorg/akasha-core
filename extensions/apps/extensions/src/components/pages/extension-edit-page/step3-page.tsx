import React, { useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import ExtensionEditStep3Form from '@akashaorg/design-system-components/lib/components/ExtensionEditStep3Form';
import { useAkashaStore, useMentions } from '@akashaorg/ui-awf-hooks';
import { transformSource } from '@akashaorg/ui-awf-hooks';
import { CONTACT_INFO, DRAFT_EXTENSIONS } from '../../../constants';
import { Extension } from '@akashaorg/typings/lib/ui';
import { useAtom } from 'jotai';
import { AtomContext, FormData } from './main-page';

type ExtensionEditStep3PageProps = {
  extensionId: string;
};

export const ExtensionEditStep3Page: React.FC<ExtensionEditStep3PageProps> = ({ extensionId }) => {
  const navigate = useNavigate();
  const { t } = useTranslation('app-extensions');

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

  const [, setForm] = useAtom<FormData>(useContext(AtomContext));

  const formDefault = useMemo(() => {
    return {
      license: defaultValues.license,
      contributors: defaultValues.contributors,
      contactInfo: defaultValues.contactInfo,
    };
  }, [defaultValues]);

  const { setMentionQuery, mentions, allFollowing } = useMentions(authenticatedDID);
  const handleGetMentions = (query: string) => {
    setMentionQuery(query);
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
          label: t('Next'),
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
            setForm(prev => {
              return {
                ...prev,
                ...step3Data,
                lastCompletedStep:
                  !formValue.lastCompletedStep || formValue.lastCompletedStep < 3
                    ? 3
                    : formValue.lastCompletedStep,
              };
            });
            navigate({
              to: '/edit-extension/$extensionId/step4',
            });
          },
        }}
      />
    </Stack>
  );
};
