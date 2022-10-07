import React from 'react';
import { useTranslation } from 'react-i18next';

import DS from '@akashaorg/design-system';
import { RootComponentProps, StepStatus } from '@akashaorg/typings/ui';
import {
  useAddDevKeyFromMessage,
  useGetLogin,
  useGetProfile,
  useValidateMessage,
} from '@akashaorg/ui-awf-hooks';

import CardTitle from './card-title';

import menuRoute, { DEV_KEYS } from '../../../routes';
import DevMessageForm from './dev-message-form';

const { Box, HorizontalDivider, MainAreaCardBox } = DS;

interface IAddDevKeyCardProps {
  className?: string;
}

const AddDevKeyCard: React.FC<RootComponentProps & IAddDevKeyCardProps> = props => {
  const { className, plugins } = props;

  const [messageName, setMessageName] = React.useState<string>('');
  const [message, setmessage] = React.useState<string>('');
  const [status, setStatus] = React.useState<StepStatus | null>(null);

  const loginQuery = useGetLogin();
  const loggedProfileQuery = useGetProfile(loginQuery.data?.pubKey);
  const { t } = useTranslation('app-profile');

  const validateQuery = useValidateMessage(message, status === StepStatus.VALIDATING);

  const addKeyQuery = useAddDevKeyFromMessage(
    { message, messageName },
    status === StepStatus.ADDING_KEY,
  );

  React.useEffect(() => {
    // add key after validating
    if (
      validateQuery.isSuccess &&
      validateQuery.data?.body?.aud === loggedProfileQuery.data?.pubKey
    ) {
      setStatus(StepStatus.ADDING_KEY);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validateQuery.data]);

  React.useEffect(() => {
    if (addKeyQuery.isSuccess) {
      setStatus(null);
    }
  }, [addKeyQuery.isSuccess]);

  const handleClickCardTitleIcon = () => {
    plugins['@akashaorg/app-routing']?.routing.navigateTo({
      appName: '@akashaorg/app-profile',
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
    setStatus(StepStatus.VALIDATING);
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
            isError: validateQuery.isError,
            errorMessage: t('{{error}}', { error: validateQuery.error?.message }),
          }}
          isFetching={validateQuery.isFetching || addKeyQuery.isFetching}
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
