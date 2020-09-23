import { Box, FormField, Text } from 'grommet';
import * as React from 'react';
import { Button } from '../../Buttons/index';
import { Icon } from '../../Icon/index';
import { MainAreaCardBox } from '../common/basic-card-box';
import { HiddenSpan, StyledText, StyledTextInput } from './styled-form-card';

export interface IEnsFormCardProps {
  className?: string;
  titleLabel: string;
  secondaryTitleLabel: string;
  nameLabel: string;
  errorLabel: string;
  ethAddressLabel: string;
  ethNameLabel: string;
  poweredByLabel: string;
  iconLabel: string;
  cancelLabel: string;
  saveLabel: string;
  nameFieldPlaceholder: string;
  ethAddress: string;
  providerData: Partial<IEnsData>;
  validateEns?: (name: string) => void;
  validEns?: boolean;
  handleSubmit: (data: IEnsData | { name: string }) => void;
  isValidating?: boolean;
  ensSubdomain?: string;
}

export interface IEnsData {
  providerName: string;
  name?: string;
}

const EnsFormCard: React.FC<IEnsFormCardProps> = props => {
  const {
    className,
    titleLabel,
    nameLabel,
    errorLabel,
    ethAddressLabel,
    ethNameLabel,
    poweredByLabel,
    iconLabel,
    cancelLabel,
    saveLabel,
    nameFieldPlaceholder,
    ethAddress,
    providerData,
    handleSubmit,
    validateEns,
    validEns,
    isValidating,
    ensSubdomain = 'akasha.eth',
  } = props;

  const [name, setName] = React.useState('');

  const [error, setError] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [clicked, setClicked] = React.useState(false);

  const [textInputComputedWidth, setTextInputComputedWidth] = React.useState('');

  const hiddenSpanRef: React.Ref<HTMLSpanElement> = React.useRef(null);

  // @TODO calculate from placeholder width
  const initialInputWidth = '6rem';

  const handleCopyEthAddress = () => {
    navigator.clipboard.writeText(ethAddress);
  };

  const handleCopyEns = () => {
    navigator.clipboard.writeText(`${name}.${ensSubdomain}`);
  };

  const handleCancel = () => {
    setName('');
    setTextInputComputedWidth(initialInputWidth);
    setError(false);
    setSuccess(false);
  };

  const handleChangeEns = () => {
    setClicked(true);
  };

  React.useEffect(() => {
    if (providerData.name) {
      setName(providerData.name);
    }
    setTextInputComputedWidth(initialInputWidth);
  }, []);

  React.useEffect(() => {
    if (!validEns && typeof validEns === 'boolean') {
      setError(true);
    }
    if (validEns && typeof validEns === 'undefined') {
      setSuccess(true);
    }
  }, [validEns]);

  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const value = ev.target.value;
    const sanitizedValue = value.replace(/\s/g, '');
    setName(sanitizedValue);
    if (hiddenSpanRef.current) {
      hiddenSpanRef.current.textContent = sanitizedValue;
    }
    setError(false);
    setSuccess(false);
    if (value) {
      if (hiddenSpanRef.current) {
        setTextInputComputedWidth(`${(hiddenSpanRef.current.offsetWidth + 2) / 16}rem`);
      }
    } else if (!value) {
      if (hiddenSpanRef.current) {
        setTextInputComputedWidth(initialInputWidth);
      }
    }
    if (validateEns && typeof validateEns === 'function') {
      validateEns(value);
    }
  };

  const handleSave = () => {
    handleSubmit({
      name,
      providerName: providerData.providerName,
    });
  };

  const renderIcon = () => {
    if (isValidating) {
      return <Icon type="loading" />;
    }
    if (error) {
      return <Icon type="error" />;
    }
    if (success) {
      return <Icon type="check" accentColor={true} />;
    }
    return;
  };

  return (
    <MainAreaCardBox className={className}>
      <Box direction="column" pad="large">
        <Box direction="row" margin={{ top: 'xsmall', bottom: 'medium' }} align="start">
          <Text weight="bold" margin="0 auto 2rem" size="xlarge">
            {titleLabel}
          </Text>
          <Icon type="close" color="secondaryText" primaryColor={true} clickable={true} />
        </Box>
        <Box direction="row" align="center">
          <StyledText color="secondaryText" size="small">
            {nameLabel}
          </StyledText>
        </Box>
        <FormField name="name" error={error ? errorLabel : null} htmlFor="text-input">
          <Box justify="between" direction="row" pad={{ top: 'small', bottom: '11px' }}>
            <Box justify="start" direction="row" align="center">
              <HiddenSpan ref={hiddenSpanRef} />
              <StyledTextInput
                spellCheck={false}
                autoFocus={true}
                computedWidth={textInputComputedWidth}
                id="text-input"
                value={name}
                onChange={handleChange}
                placeholder={nameFieldPlaceholder}
              />
            </Box>
            {renderIcon()}
          </Box>
        </FormField>
        <Box direction="column">
          {providerData.name && (
            <>
              <Box direction="column" pad={{ top: 'large', bottom: 'medium' }}>
                <Box direction="row" align="center">
                  <StyledText color="secondaryText" size="small" margin={{ right: 'xsmall' }}>
                    {ethNameLabel}
                  </StyledText>
                </Box>
                {!clicked && (
                  <Box
                    direction="row"
                    gap="xxsmall"
                    pad={{ top: 'small', bottom: 'small' }}
                    align="center"
                  >
                    <Text size="large">
                      {providerData.name}
                      <Text color="accentText" size="large" margin={{ right: 'xxsmall' }}>
                        .{ensSubdomain}
                      </Text>
                    </Text>
                    <Icon type="copy" onClick={handleCopyEns} clickable={true} />
                    <Text
                      color="accentText"
                      margin={{ left: 'xsmall' }}
                      style={{ cursor: 'pointer' }}
                      onClick={handleChangeEns}
                    >
                      Change
                    </Text>
                  </Box>
                )}
              </Box>
            </>
          )}
          {!providerData.name && (
            <>
              <Box direction="column" pad={{ top: 'large', bottom: 'medium' }}>
                <Box direction="row" align="center">
                  <StyledText color="secondaryText" size="small" margin={{ right: 'xsmall' }}>
                    {ethAddressLabel}
                  </StyledText>
                  <Icon type="questionMark" size="xxs" clickable={true} />
                </Box>
                <Box
                  direction="row"
                  gap="xxsmall"
                  pad={{ top: 'small', bottom: 'small' }}
                  align="center"
                >
                  <Text size="large" margin={{ right: 'xxsmall' }}>
                    {ethAddress}
                  </Text>
                  <Icon type="copy" onClick={handleCopyEthAddress} clickable={true} />
                </Box>
              </Box>
            </>
          )}
          <Box direction="row" gap="xsmall" justify="between" align="center">
            <Box direction="row" align="center">
              <Text color="secondaryText" size="10px" margin={{ right: 'xxsmall' }}>
                {poweredByLabel}
              </Text>
              <Icon type="appEns" size="xs" />
              <Text
                style={{ opacity: 0.75 }}
                size="xsmall"
                margin={{ left: '0.05rem', right: 'xsmall' }}
              >
                {iconLabel}
              </Text>
              <Icon type="questionMark" size="xxs" clickable={true} />
            </Box>
            <Box direction="row">
              <Button margin={{ right: '0.5rem' }} label={cancelLabel} onClick={handleCancel} />
              <Button label={saveLabel} onClick={handleSave} primary={true} />
            </Box>
          </Box>
        </Box>
      </Box>
    </MainAreaCardBox>
  );
};

export default EnsFormCard;
