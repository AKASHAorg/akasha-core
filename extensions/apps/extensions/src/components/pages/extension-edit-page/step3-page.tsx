import React, { useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import ExtensionEditStep3Form from '@akashaorg/design-system-components/lib/components/ExtensionEditStep3Form';
import { useAkashaStore, useMentions } from '@akashaorg/ui-awf-hooks';
import { useAtom } from 'jotai';
import { AtomContext, FormData } from './main-page';
import { transformSource } from '@akashaorg/ui-awf-hooks';
import { CONTACT_INFO, DRAFT_EXTENSIONS } from '../../../constants';
import { Extension } from '@akashaorg/typings/lib/ui';

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

  const [formValue, setForm] = useAtom<FormData>(useContext(AtomContext));

  const defaultValues = useMemo(() => {
    return formValue.lastCompletedStep > 1
      ? {
          ...formValue,
          contactInfo: formValue?.links.map(elem => {
            if (elem.label === `${extensionId}-${CONTACT_INFO}`) {
              return elem.href;
            }
          }),
        }
      : {
          ...extensionData,
          contactInfo: extensionData?.links.map(elem => {
            if (elem.label === `${extensionId}-${CONTACT_INFO}`) {
              return elem.href;
            }
          }),
        };
  }, [extensionData, formValue, extensionId]);

  const { setMentionQuery, mentions } = useMentions(authenticatedDID);
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
        collaboratorsFieldLabel={t('Collaborators')}
        collaboratorsDescriptionLabel={t('Add people who helped you create the extension')}
        collaboratorsSearchPlaceholderLabel={t('Search for a contributor')}
        extensionContributorsLabel={t('Extension Contributors')}
        contactInfoFieldLabel={t('Contact Info')}
        contactInfoDescriptionLabel={t(
          'Add your contact information here for users to contact you about questions or suggestions',
        )}
        contactInfoPlaceholderLabel={t('Contact url/email')}
        defaultValues={defaultValues}
        handleGetFollowingProfiles={handleGetMentions}
        followingProfiles={mentions}
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
              return { ...prev, ...step3Data, lastCompletedStep: 3 };
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
