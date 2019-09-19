import styled, { css } from 'styled-components';
import { TextArea } from 'grommet';
import { ITextArea } from './index';
import MarginSetter from '../../utils/marginSetter';

const StyledTextAreaContainer = styled.div`
  padding: 20px;
`;

const StyledTextAreaLabel = styled.label`
  text-transform: uppercase;
  font-size: 11px;
`;

const StyledTextAreaLabelContainer = styled.div`
  margin-bottom: 11px;
`;

const StyledTextAreaCounterContainer = styled.div`
  margin-top: 16px;
  font-size: 14px;
  text-align: right;
`;

const StyledTextArea = styled(TextArea)<ITextArea>`
  ${props => {
    const { margin, backgroundColor } = props;

    const marginSize = margin ? MarginSetter(margin) : '0px';

    return css`
    background: ${props => backgroundColor || props.theme.colors.white}
    margin: ${marginSize}
  `;
  }}
`;

export {
  StyledTextAreaContainer,
  StyledTextAreaLabel,
  StyledTextAreaLabelContainer,
  StyledTextAreaCounterContainer,
  StyledTextArea,
};
