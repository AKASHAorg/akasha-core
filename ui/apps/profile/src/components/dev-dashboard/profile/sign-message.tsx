import React from 'react';
import { useTranslation } from 'react-i18next';

import DS from '@akashaorg/design-system';
import { useSignMessage } from '@akashaorg/ui-awf-hooks';
import { RootComponentProps } from '@akashaorg/typings/ui';

import CardTitle from './card-title';

import menuRoute, { DEV_DASHBOARD } from '../../../routes';

import { StyledTextArea } from './dev-message-form';

const { Box, Button, HorizontalDivider, MainAreaCardBox, Spinner, Text } = DS;

interface ISignMessageCardProps {
  className?: string;
  messageTitleLabel: string;
  messageInputPlaceholder: string;
  buttonLabel: string;
}

const SignMessageCard: React.FC<RootComponentProps & ISignMessageCardProps> = props => {
  const { className, messageTitleLabel, messageInputPlaceholder, buttonLabel, plugins } = props;

  const [message, setMessage] = React.useState<string>('');

  const signMessageMutation = useSignMessage();

  const { t } = useTranslation('app-profile');

  const handleClickCardTitleIcon = () => {
    plugins['@akashaorg/app-routing']?.routing.navigateTo({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: () => menuRoute[DEV_DASHBOARD],
    });
  };

  const handleMessageInputChange = ev => {
    setMessage(ev.target.value);
  };

  const handleSignMessage = () => {
    signMessageMutation.mutate(message);
  };

  return (
    <MainAreaCardBox className={className}>
      <CardTitle
        leftIcon={true}
        title={t('Sign a Message')}
        onClickIcon={handleClickCardTitleIcon}
      />

      <HorizontalDivider />

      <Box gap="large" pad="small" margin={{ top: 'medium' }}>
        <Box gap="xsmall">
          <Text size="medium" weight="bold" style={{ textTransform: 'uppercase' }}>
            {messageTitleLabel}
          </Text>
          <Box
            fill="horizontal"
            pad={{ vertical: 'xsmall', horizontal: 'small' }}
            round="xxsmall"
            elevation="shadow"
            border={{
              side: 'all',
              color: signMessageMutation.isError
                ? 'errorText'
                : message.length
                ? 'accent'
                : 'border',
            }}
          >
            <StyledTextArea
              resize={false}
              size="large"
              rows={8}
              style={{ padding: 0 }}
              value={message}
              onChange={handleMessageInputChange}
              placeholder={messageInputPlaceholder}
            />
          </Box>
          {signMessageMutation.isError && (
            <Text size="small" color="errorText">
              {signMessageMutation.error}
            </Text>
          )}
        </Box>

        <Box direction="row" justify="end" gap="small">
          <Button
            primary={true}
            disabled={signMessageMutation.isLoading || !message.length}
            label={signMessageMutation.isLoading ? <Spinner /> : buttonLabel}
            onClick={handleSignMessage}
          />
        </Box>
      </Box>
    </MainAreaCardBox>
  );
};

export default SignMessageCard;
