import { Box } from 'grommet';
import * as React from 'react';
import Icon from '../Icon';
import { StyledTextInput, StyledArrowIcon, StyledDisabledBox } from './styles';

export interface ILinkInput {
  onChange?: (ev: React.ChangeEvent<HTMLInputElement>) => void;
  validateTokenFn?: (ev: any) => void;
  className?: string;
  inputValue: string;
  inputPlaceholder?: string;
  submitted?: boolean;
  submitting?: boolean;
  success?: boolean;
  hasError?: boolean;
  errorMsg?: string;
}

const LinkInput: React.FC<ILinkInput> = props => {
  const {
    onChange,
    className,
    inputValue,
    submitted,
    submitting,
    hasError,
    success,
    inputPlaceholder,
    validateTokenFn,
  } = props;
  const isEmpty = !inputValue;
  const isWriting = inputValue && !submitted && !submitting;
  const inputColor = (isWriting && 'accent') || 'border';
  const placeHolder = inputPlaceholder || 'Invitation Code';
  const Container = success ? StyledDisabledBox : Box;
  return (
    <Container
      fill="horizontal"
      direction="row"
      align="center"
      pad="small"
      round="xxsmall"
      margin="xsmall"
      border={{
        side: 'all',
        color: inputColor,
      }}
      className={className}
      justify="between"
      elevation={'xsmall'}
    >
      <Box direction="row" gap="small" align="center" flex={{ grow: 1 }} pad={{ right: 'small' }}>
        <form onSubmit={validateTokenFn} style={{ width: '100%' }}>
          <StyledTextInput
            plain={true}
            placeholder={placeHolder}
            value={inputValue}
            onChange={onChange}
            disabled={success}
          />
        </form>
      </Box>

      {(isEmpty || isWriting) && (
        <StyledArrowIcon
          type="arrowRight"
          clickable={true}
          color={inputColor}
          onClick={validateTokenFn}
        />
      )}
      {submitting && <Icon type="loading" />}
      {hasError && !isEmpty && <Icon type="error" />}
      {success && <Icon type="available" color={'green'} />}
    </Container>
  );
};

export default LinkInput;
