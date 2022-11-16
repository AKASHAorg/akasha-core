import * as React from 'react';
import { Box } from 'grommet';
import Button from '../../Button';
import { StyledText } from '../styled-form-card';

export interface EnsPrefillSectionProps {
  ensName: string;
  titleLabel: string;
  prefillButtonLabel: string;
  onEnsPrefill?: () => void;
}

const EnsPrefillSection: React.FC<EnsPrefillSectionProps> = props => {
  return (
    <Box margin={{ vertical: 'medium' }}>
      <StyledText
        size="small"
        margin={{ bottom: '0.5em', left: '0' }}
        color="secondaryText"
        style={{ userSelect: 'none' }}
      >
        {props.titleLabel}
      </StyledText>
      <Box direction="row" justify="between">
        <StyledText size="medium" color="lightGrey">
          {props.ensName}
        </StyledText>
        <Button label={props.prefillButtonLabel} onClick={props.onEnsPrefill} />
      </Box>
    </Box>
  );
};

export default EnsPrefillSection;
