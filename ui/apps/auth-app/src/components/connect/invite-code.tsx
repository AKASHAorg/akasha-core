import * as React from 'react';
import DS from '@akashaorg/design-system';
// import { useAnalytics } from '@akashaorg/ui-awf-hooks';
// import { AnalyticsCategories } from '@akashaorg/typings/ui';
import { ITextInputIconForm } from '@akashaorg/design-system/lib/components/TextInputIconForm';

import { StyledButton } from './styles';

const { Box, Text, CTAAnchor, TextInputIconForm, Image } = DS;

interface IInviteCodeProps extends ITextInputIconForm {
  publicImagePath?: string;
  paragraphOneLabel: string;
  paragraphThreePartOneLabel: string;
  paragraphThreeAccentLabel: string;
  paragraphThreePartTwoLabel: string;
  paragraphTwo: string;
  writeToUsUrl: string;
  inputPlaceholder: string;
  successPromptLabel: string;
  cancelButtonLabel: string;
  continueButtonLabel: string;
  onCancelClick: () => void;
  onContinueClick: () => void;
}

const InviteCode: React.FC<IInviteCodeProps> = props => {
  const {
    publicImagePath = '/images',
    paragraphOneLabel,
    paragraphThreePartOneLabel,
    paragraphThreeAccentLabel,
    paragraphThreePartTwoLabel,
    paragraphTwo,
    writeToUsUrl,
    inputValue,
    inputPlaceholder,
    successPromptLabel,
    cancelButtonLabel,
    continueButtonLabel,
    onChange,
    onCancelClick,
    onContinueClick,
  } = props;

  // const [analyticsActions] = useAnalytics();

  const handleContinueClick = () => {
    // analyticsActions.trackEvent({
    //   category: AnalyticsCategories.SIGN_UP,
    //   action: 'Invitation Code',
    // });
    onContinueClick();
  };

  const disabled = !props.success;

  return (
    <Box gap="0.5rem" alignContent="center">
      <Text
        size="xlarge"
        margin={{ bottom: 'large', top: '4rem' }}
        weight="bold"
        textAlign="center"
      >
        {paragraphOneLabel}
      </Text>
      <Box flex={true} align="center" margin={{ bottom: 'small' }}>
        <Image fit="contain" src={`${publicImagePath}/invite-letter.webp`} />
      </Box>
      <Text
        size="xlarge"
        weight="bold"
        textAlign="center"
        margin={{ top: 'medium' }}
        style={{ width: '70%', margin: 'auto' }}
      >
        {paragraphTwo}
      </Text>

      <Text size="large" margin={{ bottom: 'small' }} color="secondaryText" textAlign="center">
        <Text size="large">{paragraphThreePartOneLabel}</Text>
        <CTAAnchor
          size="large"
          isBold={true}
          color="accentText"
          href={writeToUsUrl}
          label={paragraphThreeAccentLabel}
        />
        {paragraphThreePartTwoLabel}
      </Text>
      <TextInputIconForm
        inputPlaceholder={inputPlaceholder}
        inputValue={inputValue || ''}
        noArrowRight={true}
        errorIconColor="red"
        elevation="shadow"
        margin={{ left: '0rem', top: 'small' }}
        {...props}
        onChange={onChange}
      />
      {props.errorMsg && props.hasError && (
        <Text color="status-critical" margin={{ top: 'xxsmall' }}>
          {props.errorMsg}
        </Text>
      )}
      {props.success && (
        <Text size="large" color="green" margin={{ top: 'xxsmall' }}>
          {successPromptLabel}
        </Text>
      )}
      <Box
        flex={true}
        direction="row"
        width="100%"
        align="end"
        justify="end"
        margin={{ top: '1.5rem' }}
      >
        <StyledButton
          slimBorder={true}
          label={cancelButtonLabel}
          onClick={onCancelClick}
          margin={{ right: '0.5rem' }}
        />
        <StyledButton
          primary={true}
          label={continueButtonLabel}
          onClick={handleContinueClick}
          disabled={disabled}
        />
      </Box>
    </Box>
  );
};

export default InviteCode;
