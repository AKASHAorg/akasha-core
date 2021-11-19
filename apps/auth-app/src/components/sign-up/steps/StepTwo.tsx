import * as React from 'react';
import DS from '@akashaproject/design-system';

const { Box, Text, Icon, Button, CTAAnchor, Checkbox, styled } = DS;

export interface IStepTwoProps {
  textLine1: string;
  textLine1link1: string;
  textLine1connector: string;
  textLine1link2: string;
  textLine2p1: string;
  textLine2accent: string;
  textLine2p2: string;
  link1: string;
  link2: string;
  link3: string;
  textOption1: string;
  textOption2: string;
  textOption3: string;
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
    textLine1,
    textLine1link1,
    textLine1connector,
    textLine1link2,
    textLine2p1,
    textLine2accent,
    textLine2p2,
    link1,
    link2,
    link3,
    textOption1,
    textOption2,
    textOption3,
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
      <Text size="large" margin={{ bottom: 'xlarge' }}>
        {textLine1}{' '}
        <CTAAnchor size="large" color="accentText" href={link1} label={textLine1link1} />{' '}
        {textLine1connector}{' '}
        <CTAAnchor size="large" color="accentText" href={link2} label={textLine1link2} />.
      </Text>
      <Text size="large">
        {textLine2p1}{' '}
        <CTAAnchor size="large" color="accentText" href={link3} label={textLine2accent} />{' '}
        {textLine2p2}.
      </Text>
      <>
        <Box margin={{ vertical: '1.15rem' }}>
          <Checkbox
            checked={checked[TERMS]}
            label={textOption1}
            pad={{ vertical: '0.35rem' }}
            setChecked={() =>
              setChecked(prevState => ({ ...prevState, [TERMS]: !prevState[TERMS] }))
            }
          />
          <Checkbox
            checked={checked[PRIVACY]}
            label={textOption2}
            pad={{ vertical: '0.35rem' }}
            setChecked={() =>
              setChecked(prevState => ({ ...prevState, [PRIVACY]: !prevState[PRIVACY] }))
            }
          />
          <Checkbox
            checked={checked[CONDUCT]}
            label={textOption3}
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
