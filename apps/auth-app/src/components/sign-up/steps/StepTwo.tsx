import * as React from 'react';
import DS from '@akashaproject/design-system';

const { Box, Text, Icon, Button, CTAAnchor, Checkbox, styled } = DS;

export interface IStepTwoProps {
  textLegalPartOne: string;
  textLegalPartTwo: string;
  textLegalPartThree: string;
  textConnector: string;
  textLegalTerms: string;
  textLegalPrivacy: string;
  textLegalConduct: string;
  textLegalTermsLink: string;
  textLegalPrivacyLink: string;
  textLegalConductLink: string;
  checkboxLabelTerms: string;
  checkboxLabelPrivacy: string;
  checkboxLabelConduct: string;
  buttonLabel: string;
  onButtonClick: () => void;
}

const StyledButton = styled(Button)`
  padding: ${props =>
    `${props.theme.shapes.baseSpacing / 16}rem ${(props.theme.shapes.baseSpacing * 2.5) / 16}rem`};
`;

const TERMS = 'terms';
const PRIVACY = 'privacy';
const CONDUCT = 'conduct';

const StepTwo: React.FC<IStepTwoProps> = props => {
  const {
    textLegalPartOne,
    textLegalPartTwo,
    textLegalPartThree,
    textConnector,
    textLegalTerms,
    textLegalPrivacy,
    textLegalConduct,
    textLegalTermsLink,
    textLegalPrivacyLink,
    textLegalConductLink,
    checkboxLabelTerms,
    checkboxLabelPrivacy,
    checkboxLabelConduct,
    buttonLabel,
    onButtonClick,
  } = props;

  const [checked, setChecked] = React.useState({
    [TERMS]: false,
    [PRIVACY]: false,
    [CONDUCT]: false,
  });

  const allowNextStep = !Object.values(checked).includes(false);

  return (
    <>
      <Text size="large" margin={{ bottom: 'large' }}>
        {textLegalPartOne}{' '}
        <CTAAnchor
          size="large"
          color="accentText"
          href={textLegalTermsLink}
          label={textLegalTerms}
          target="_blank"
          rel="noopener noreferrer"
        />{' '}
        {textConnector}{' '}
        <CTAAnchor
          size="large"
          color="accentText"
          href={textLegalPrivacyLink}
          label={textLegalPrivacy}
          target="_blank"
          rel="noopener noreferrer"
        />
        .
      </Text>
      <Text size="large">
        {textLegalPartTwo}{' '}
        <CTAAnchor
          size="large"
          color="accentText"
          href={textLegalConductLink}
          label={textLegalConduct}
          target="_blank"
          rel="noopener noreferrer"
        />{' '}
        {textLegalPartThree}.
      </Text>
      <>
        <Box margin={{ vertical: '1.15rem' }}>
          <Checkbox
            checked={checked[TERMS]}
            label={checkboxLabelTerms}
            pad={{ vertical: '0.35rem' }}
            setChecked={() =>
              setChecked(prevState => ({ ...prevState, [TERMS]: !prevState[TERMS] }))
            }
          />
          <Checkbox
            checked={checked[PRIVACY]}
            label={checkboxLabelPrivacy}
            pad={{ vertical: '0.35rem' }}
            setChecked={() =>
              setChecked(prevState => ({ ...prevState, [PRIVACY]: !prevState[PRIVACY] }))
            }
          />
          <Checkbox
            checked={checked[CONDUCT]}
            label={checkboxLabelConduct}
            pad={{ vertical: '0.35rem' }}
            setChecked={() =>
              setChecked(prevState => ({ ...prevState, [CONDUCT]: !prevState[CONDUCT] }))
            }
          />
        </Box>
        {allowNextStep && (
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
        )}
      </>
    </>
  );
};

export { StepTwo };
