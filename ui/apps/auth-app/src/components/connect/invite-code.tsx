import * as React from 'react';
import DS from '@akashaorg/design-system';

import { ITextInputIconForm } from '@akashaorg/design-system/lib/components/TextInputIconForm';

const { Box, Text, Icon, CTAAnchor, TextInputIconForm, Button } = DS;

interface IInviteCodeProps extends ITextInputIconForm {
  paragraphOneLabel: string;
  paragraphThreePartOneLabel: string;
  paragraphThreeAccentLabel: string;
  paragraphThreePartTwoLabel: string;
  paragraphTwo: string;
  writeToUsUrl: string;
  inputPlaceholder: string;
  disabled?: boolean;
  onContinueClick: () => void;
  onCancelClick: () => void;
}

const InviteCode: React.FC<IInviteCodeProps> = props => {
  const {
    paragraphOneLabel,
    paragraphThreePartOneLabel,
    paragraphThreeAccentLabel,
    paragraphThreePartTwoLabel,
    paragraphTwo,
    writeToUsUrl,
    inputValue,
    inputPlaceholder,
    disabled,
    onChange,
    onCancelClick,
    onContinueClick,
  } = props;

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
      <Box flex={true} align="center">
        <Icon type="inviteLetter" plain={true} size="xxxl" />
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
          onClick={() => console.log('clicked')}
        />
        {paragraphThreePartTwoLabel}.
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
        <Text color={'status-critical'} margin={{ top: 'xxsmall' }}>
          {props.errorMsg}
        </Text>
      )}
      {props.success && (
        <Text size="large" color="green" margin={{ top: 'xxsmall' }}>
          Looks good 🙌🏽
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
        <Button
          secondary={true}
          slimBorder={true}
          label="Cancel"
          onClick={onCancelClick}
          margin={{ right: '0.5rem' }}
        />
        <Button
          primary={true}
          slimBorder={true}
          label="Continue"
          onClick={onContinueClick}
          disabled={disabled}
          style={{ backgroundColor: disabled ? 'grey' : '' }}
        />
      </Box>
    </Box>
  );
};

export default InviteCode;
