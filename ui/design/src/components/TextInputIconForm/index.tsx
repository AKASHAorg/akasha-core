import * as React from 'react';
import { Box } from 'grommet';
import { EdgeSizeType, MarginType } from 'grommet/utils';

import Icon from '../Icon';

import { StyledTextInput, StyledArrowIcon, StyledDisabledBox } from './styles';

export interface ILinkInput {
  onChange?: (ev: React.ChangeEvent<HTMLInputElement>) => void;
  validateTokenFn?: (ev: unknown) => void;
  className?: string;
  inputValue: string;
  inputPlaceholder?: string;
  submitted?: boolean;
  submitting?: boolean;
  success?: boolean;
  hasError?: boolean;
  errorMsg?: string;
  margin?: MarginType | EdgeSizeType;
  elevation?: string;
  inputInvalid?: boolean;
  noArrowRight?: boolean;
  noDisable?: boolean;
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
    margin,
    elevation,
    inputInvalid,
    noArrowRight,
    noDisable,
  } = props;

  const isEmpty = !inputValue;
  const isWriting = inputValue && !submitted && !submitting;
  const inputColor = (isWriting && 'accent') || (hasError && 'errorText') || 'border';
  const placeHolder = inputPlaceholder || 'Invitation Code';
  const isDisabled = !noDisable && (submitting || success);
  const Container = isDisabled ? StyledDisabledBox : Box;
  return (
    <Container
      fill="horizontal"
      direction="row"
      align="center"
      pad="small"
      round="xxsmall"
      margin={margin || 'xsmall'}
      border={{
        side: 'all',
        color: inputColor,
      }}
      className={className}
      justify="between"
      elevation={elevation || 'xsmall'}
    >
      <Box direction="row" gap="small" align="center" flex={{ grow: 1 }} pad={{ right: 'small' }}>
        <form onSubmit={validateTokenFn} style={{ width: '100%' }}>
          <StyledTextInput
            plain={true}
            placeholder={placeHolder}
            value={inputValue}
            onChange={onChange}
            disabled={isDisabled}
          />
        </form>
      </Box>

      {!noArrowRight && (isEmpty || isWriting) && (
        <StyledArrowIcon
          type="arrowRight"
          clickable={true}
          color="accent"
          onClick={validateTokenFn}
        />
      )}
      {submitting && <Icon type="loading" />}
      {hasError && !isEmpty && <Icon type="error" />}
      {success && !submitting && !hasError && !inputInvalid && (
        <Icon type="available" color={'green'} />
      )}
    </Container>
  );
};

export default LinkInput;
