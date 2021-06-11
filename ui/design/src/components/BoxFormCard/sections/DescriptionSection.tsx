import React from 'react';
import { Box, FormField, TextArea } from 'grommet';

import { IFormValues } from '../';
import { StyledText } from '../styled-form-card';

export interface IDescriptionSectionProps {
  descriptionLabel?: string;
  descriptionFieldPlaceholder?: string;
  formValues: IFormValues;
  handleFormFieldChange: (arg1: { description: string }) => void;
}

const DescriptionSection: React.FC<IDescriptionSectionProps> = props => {
  const {
    descriptionLabel,
    descriptionFieldPlaceholder,
    formValues,
    handleFormFieldChange,
  } = props;
  return (
    <Box direction="column" margin={{ top: 'small' }}>
      <StyledText
        size="small"
        margin={{ bottom: '0.5em', left: '0' }}
        color="secondaryText"
        style={{ userSelect: 'none' }}
      >
        {descriptionLabel}
      </StyledText>
      <FormField name="description" htmlFor="form-description-textarea">
        <TextArea
          resize="vertical"
          size="large"
          rows={3}
          style={{ padding: 0 }}
          id="form-description-textarea"
          name="description"
          value={formValues.description}
          onChange={ev => handleFormFieldChange({ description: ev.target.value })}
          placeholder={descriptionFieldPlaceholder}
        />
      </FormField>
    </Box>
  );
};

export { DescriptionSection };
