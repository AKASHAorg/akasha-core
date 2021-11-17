import * as React from 'react';
import DS from '@akashaproject/design-system';
import { ILinkInput } from '@akashaproject/design-system/lib/components/TextInputIconForm';

const { Box, Text, CTAAnchor, LinkInput } = DS;

export interface IStepOneProps extends ILinkInput {
  textLine1: string;
  textLine2: string;
  textLine2bold: string;
  textLine2accent: string;
  writeToUsUrl: string;
  inputLabel: string;
}

const StepOne: React.FC<IStepOneProps> = props => {
  const {
    textLine1,
    textLine2bold,
    textLine2accent,
    writeToUsUrl,
    textLine2,
    inputLabel,
    inputPlaceholder,
    inputValue,
    onChange,
  } = props;
  return (
    <Box>
      <Text size="large" margin={{ bottom: 'large' }}>
        {textLine1}
      </Text>
      <Text size="large" margin={{ bottom: 'xlarge' }}>
        <Text size="large" weight="bold">
          {textLine2bold},
        </Text>{' '}
        <CTAAnchor
          size="large"
          isBold={true}
          color="accentText"
          href={writeToUsUrl}
          label={textLine2accent}
        />
        . {textLine2}.
      </Text>
      <Text size="large" color="secondaryText">
        {inputLabel}
      </Text>
      <LinkInput
        inputPlaceholder={inputPlaceholder}
        inputValue={inputValue || ''}
        elevation="shadow"
        margin={{ left: '0rem', top: 'large' }}
        {...props}
        onChange={onChange}
      />
      {props.errorMsg && props.hasError && (
        <Text color={'status-critical'} margin={{ top: 'xxsmall' }}>
          {props.errorMsg}
        </Text>
      )}
    </Box>
  );
};

export { StepOne };
