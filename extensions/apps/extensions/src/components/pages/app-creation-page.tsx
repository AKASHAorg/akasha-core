import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import routes, { EXTENSIONS } from '../../routes';
import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import { useCreateAppMutation } from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import getSDK from '@akashaorg/awf-sdk';
import { NotificationEvents, NotificationTypes } from '@akashaorg/typings/lib/ui';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import AppCreationForm, {
  FieldName,
} from '@akashaorg/design-system-components/lib/components/AppCreationForm';

export const AppCreationPage: React.FC<unknown> = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('app-extensions');
  const { getRoutingPlugin, uiEvents } = useRootComponentProps();
  const navigateTo = getRoutingPlugin().navigateTo;
  const sdk = React.useRef(getSDK());
  const [errorMessage, setErrorMessage] = useState(null);

  const [createAppMutation, { loading }] = useCreateAppMutation({
    context: { source: sdk.current.services.gql.contextSources.composeDB },
  });

  return (
    <Card padding="py-4 px-0" margin="mb-2">
      <Stack spacing="gap-y-4">
        <Text variant="h5" weight="semibold" align="center">
          {t('Create an Extension')}
        </Text>
        <Divider />
        <Stack>
          <AppCreationForm
            errorMessage={errorMessage}
            cancelButton={{
              label: 'Cancel',
              disabled: false,
              handleClick: () => {
                // this one should navigate to My Extensions page, but since that
                //page is not available yet, it navigates to Extensions page for now
                navigate({
                  to: routes[EXTENSIONS],
                });
              },
            }}
            createButton={{
              label: 'Create',
              loading: loading,
              handleClick: data => {
                //reset the previous error message
                setErrorMessage(null);
                createAppMutation({
                  variables: {
                    i: {
                      content: {
                        applicationType: data?.extensionType.type,
                        createdAt: new Date().toISOString(),
                        description: '',
                        displayName: data?.extensionName,
                        license: '',
                        name: data?.extensionID,
                      },
                    },
                  },
                  onError: err => {
                    if (err.message.includes('Immutable field')) {
                      setErrorMessage({
                        fieldName: FieldName.extensionID,
                        message: 'You have created an app with this Extension ID. Try another ID.',
                      });
                    }
                  },
                  onCompleted: res => {
                    uiEvents.next({
                      event: NotificationEvents.ShowNotification,
                      data: {
                        type: NotificationTypes.Success,
                        message: t('Extension created successfully!'),
                      },
                    });
                    // this one should navigate to My Extensions page, but since that
                    //page is not available yet, it navigates to Extensions page for now
                    navigate({
                      to: routes[EXTENSIONS],
                    });
                  },
                });
              },
            }}
          />
        </Stack>
      </Stack>
    </Card>
  );
};
