import React from 'react';
import { useTranslation } from 'react-i18next';

import DS from '@akashaorg/design-system';
import { RootComponentProps } from '@akashaorg/typings/ui';

import CardTitle from './card-title';

import menuRoute, { DEV_KEYS } from '../../routes';
import DevMessageForm from './dev-message-form';

const { Box, HorizontalDivider, MainAreaCardBox } = DS;

interface IEditMessageNameProps {
  className?: string;
}

const EditMessageName: React.FC<RootComponentProps & IEditMessageNameProps> = props => {
  const { className, plugins } = props;

  const navigateTo = plugins['@akashaorg/app-routing']?.routing.navigateTo;

  const { t } = useTranslation('app-profile');

  const [messageName] = React.useState<string>('');
  const [message] = React.useState<string>('');

  const handleClickCardTitleIcon = () => {
    navigateTo?.({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: () => menuRoute[DEV_KEYS],
    });
  };

  const handleButtonClick = () => {
    /** */
  };

  return (
    <MainAreaCardBox className={className}>
      <CardTitle
        leftIcon={true}
        title={t('Edit Message Name')}
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
          canEditMessage={false}
          validationStatus={{
            isError: false,
            extraInfo: t('Messages cannot be edited, but you can delete them and add a new one.'),
          }}
          isFetching={false}
          buttonLabel={t('Save')}
          onMessageNameInputChange={() => null}
          onMessageInputChange={() => null}
          onButtonClick={handleButtonClick}
        />
      </Box>
    </MainAreaCardBox>
  );
};

export default EditMessageName;
