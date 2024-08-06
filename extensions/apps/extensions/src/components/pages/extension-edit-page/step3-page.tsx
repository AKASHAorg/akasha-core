import React, { useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Spinner from '@akashaorg/design-system-core/lib/components/Spinner';
import ExtensionEditStep3Form from '@akashaorg/design-system-components/lib/components/ExtensionEditStep3Form';
import { hasOwn, useAkashaStore, useMentions } from '@akashaorg/ui-awf-hooks';
import { useAtom } from 'jotai';
import { useGetAppsByIdQuery } from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import { AtomContext, FormData } from './main-page';
import { transformSource } from '@akashaorg/ui-awf-hooks';

type ExtensionEditStep3PageProps = {
  extensionId: string;
};

export const ExtensionEditStep3Page: React.FC<ExtensionEditStep3PageProps> = ({ extensionId }) => {
  const navigate = useNavigate();
  const { t } = useTranslation('app-extensions');

  const [errorMessage, setErrorMessage] = useState(null);

  const {
    data: { authenticatedDID },
  } = useAkashaStore();

  const {
    data: appsByIdReq,
    error,
    loading,
  } = useGetAppsByIdQuery({
    variables: {
      id: extensionId,
    },
    skip: !authenticatedDID,
  });

  const appData = useMemo(() => {
    return appsByIdReq?.node && hasOwn(appsByIdReq?.node, 'id') ? appsByIdReq?.node : null;
  }, [appsByIdReq]);

  const [formValue, setForm] = useAtom<FormData>(useContext(AtomContext));

  const defaultValues = useMemo(() => {
    return formValue.lastCompletedStep > 1
      ? {
          ...formValue,
          contactInfo: formValue.links.map(elem => {
            if (elem.label === `${extensionId}-contactInfo`) {
              return elem.href;
            }
          }),
        }
      : {
          ...appData,
          contactInfo: [],
          //   contactInfo: appData.links.map(elem => {
          //     if (elem.label === `${extensionId}-contactInfo`) {
          //       return elem.href;
          //     }
          //   }),
          contributors: appData?.contributors?.map(profile => profile.akashaProfile?.did?.id) || [],
        };
  }, [appData]);

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
      <Stack align="center" justify="center">
        {loading && <Spinner />}
      </Stack>
      {!loading && (
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
          errorMessage={errorMessage}
          handleGetContributors={handleGetMentions}
          contributors={mentions}
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
              //reset the previous error message
              setErrorMessage(null);
              const step3Data = {
                ...data,
                links: [
                  ...formValue.links,
                  ...data.contactInfo.map(info => {
                    return {
                      label: `${extensionId}-contactInfo`,
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
      )}
    </Stack>
  );
};
