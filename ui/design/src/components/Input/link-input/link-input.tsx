import { Box } from 'grommet';
import * as React from 'react';
import Icon from '../../Icon';
import { StyledCloseIconDiv, StyledLinkIconDiv, StyledTextInput } from './styled-link-input';

export interface ILinkInput {
  onChange: (ev: React.ChangeEvent<HTMLInputElement>) => void;
  handleClearInput: () => void;
  className?: string;
  inputValue: string;
}

const LinkInput: React.FC<ILinkInput> = props => {
  const { onChange, handleClearInput, className, inputValue } = props;

  return (
    <Box
      fill="horizontal"
      direction="row"
      align="center"
      pad="xsmall"
      round="small"
      border={{
        side: 'all',
        color: 'border',
      }}
      className={className}
      justify="between"
    >
      <Box direction="row" gap="xsmall" align="center" flex={{ grow: 1 }} pad={{ right: 'xsmall' }}>
        <StyledLinkIconDiv>
          <Icon type="link" />
        </StyledLinkIconDiv>
        <StyledTextInput plain={true} value={inputValue} onChange={onChange} />
      </Box>

      {inputValue && (
        <StyledCloseIconDiv onClick={handleClearInput}>
          <Icon type="close" size="xxs" clickable={true} />
        </StyledCloseIconDiv>
      )}
    </Box>
  );
};

export default LinkInput;
