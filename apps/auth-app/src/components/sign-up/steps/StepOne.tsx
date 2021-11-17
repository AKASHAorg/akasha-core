import * as React from 'react';
import DS from '@akashaproject/design-system';
import { ILinkInput } from '@akashaproject/design-system/lib/components/TextInputIconForm';

const { Box, Text, Icon, Button, CTAAnchor, LinkInput, styled } = DS;

export interface IStepOneProps extends ILinkInput {
  textLine1: string;
  textLine2bold: string;
  textLine2accent: string;
  writeToUsUrl: string;
  textLine2: string;
  inputLabel: string;
  textLine3: string;
  buttonLabel: string;
  onButtonClick: () => void;
}

const StyledButton = styled(Button)`
  padding: ${props =>
    `${props.theme.shapes.baseSpacing / 16}rem ${(props.theme.shapes.baseSpacing * 2.5) / 16}rem`};
`;

const StepOne: React.FC<IStepOneProps> = props => {
  const {
    textLine1,
    textLine2bold,
    textLine2accent,
    writeToUsUrl,
    textLine2,
    inputLabel,
    textLine3,
    buttonLabel,
    inputPlaceholder,
    inputValue,
    onChange,
    onButtonClick,
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
      {props.success && (
        <>
          <Text size="large" margin={{ vertical: 'large' }}>
            {textLine3}
          </Text>
          <Box
            align="flex-end"
            justify="center"
            margin={{ top: 'small' }}
            pad={{ top: 'medium' }}
            border={{ side: 'top', color: 'border', size: 'xsmall' }}
          >
            <StyledButton
              primary={true}
              icon={<Icon type="arrowRight" color="white" />}
              reverse={true}
              label={buttonLabel}
              onClick={onButtonClick}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export { StepOne };
