import * as React from 'react';
import DS from '@akashaorg/design-system';

import { ITextInputIconForm } from '@akashaorg/design-system/lib/components/TextInputIconForm';

const { Box, Text, Icon, CTAAnchor, TextInputIconForm, Button, styled } = DS;

interface IInviteCodeProps extends ITextInputIconForm {
  paragraphOneLabel: string;
  paragraphThreePartOneLabel: string;
  paragraphThreeAccentLabel: string;
  paragraphThreePartTwoLabel: string;
  paragraphTwo: string;
  writeToUsUrl: string;
  inputPlaceholder: string;
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
    onChange,
    onCancelClick,
    onContinueClick,
  } = props;
  return (
    <Box gap="0.5rem" alignContent="center">
      <Text size="xlarge" margin={{ bottom: 'large', top: '4rem' }} weight="bold">
        {paragraphOneLabel}
      </Text>
      <Box flex={true} align="center" width="100%">
        <Icon type="inviteLetter" plain={true} />
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
      <Box flex={true} direction="row" width="100%" align="end" justify="end">
        <Button
          secondary={true}
          slimBorder={true}
          label="Cancel"
          onClick={onCancelClick}
          margin={{ right: '0.5rem' }}
        />
        <Button
          primary={true}
          label="Continue"
          onClick={onContinueClick}
          disabled={inputValue.length === 0}
          slimBorder={true}
        />
      </Box>
    </Box>
  );
};

export default InviteCode;
