import { TextAreaProps } from 'grommet';
import React, { FC } from 'react';
import CommonInterface from '../../interfaces/common.interface';
import MarginInterface from '../../interfaces/margin.interface';
import {
  StyledTextAreaContainer,
  StyledTextAreaCounterContainer,
  StyledTextAreaLabel,
  StyledTextAreaLabelContainer,
  StyledTextArea,
} from './styled-textarea';

export interface ITextArea extends TextAreaProps, CommonInterface<HTMLTextAreaElement> {
  label: string;
  showCounter: boolean;
  maxLength: number;
  margin?: MarginInterface;
  backgroundColor?: string;
}

const CustomTextArea: FC<ITextArea> = props => {
  const left = typeof props.value !== 'undefined' ? props.maxLength - props.value.length : 0;

  return (
    <StyledTextAreaContainer>
      {props.label && (
        <StyledTextAreaLabelContainer>
          <StyledTextAreaLabel htmlFor={props.id}>{props.label}</StyledTextAreaLabel>
        </StyledTextAreaLabelContainer>
      )}

      <StyledTextArea {...props} />

      {props.showCounter && props.maxLength && (
        <StyledTextAreaCounterContainer>
          Characters left: {props.maxLength - left}
        </StyledTextAreaCounterContainer>
      )}
    </StyledTextAreaContainer>
  );
};

export default CustomTextArea;
