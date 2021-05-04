import { Box } from 'grommet';
import * as React from 'react';
import Icon from '../Icon';
import { StyledButton, StyledInputWrapper, StyledTextInput } from './styled-link-input';

export interface ILinkInput {
  onChange: (ev: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  inputValue: string;
  onClick: React.EventHandler<React.SyntheticEvent>;
}

const LinkInput: React.FC<ILinkInput> = props => {
  const { onChange, onClick, className, inputValue } = props;

  return (
    <Box
      fill="horizontal"
      direction="row"
      align="center"
      pad={{ horizontal: 'xxsmall', vertical: 'xxsmall' }}
      round="xxsmall"
      border={{
        side: 'all',
        color: 'border',
      }}
      className={className}
      flex={'shrink'}
    >
      <Icon type="link" />
      <StyledInputWrapper>
        <StyledTextInput plain={true} value={inputValue} onChange={onChange} autoFocus={true} />
      </StyledInputWrapper>

      <StyledButton
        // primary={true}
        onClick={onClick}
        // disabled={!inputValue}
      >
        <Icon type="arrowRight" color="white" size="xxs" />
      </StyledButton>
    </Box>
  );
};

export default LinkInput;
