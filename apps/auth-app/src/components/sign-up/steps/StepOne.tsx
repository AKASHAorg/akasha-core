import * as React from 'react';
import DS from '@akashaproject/design-system';
import { ILinkInput } from '@akashaproject/design-system/lib/components/TextInputIconForm';

const { Box, Text, Icon, Button, CTAAnchor, LinkInput, styled } = DS;

export interface IStepOneProps extends ILinkInput {
  paragraphOneLabel: string;
  paragraphTwoLabel: string;
  paragraphTwoBoldLabel: string;
  paragraphTwoAccentLabel: string;
  paragraphThree: string;
  writeToUsUrl: string;
  inputLabel: string;
  buttonLabel: string;
  onButtonClick: () => void;
}

const StyledButton = styled(Button)`
  padding: ${props =>
    `${props.theme.shapes.baseSpacing / 16}rem ${(props.theme.shapes.baseSpacing * 2.5) / 16}rem`};
`;

const StepOne: React.FC<IStepOneProps> = props => {
  const {
    paragraphOneLabel,
    paragraphTwoLabel,
    paragraphTwoBoldLabel,
    paragraphTwoAccentLabel,
    paragraphThree,
    writeToUsUrl,
    inputLabel,
    buttonLabel,
    inputPlaceholder,
    inputValue,
    onChange,
    onButtonClick,
  } = props;
  return (
    <Box>
      <Text size="large" margin={{ bottom: 'large' }}>
        {paragraphOneLabel}
      </Text>
      <Text size="large" margin={{ bottom: 'xlarge' }}>
        <Text size="large" weight="bold">
          {paragraphTwoBoldLabel},
        </Text>{' '}
        <CTAAnchor
          size="large"
          isBold={true}
          color="accentText"
          href={writeToUsUrl}
          label={paragraphTwoAccentLabel}
        />
        . {paragraphTwoLabel}.
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
            {paragraphThree}
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
