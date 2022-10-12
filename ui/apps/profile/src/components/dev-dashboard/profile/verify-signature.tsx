import React from 'react';
import { useTranslation } from 'react-i18next';

import DS from '@akashaorg/design-system';
import { useGetLogin, useGetProfile, useVerifySignature } from '@akashaorg/ui-awf-hooks';
import { RootComponentProps } from '@akashaorg/typings/ui';

import CardTitle from './card-title';

import menuRoute, { DEV_DASHBOARD } from '../../../routes';

import { StyledTextArea } from './dev-message-form';

const { Box, Button, HorizontalDivider, MainAreaCardBox, Text, LinkInput, Spinner } = DS;

interface IVerifySignatureCardProps {
  className?: string;
  pubKeyTitleLabel: string;
  pubKeyInputPlaceholder: string;
  messageTitleLabel: string;
  messageInputPlaceholder: string;
  signatureTitleLabel: string;
  signatureInputPlaceholder: string;
  buttonLabel: string;
}

const VerifySignatureCard: React.FC<RootComponentProps & IVerifySignatureCardProps> = props => {
  const {
    className,
    pubKeyTitleLabel,
    pubKeyInputPlaceholder,
    messageTitleLabel,
    messageInputPlaceholder,
    signatureTitleLabel,
    signatureInputPlaceholder,
    buttonLabel,
    plugins,
  } = props;

  const [pubKey, setPubKey] = React.useState<string>('');
  const [message, setMessage] = React.useState<string>('');
  const [signature, setSignature] = React.useState<string>('');

  const loginQuery = useGetLogin();
  const loggedProfileQuery = useGetProfile(loginQuery.data?.pubKey);
  const verifySignatureMutation = useVerifySignature();

  const { t } = useTranslation('app-profile');

  React.useEffect(() => {
    if (loggedProfileQuery.data) {
      setPubKey(loggedProfileQuery.data.pubKey);
    }
  }, [loggedProfileQuery.data]);

  const handleClickCardTitleIcon = () => {
    plugins['@akashaorg/app-routing']?.routing.navigateTo({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: () => menuRoute[DEV_DASHBOARD],
    });
  };

  const handleFieldChange = (ev, field: string) => {
    switch (field) {
      case 'pubKey':
        setPubKey(ev.target.value);
        break;
      case 'message':
        setMessage(ev.target.value);
        break;
      case 'signature':
        setSignature(ev.target.value);
        break;
      default:
        break;
    }
  };

  const handleVerifySignature = () => {
    verifySignatureMutation.mutate({ pubKey, message, signature });
  };

  return (
    <MainAreaCardBox className={className}>
      <CardTitle
        leftIcon={true}
        title={t('Verify a signature')}
        onClickIcon={handleClickCardTitleIcon}
      />

      <HorizontalDivider />

      <Box gap="large" pad="small" margin={{ top: 'medium' }}>
        <Box gap="xsmall">
          <Text size="medium" weight="bold" style={{ textTransform: 'uppercase' }}>
            {pubKeyTitleLabel}
          </Text>
          <LinkInput
            inputPlaceholder={pubKeyInputPlaceholder}
            inputValue={pubKey}
            elevation="shadow"
            margin="0rem"
            noArrowRight={true}
            onChange={ev => handleFieldChange(ev, 'pubKey')}
          />
        </Box>

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
              color: verifySignatureMutation.isError
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
              onChange={ev => handleFieldChange(ev, 'message')}
              placeholder={messageInputPlaceholder}
            />
          </Box>
          {verifySignatureMutation.isError && (
            <Text size="small" color="errorText">
              {verifySignatureMutation.error}
            </Text>
          )}
        </Box>

        <Box gap="xsmall">
          <Text size="medium" weight="bold" style={{ textTransform: 'uppercase' }}>
            {signatureTitleLabel}
          </Text>
          <Box
            fill="horizontal"
            pad={{ vertical: 'xsmall', horizontal: 'small' }}
            round="xxsmall"
            elevation="shadow"
            border={{
              side: 'all',
              color: verifySignatureMutation.isError
                ? 'errorText'
                : signature.length
                ? 'accent'
                : 'border',
            }}
          >
            <StyledTextArea
              resize={false}
              size="large"
              rows={8}
              style={{ padding: 0 }}
              value={signature}
              onChange={ev => handleFieldChange(ev, 'signature')}
              placeholder={signatureInputPlaceholder}
            />
          </Box>
          {verifySignatureMutation.isError && (
            <Text size="small" color="errorText">
              {verifySignatureMutation.error}
            </Text>
          )}
        </Box>

        <Box direction="row" justify="end" gap="small">
          <Button
            primary={true}
            disabled={verifySignatureMutation.isLoading || !message.length}
            label={verifySignatureMutation.isLoading ? <Spinner /> : buttonLabel}
            onClick={handleVerifySignature}
          />
        </Box>
      </Box>
    </MainAreaCardBox>
  );
};

export default VerifySignatureCard;
