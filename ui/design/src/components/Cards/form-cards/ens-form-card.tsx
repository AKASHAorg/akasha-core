import { Box, FormField, Text, RadioButton } from 'grommet';
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
  changeButtonLabel: string;
  optionUsername: string;
  optionSpecify: string;
  optionUseEthereumAddress: string;
  consentText: string;
  consentUrl: string;
  consentLabel: string;
  poweredByLabel?: string;
  iconLabel?: string;
  cancelLabel: string;
  saveLabel: string;
  nameFieldPlaceholder: string;
  ethAddress: string;
  providerData: Partial<IEnsData>;
  validateEns?: (name: string) => void;
  validEns: boolean | null;
  onSave: (data: IEnsData | { name: string }) => void;
  onCancel?: () => void;
  isValidating?: boolean;
  ensSubdomain?: string;
}

export interface IEnsData {
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
    optionUsername,
    optionSpecify,
    optionUseEthereumAddress,
    consentText,
    consentUrl,
    consentLabel,
    poweredByLabel,
    iconLabel,
    cancelLabel,
    saveLabel,
    changeButtonLabel,
    nameFieldPlaceholder,
    ethAddress,
    providerData,
    onSave,
    validateEns,
    validEns,
    isValidating,
    ensSubdomain = 'akasha.eth',
  } = props;

  const [name, setName] = React.useState('');

  const [error, setError] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [clicked, setClicked] = React.useState(false);
  const [option, setOption] = React.useState('');

  const [textInputComputedWidth, setTextInputComputedWidth] = React.useState('');

  const hiddenSpanRef: React.Ref<HTMLSpanElement> = React.useRef(null);

  // @TODO calculate from placeholder width
  const initialInputWidth = '6rem';

  React.useEffect(() => {
    if (providerData.name) {
      setName(providerData.name);
    }
    setTextInputComputedWidth(initialInputWidth);
  }, []);

  React.useEffect(() => {
    if (typeof validEns === 'boolean') {
      setError(!validEns);
      setSuccess(validEns);
    }
    if (typeof validEns === 'undefined') {
      setSuccess(true);
    }
  }, [validEns]);

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

  const handleChangeEns = () => {
    setClicked(true);
  };

  const handleSelectEns = (selected: string) => {
    setOption(selected);
  };

  const handleCopyEthAddress = () => {
    navigator.clipboard.writeText(ethAddress);
  };

  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    // when first character is typed, sanitize and append '@' accordingly
    if (name === '') {
      return setName(`@${ev.target.value.replace(/[^\w]/g, '')}`);
    }
    const value = ev.target.value;
    // sanitize remaining characters to remove any spaces and special characters
    const sanitizedValue = `@${value.substring(1).replace(/[^\w]/g, '')}`;
    setName(sanitizedValue);
    if (hiddenSpanRef.current) {
      hiddenSpanRef.current.textContent = sanitizedValue;
    }
    setError(false);
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

  const handleCancel = () => {
    setName('');
    setTextInputComputedWidth(initialInputWidth);
    setError(false);
    setSuccess(false);
    if (props.onCancel) {
      props.onCancel();
    }
  };

  const handleSave = () => {
    onSave({
      name,
    });
  };

  return (
    <MainAreaCardBox className={className}>
      <Box direction="column" pad="large">
        <Box direction="row" margin={{ top: 'xsmall', bottom: 'medium' }} align="start">
          <Text weight="bold" margin="0 auto 2rem" size="xlarge">
            {titleLabel}
          </Text>
          <Icon type="close" color="secondaryText" primaryColor={true} clickable={true} onClick={handleCancel} />
        </Box>
        <Box direction="row" align="center">
          <StyledText color={error ? 'errorText' : 'secondaryText'} size="small">
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
          {name.length > 1 && (
            <>
              <Box direction="column" pad={{ top: 'large', bottom: 'medium' }}>
                <Box direction="row" align="baseline">
                  <StyledText color="secondaryText" size="small" margin={{ right: 'xsmall' }}>
                    {ethNameLabel}
                  </StyledText>
                </Box>
                {!clicked && (
                  <Box
                    direction="row"
                    gap="xxsmall"
                    pad={{ top: 'small', bottom: 'small' }}
                    align="baseline"
                  >
                    {/* render selected Ens accordingly */}
                    {(option === '' || option.includes(`${ensSubdomain}`)) && (
                      <Text size="large">
                        {name.replace('@', '')}
                        <Text color="accentText" size="large" margin={{ right: 'xxsmall' }}>
                          .{ensSubdomain}
                        </Text>
                      </Text>
                    )}
                    {option.includes(optionSpecify) && (
                      <Text size="large">
                        {name.replace('@', '')}
                        <Text color="accentText" size="large" margin={{ right: 'xxsmall' }}>
                          .eth
                        </Text>
                      </Text>
                    )}
                    {option.includes(optionUseEthereumAddress) && (
                      <>
                        <Text size="large" margin={{ right: 'xxsmall' }}>
                          {ethAddress}
                        </Text>
                        <Icon type="copy" onClick={handleCopyEthAddress} clickable={true} />
                      </>
                    )}
                    <Text
                      color="accentText"
                      size="small"
                      style={{ cursor: 'pointer' }}
                      onClick={handleChangeEns}
                    >
                      {changeButtonLabel}
                    </Text>
                  </Box>
                )}
                {clicked && name.length > 1 && (
                  <Box direction="column">
                    {[
                      `${name === '' ? optionUsername : name}.${ensSubdomain}`.replace('@', ''),
                      optionSpecify,
                      `${optionUseEthereumAddress} (${ethAddress.slice(0, 6)}...${ethAddress.slice(
                        -4,
                      )})`,
                    ].map(label => (
                      <Box key={label} margin={{ vertical: 'xsmall' }}>
                        <RadioButton
                          name="prop"
                          checked={option === label}
                          label={label}
                          onClick={() => setClicked(false)}
                          onChange={() => handleSelectEns(label)}
                        />
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            </>
          )}
          {name.length <= 1 && (
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
          <Box>
            <Text color="secondaryText" size="medium" margin={{ bottom: 'medium' }}>
              {consentText}
              <Text
                color="accentText"
                size="medium"
                style={{ cursor: 'pointer' }}
                onClick={() => window.open(consentUrl, consentLabel, '_blank noopener noreferrer')}
              >
                {consentLabel}
              </Text>
            </Text>
          </Box>
          <Box direction="row" gap="xsmall" justify="between" align="center">
            <Box direction="row" align="center">
              {poweredByLabel &&
                <Text color="secondaryText" size="10px" margin={{ right: 'xxsmall' }}>
                  {poweredByLabel}
                </Text>
              }
              {iconLabel &&
                <>
                  <Icon type="appEns" size="xs" />
                  <Text
                    style={{ opacity: 0.75 }}
                    size="xsmall"
                    margin={{ left: '0.05rem', right: 'xsmall' }}
                  >
                    {iconLabel}
                  </Text>
                </>
              }
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
