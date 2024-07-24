import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import routes, { MY_EXTENSIONS } from '../../../routes';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
// import ExtensionEditStep4Form from '@akashaorg/design-system-components/lib/components/ExtensionEditStep4Form';

export const ExtensionEditStep4Page: React.FC<unknown> = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('app-extensions');

  const [errorMessage, setErrorMessage] = useState(null);

  return (
    <Stack spacing="gap-y-4">
      <Text variant="h5" weight="semibold" align="center">
        {t('Review and Publish')}
      </Text>

      <Stack>
        {/* <ExtensionEditStep4Form
          errorMessage={errorMessage}
          cancelButton={{
            label: t('Cancel'),
            disabled: false,
            handleClick: () => {
              navigate({
                to: routes[MY_EXTENSIONS],
              });
            },
          }}
          nextButton={{
            label: t('Next'),

            handleClick: data => {
              //reset the previous error message
              setErrorMessage(null);
              navigate({
                to: routes[MY_EXTENSIONS],
              });
            },
          }}
        /> */}
      </Stack>
    </Stack>
  );
};
