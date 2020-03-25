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
  cancelLabel: string;
  saveLabel: string;
  nameFieldPlaceholder: string;
  ethAddress: string;
  providerData: IEnsData;
  validateEns: (name: string) => void;
  validEns?: string;
  handleSubmit: (data: IEnsData) => void;
}

export interface IEnsData {
  providerName: string;
  name?: string;
}

const EnsFormCard: React.FC<IEnsFormCardProps> = props => {
  const {
    className,
    titleLabel,
    secondaryTitleLabel,
    nameLabel,
    errorLabel,
    cancelLabel,
    saveLabel,
    nameFieldPlaceholder,
    ethAddress,
    providerData,
    handleSubmit,
    validateEns,
    validEns,
  } = props;

  const [name, setName] = React.useState('');

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const [textInputComputedWidth, setTextInputComputedWidth] = React.useState('');

  const hiddenSpanRef: React.Ref<HTMLSpanElement> = React.useRef(null);

  // @TODO calculate from placeholder width
  const initialInputWidth = '4.25rem';

  // have this passed as a prop?
  const ensSubdomain = '.ewa.akasha.eth';

  const handleCopyEthAddress = () => {
    navigator.clipboard.writeText(ethAddress);
  };

  const handleCopyEns = () => {
    navigator.clipboard.writeText(`${name}${ensSubdomain}`);
  };

  const handleCancel = () => {
    setName('');
    setTextInputComputedWidth(initialInputWidth);
    setLoading(false);
    setError(false);
    setSuccess(false);
  };

  React.useEffect(() => {
    if (providerData.name) {
      setName(providerData.name);
    }
    setTextInputComputedWidth(initialInputWidth);
  }, []);

  React.useEffect(() => {
    if (validEns !== undefined) {
      setLoading(false);
    }
    if (validEns === 'invalid') {
      setError(true);
    }
    if (validEns === 'valid') {
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
      setLoading(true);
      if (hiddenSpanRef.current) {
        setTextInputComputedWidth(`${(hiddenSpanRef.current.offsetWidth + 2) / 16}rem`);
      }
    } else if (!value) {
      setLoading(false);
      if (hiddenSpanRef.current) {
        setTextInputComputedWidth(initialInputWidth);
      }
    }
    validateEns(value);
  };

  const handleSave = () => {
    handleSubmit({
      name,
      providerName: providerData.providerName,
    });
  };

  const renderIcon = () => {
    if (loading) {
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
      <Box direction="column" pad="medium">
        <Box direction="column" pad="xsmall">
          <Text weight="bold"> {titleLabel}</Text>
          <Box direction="row" gap="xxsmall" pad={{ bottom: 'xsmall' }} align="center">
            <Text color="secondaryText">{ethAddress}</Text>
            <Icon type="copy" onClick={handleCopyEthAddress} clickable={true} />
          </Box>
        </Box>
        {providerData.name && (
          <Box direction="column" pad="xsmall">
            <Text weight="bold"> {secondaryTitleLabel}</Text>
            <Box direction="row" gap="xxsmall" pad={{ bottom: 'xsmall' }} align="center">
              <Box direction="row" align="center">
                <Text color="secondaryText">{providerData.name}</Text>
                <Text color="accentText">{ensSubdomain}</Text>
              </Box>

              <Icon type="copy" onClick={handleCopyEns} clickable={true} />
            </Box>
          </Box>
        )}
        {!providerData.name && (
          <Box direction="column">
            <FormField
              name="name"
              error={error ? errorLabel : null}
              htmlFor="text-input"
              label={
                <StyledText color="secondaryText" size="small">
                  {nameLabel}
                </StyledText>
              }
            >
              <Box justify="between" direction="row" pad={{ bottom: '11px', left: '11px' }}>
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
                  <Text color="accentText" size="large">
                    {ensSubdomain}
                  </Text>
                </Box>

                {renderIcon()}
              </Box>
            </FormField>

            <Box direction="row" gap="xsmall" justify="end">
              <Button label={cancelLabel} onClick={handleCancel} />
              <Button label={saveLabel} onClick={handleSave} primary={true} />
            </Box>
          </Box>
        )}
      </Box>
    </MainAreaCardBox>
  );
};

export default EnsFormCard;
