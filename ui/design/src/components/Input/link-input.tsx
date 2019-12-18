import { Box } from 'grommet';
import * as React from 'react';
import { Icon } from '../Icon/index';
import { StyledLinkIconDiv, StyledTextInput } from './styled-input';

export interface ILinkInput {
  onChange: (ev: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  inputValue: string;
}

const LinkInput: React.FC<ILinkInput> = props => {
  const { onChange, className, inputValue } = props;

  return (
    <Box
      fill="horizontal"
      direction="row"
      align="center"
      pad={{ horizontal: 'xsmall', vertical: 'xsmall' }}
      round="small"
      border={{
        side: 'all',
        color: 'border',
      }}
      className={className}
      gap="xsmall"
    >
      <StyledLinkIconDiv>
        <Icon type="link" />
      </StyledLinkIconDiv>
      <StyledTextInput plain={true} value={inputValue} onChange={onChange} />
    </Box>
  );
};

export default LinkInput;
