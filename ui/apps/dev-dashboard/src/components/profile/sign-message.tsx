import React from 'react';
import { useTranslation } from 'react-i18next';

import DS from '@akashaorg/design-system';
import { useSignMessage } from '@akashaorg/ui-awf-hooks';
import { RootComponentProps } from '@akashaorg/typings/ui';

import CardTitle from './card-title';
import SummaryCard, { ISummaryCardProps } from './summary-card';

import menuRoute, { DASHBOARD } from '../../routes';

const { Box, Button, HorizontalDivider, MainAreaCardBox, Spinner, Text } = DS;

interface ISignMessageCardProps extends ISummaryCardProps {
  className?: string;
  messageTitleLabel: string;
  messageInputPlaceholder: string;
  signButtonLabel: string;
}

const SignMessageCard: React.FC<RootComponentProps & ISignMessageCardProps> = props => {
  const { className, messageTitleLabel, messageInputPlaceholder, signButtonLabel, plugins } = props;

  const navigateTo = plugins['@akashaorg/app-routing']?.routing.navigateTo;

  const { t } = useTranslation('app-dev-dashboard');

  const [message, setMessage] = React.useState<string>('');

  const signMessageMutation = useSignMessage();

  const handleClickCardTitleIcon = () => {
    navigateTo?.({
      appName: '@akashaorg/app-dev-dashboard',
      getNavigationUrl: () => menuRoute[DASHBOARD],
    });
  };

  const handleMessageInputChange = ev => {
    setMessage(ev.target.value);
  };

  const handleSignMessage = () => {
    signMessageMutation.mutate({ message });
  };

  const handleButtonClick = () => {
    navigateTo?.({
      appName: '@akashaorg/app-dev-dashboard',
      getNavigationUrl: () => menuRoute[DASHBOARD],
    });
  };

  const errorObject = signMessageMutation.error;

  return (
    <MainAreaCardBox className={className}>
      <CardTitle
        leftIcon={true}
        title={t('Sign a Message')}
        onClickIcon={handleClickCardTitleIcon}
      />

      <HorizontalDivider />

      <Box pad="small" margin={{ top: 'medium' }}>
        {!signMessageMutation.isSuccess && (
          <Box gap="large">
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
                {/* <StyledTextArea
                  resize={false}
                  size="large"
                  rows={8}
                  style={{ padding: 0 }}
                  value={message}
                  onChange={handleMessageInputChange}
                  placeholder={messageInputPlaceholder}
                /> */}
              </Box>
              {signMessageMutation.isError && (
                <Text size="small" color="errorText">
                  {errorObject.message}
                </Text>
              )}
            </Box>

            <Box direction="row" justify="end">
              <Button
                primary={true}
                disabled={signMessageMutation.isLoading || !message.length}
                label={signMessageMutation.isLoading ? <Spinner /> : signButtonLabel}
                onClick={handleSignMessage}
              />
            </Box>
          </Box>
        )}

        {signMessageMutation.isSuccess && (
          <SummaryCard
            {...props}
            paragraph1Content={signMessageMutation.data.signature}
            paragraph2Content={message}
            onButtonClick={handleButtonClick}
          />
        )}
      </Box>
    </MainAreaCardBox>
  );
};

export default SignMessageCard;
