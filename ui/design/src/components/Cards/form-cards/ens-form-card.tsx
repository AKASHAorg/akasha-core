import { Box, RadioButton, Text } from 'grommet';
import * as React from 'react';
// import { isMobile } from 'react-device-detect';
import { Button } from '../../Buttons/index';
import { Icon } from '../../Icon/index';
import { StyledLayer } from '../../Modals/common/styled-modal';
import Spinner from '../../Spinner';
import { MainAreaCardBox } from '../common/basic-card-box';
import { StyledText /* StyledTextInput */ } from './styled-form-card';

export interface IUserNameOption {
  /* Option identifier (ensDomain, local, ethAddress), ensSubdomain added by default */
  name: 'ensSubdomain' | 'ensDomain' | 'local' | 'ethAddress';
  /* Can be anything. It will be displayed in the UI */
  label: string;
  /* This option cannot be selected, serving just as a preview of coming soon functionality */
  isDisabled?: boolean;
}

export interface EnsFormOptions {
  label: string;
  valueType?: 'dropdown' | 'textfield' | 'text';
  value: string;
  textDetails: string;
}

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
  onSave: (data: IEnsData | { name: string; option: IUserNameOption }) => void;
  onCancel?: () => void;
  isValidating?: boolean;
  ensSubdomain?: string;
  userNameProviderOptions: IUserNameOption[];
  disableInputOnOption?: { [key: string]: boolean };
  errorMessage?: string | null;
  registrationStatus?: { registering: boolean; claiming: boolean };

  options: EnsFormOptions[];
}

export interface IEnsData {
  name?: string;
}
// tslint:disable:cyclomatic-complexity
/* eslint-disable complexity */
const EnsFormCard: React.FC<IEnsFormCardProps> = props => {
  const {
    className,
    titleLabel,
    nameLabel,
    // errorLabel,
    // ethAddressLabel,
    // ethNameLabel,
    // consentText,
    // consentUrl,
    // consentLabel,
    poweredByLabel,
    iconLabel,
    cancelLabel,
    saveLabel,
    // changeButtonLabel,
    // nameFieldPlaceholder,
    // ethAddress,
    providerData,
    onSave,
    // validateEns,
    validEns,
    // isValidating,
    ensSubdomain = 'akasha.eth',
    userNameProviderOptions,
    // disableInputOnOption,
    errorMessage,
    registrationStatus,
  } = props;

  const [name, setName] = React.useState('');

  const [error, setError] = React.useState(false);
  const [, /* success */ setSuccess] = React.useState(false);
  // const [optionsVisible, setOptionsVisible] = React.useState(false);

  const userNameOptions: IUserNameOption[] = [
    {
      name: 'ensSubdomain',
      // show subdomain suffix
      label: `${name.replace(`.${ensSubdomain}`, '')}.${ensSubdomain}`,
    },
    ...userNameProviderOptions,
  ];
  // make ensSubdomain option as default
  const [selectedUsernameOption /* setSelectedUsernameOption */] = React.useState('ensSubdomain');

  React.useEffect(() => {
    if (providerData.name) {
      setName(providerData.name);
    }
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

  // const renderIcon = () => {
  //   if (isValidating) {
  //     return <Icon type="loading" />;
  //   }
  //   if (error) {
  //     return <Icon type="error" />;
  //   }
  //   if (success) {
  //     return <Icon type="check" accentColor={true} />;
  //   }
  //   return;
  // };

  // const showOptions = () => {
  //   setOptionsVisible(true);
  // };

  // const handleSelectEns = (selected: string) => {
  //   setSelectedUsernameOption(selected);
  // };

  // const handleCopyEthAddress = () => {
  //   navigator.clipboard.writeText(ethAddress);
  // };

  // const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = ev.target.value;
  //   setName(value);
  //   setError(false);
  //   if (validateEns) {
  //     validateEns(value);
  //   }
  // };

  const handleCancel = () => {
    setName('');
    setError(false);
    setSuccess(false);
    if (props.onCancel) {
      props.onCancel();
    }
  };

  const handleSave = () => {
    onSave({
      name,
      option: userNameOptions.find(o => o.name === selectedUsernameOption),
    });
  };

  let saveButtonLabel: React.ReactNode = saveLabel;
  if (registrationStatus && (registrationStatus.registering || registrationStatus.claiming)) {
    saveButtonLabel = <Spinner style={{ padding: 0 }} size={15} />;
  }

  return (
    <StyledLayer className={className} style={{ overflow: 'hidden' }}>
      <MainAreaCardBox>
        <Box direction="column" pad="large">
          <Box direction="row" margin={{ top: 'xsmall', bottom: 'medium' }} align="start">
            <Text weight="bold" margin="0 auto 2rem" size="xlarge">
              {titleLabel}
            </Text>
            <Icon
              type="close"
              color="secondaryText"
              primaryColor={true}
              clickable={true}
              onClick={handleCancel}
            />
          </Box>
          <Box direction="row" align="center">
            <StyledText color={error ? 'errorText' : 'secondaryText'} size="small">
              {nameLabel}
            </StyledText>
          </Box>
          <Box>
            {props.options.map((option, idx) => (
              <Box key={`${option.label}-${idx}`}>
                <RadioButton name={option.label} label={option.label} />
              </Box>
            ))}
          </Box>
          <Box direction="row" gap="xsmall" justify="between" align="center">
            <Box direction="row" align="center">
              {poweredByLabel && (
                <Text color="secondaryText" size="10px" margin={{ right: 'xxsmall' }}>
                  {poweredByLabel}
                </Text>
              )}
              {iconLabel && (
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
              )}
              <Icon type="questionMark" size="xxs" clickable={true} />
            </Box>
            <Box direction="row">{errorMessage && <>{errorMessage}</>}</Box>
            <Box direction="row">
              <Button margin={{ right: '0.5rem' }} label={cancelLabel} onClick={handleCancel} />
              <Button
                label={saveButtonLabel}
                onClick={handleSave}
                disabled={registrationStatus && registrationStatus.registering}
                primary={true}
              />
            </Box>
          </Box>
        </Box>
      </MainAreaCardBox>
    </StyledLayer>
  );
};
// tslint:enable:cyclomatic-complexity
/* eslint-enable complexity */
export default EnsFormCard;
