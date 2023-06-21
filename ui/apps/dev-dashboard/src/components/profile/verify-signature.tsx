import React from 'react';
import { useTranslation } from 'react-i18next';

import DS from '@akashaorg/design-system';
import { useGetLogin, useVerifySignature } from '@akashaorg/ui-awf-hooks';
import { RootComponentProps } from '@akashaorg/typings/ui';

import CardTitle from './card-title';
import SummaryCard, { ISummaryCardProps } from './summary-card';

import menuRoute, { DASHBOARD } from '../../routes';

const { Box, Button, HorizontalDivider, MainAreaCardBox, Text, TextInputIconForm, Spinner } = DS;

interface IVerifySignatureCardProps extends ISummaryCardProps {
  className?: string;
  pubKeyTitleLabel: string;
  pubKeyInputPlaceholder: string;
  messageTitleLabel: string;
  messageInputPlaceholder: string;
  signatureTitleLabel: string;
  signatureInputPlaceholder: string;
  verifyButtonLabel: string;
}

const VerifySignatureCard: React.FC<RootComponentProps & IVerifySignatureCardProps> = props => {
  const {
    className,
    pubKeyTitleLabel,
    pubKeyInputPlaceholder,
    messageTitleLabel,
    // messageInputPlaceholder,
    signatureTitleLabel,
    // signatureInputPlaceholder,
    verifyButtonLabel,
    plugins,
  } = props;

  const [pubKey, setPubKey] = React.useState<string>('');
  const [message, setMessage] = React.useState<string>('');
  const [signature, setSignature] = React.useState<string>('');

  const loginQuery = useGetLogin();

  const verifySignatureMutation = useVerifySignature();

  const navigateTo = plugins['@akashaorg/app-routing']?.routing.navigateTo;

  const { t } = useTranslation('app-dev-dashboard');

  React.useEffect(() => {
    if (loginQuery.data) {
      setPubKey(loginQuery.data.pubKey);
    }
  }, [loginQuery.data]);

  const handleClickCardTitleIcon = () => {
    navigateTo?.({
      appName: '@akashaorg/app-dev-dashboard',
      getNavigationUrl: () => menuRoute[DASHBOARD],
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
    verifySignatureMutation.mutate({ pubKey, signature, data: message });
  };

  const handleButtonClick = () => {
    plugins['@akashaorg/app-routing']?.routing.navigateTo({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: () => menuRoute[DASHBOARD],
    });
  };

  const errorObject = verifySignatureMutation.error;

  return (
    <MainAreaCardBox className={className}>
      <CardTitle
        leftIcon={true}
        title={t('Verify a signature')}
        onClickIcon={handleClickCardTitleIcon}
      />

      <HorizontalDivider />

      <Box gap="large" pad="small" margin={{ top: 'medium' }}>
        {!verifySignatureMutation.isSuccess && (
          <Box gap="large">
            <Box gap="xsmall">
              <Text size="medium" weight="bold" style={{ textTransform: 'uppercase' }}>
                {pubKeyTitleLabel}
              </Text>
              <TextInputIconForm
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
                {/* <StyledTextArea
                  resize={false}
                  size="large"
                  rows={8}
                  style={{ padding: 0 }}
                  value={message}
                  onChange={ev => handleFieldChange(ev, 'message')}
                  placeholder={messageInputPlaceholder}
                /> */}
              </Box>
              {verifySignatureMutation.isError && (
                <Text size="small" color="errorText">
                  {errorObject.message}
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
                {/* <StyledTextArea
                  resize={false}
                  size="large"
                  rows={8}
                  style={{ padding: 0 }}
                  value={signature}
                  onChange={ev => handleFieldChange(ev, 'signature')}
                  placeholder={signatureInputPlaceholder}
                /> */}
              </Box>
              {verifySignatureMutation.isError && (
                <Text size="small" color="errorText">
                  {errorObject.message}
                </Text>
              )}
            </Box>

            <Box direction="row" justify="end">
              <Button
                primary={true}
                disabled={verifySignatureMutation.isLoading || !message.length}
                label={verifySignatureMutation.isLoading ? <Spinner /> : verifyButtonLabel}
                onClick={handleVerifySignature}
              />
            </Box>
          </Box>
        )}
        {verifySignatureMutation.isSuccess && (
          <SummaryCard
            {...props}
            paragraph1Content={pubKey}
            paragraph2Content={message}
            onButtonClick={handleButtonClick}
          />
        )}
      </Box>
    </MainAreaCardBox>
  );
};

export default VerifySignatureCard;
