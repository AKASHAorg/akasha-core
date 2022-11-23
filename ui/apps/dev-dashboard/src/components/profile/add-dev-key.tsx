import React from 'react';
import { useTranslation } from 'react-i18next';

import DS from '@akashaorg/design-system';
import { RootComponentProps } from '@akashaorg/typings/ui';
import {
  useAddDevKeyFromMessage,
  useGetLogin,
  useGetProfile,
  useValidateMessage,
} from '@akashaorg/ui-awf-hooks';

import CardTitle from './card-title';

import menuRoute, { DEV_KEYS } from '../../routes';
import DevMessageForm from './dev-message-form';

const { Box, HorizontalDivider, MainAreaCardBox } = DS;

interface IAddDevKeyCardProps {
  className?: string;
}

const AddDevKeyCard: React.FC<RootComponentProps & IAddDevKeyCardProps> = props => {
  const { className, plugins } = props;

  const navigateTo = plugins['@akashaorg/app-routing']?.routing.navigateTo;

  const { t } = useTranslation('app-dev-dashboard');

  const [messageName, setMessageName] = React.useState<string>('');
  const [message, setmessage] = React.useState<string>('');

  const loginQuery = useGetLogin();
  const loggedProfileQuery = useGetProfile(loginQuery.data?.pubKey);

  const validateMutation = useValidateMessage();
  const addKeyMutation = useAddDevKeyFromMessage();

  React.useEffect(() => {
    // add key after validating
    if (
      validateMutation.isSuccess &&
      validateMutation.data?.body?.aud === loggedProfileQuery.data?.pubKey
    ) {
      addKeyMutation.mutate({ message, messageName });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validateMutation.isSuccess]);

  React.useEffect(() => {
    if (addKeyMutation.isSuccess) {
      return navigateTo?.({
        appName: '@akashaorg/app-dev-dashboard',
        getNavigationUrl: () => menuRoute[DEV_KEYS],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addKeyMutation.isSuccess]);

  const handleClickCardTitleIcon = () => {
    navigateTo?.({
      appName: '@akashaorg/app-dev-dashboard',
      getNavigationUrl: () => menuRoute[DEV_KEYS],
    });
  };

  const handleMessageNameInputChange = ev => {
    setMessageName(ev.target.value);
  };

  const handleMessageInputChange = ev => {
    setmessage(ev.target.value);
  };

  const handleValidateMessage = () => {
    validateMutation.mutate(message);
  };

  return (
    <MainAreaCardBox className={className}>
      <CardTitle
        leftIcon={true}
        title={t('Add a New Dev Key')}
        onClickIcon={handleClickCardTitleIcon}
      />

      <HorizontalDivider />

      <Box pad="small">
        <DevMessageForm
          messageNameTitleLabel={t('Message name')}
          messageNameInputPlaceholder={t('Give your message a name (optional)')}
          messageNameValue={messageName}
          messageTitleLabel={t('Message')}
          messageInputPlaceholder={t('Paste the generated message here')}
          messageValue={message}
          validationStatus={{
            isError: validateMutation.isError,
            errorMessage: t('{{error}}', { error: validateMutation.error?.message || '' }),
          }}
          isFetching={validateMutation.isLoading || addKeyMutation.isLoading}
          buttonLabel={t('Validate Message')}
          onMessageNameInputChange={handleMessageNameInputChange}
          onMessageInputChange={handleMessageInputChange}
          onButtonClick={handleValidateMessage}
        />
      </Box>
    </MainAreaCardBox>
  );
};

export default AddDevKeyCard;
