import { Box, RadioButton, Text } from 'grommet';
import * as React from 'react';
import styled from 'styled-components';
import Button from '../Button';
import Icon from '../Icon';
import { StyledLayer } from '../ListModal/styled-modal';
import Spinner from '../Spinner';
import { MainAreaCardBox } from '../EntryCard/basic-card-box';
import { StyledText } from '../BoxFormCard/styled-form-card';

export enum ENSOptionTypes {
  ENS_AKASHA_SUBDOMAIN = 0,
  BRING_YOUR_OWN_ENS,
  ETH_ADDRESS,
}

export interface EnsFormOption {
  type: ENSOptionTypes;
  label: string;
  fieldType?: 'dropdown' | 'textfield' | 'text';
  fieldOptions?: string[];
  value?: string | null;
  textDetails?: React.ReactElement;
  defaultChecked?: boolean;
  disabled?: boolean;
}
// validEns, userNameProviderOptions
export interface IEnsFormCardProps {
  className?: string;
  titleLabel: string;
  nameLabel: string;
  errorLabel: string;
  cancelLabel: string;
  saveLabel: string;
  onSave: (option: EnsFormOption | null) => void;
  onCancel?: () => void;
  isValidating?: boolean;
  ensSubdomain?: string;
  disableInputOnOption?: { [key: string]: boolean };
  errorMessage?: string | null;
  registrationStatus?: { registering: boolean; claiming: boolean };
  options: EnsFormOption[];
  saving?: boolean;
}

export interface IEnsData {
  name?: string;
}

const StyledErrorBox = styled(Box)`
  color: ${props => props.theme.colors.errorText};
  font-size: ${props => props.theme.text?.xsmall};
`;

const EnsFormCard: React.FC<IEnsFormCardProps> = props => {
  const {
    className,
    titleLabel,
    nameLabel,
    cancelLabel,
    saveLabel,
    errorMessage,
    registrationStatus,
  } = props;
  const [activeOption, setActiveOption] = React.useState<EnsFormOption | null>(null);

  const handleCancel = () => {
    if (props.onCancel) {
      props.onCancel();
    }
  };

  const handleSave = () => {
    props.onSave(activeOption);
  };

  const changeOption = (option: EnsFormOption) => () => {
    setActiveOption(option);
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
            <Text weight="bold" margin="0 auto 1.5rem" size="large">
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
            <StyledText color="secondaryText" size="small" margin={{ bottom: 'xsmall' }}>
              {nameLabel}
            </StyledText>
          </Box>
          <Box>
            {props.options.map(option => (
              <Box
                key={`${option.type}`}
                flex={true}
                direction="column"
                margin={{ bottom: '1.5rem' }}
              >
                <RadioButton
                  name={`${option.type}`}
                  disabled={option.disabled}
                  label={
                    <Text size="large" weight="bold">
                      {option.label}
                    </Text>
                  }
                  checked={
                    activeOption?.type === option.type
                      ? true
                      : !activeOption && option.defaultChecked
                  }
                  onChange={changeOption(option)}
                />
                {option.value && (
                  <Box margin={{ left: '1.75rem', top: 'xsmall' }}>
                    <Text size="medium">{option.value}</Text>
                  </Box>
                )}
                {option.textDetails && (
                  <Box margin={{ left: '1.75em', top: 'xsmall' }}>
                    <Text size="small" color="secondaryText">
                      {option.textDetails}
                    </Text>
                  </Box>
                )}
              </Box>
            ))}
          </Box>
          <Box direction="row" gap="xsmall" justify="between" align="center">
            <StyledErrorBox
              direction="row"
              style={{ fontSize: '0.67em', overflow: 'hidden', textOverflow: 'ellipsis' }}
            >
              {errorMessage && <>{errorMessage}</>}
            </StyledErrorBox>
            <Box direction="row">
              <Button margin={{ right: '0.5rem' }} label={cancelLabel} onClick={handleCancel} />
              <Button
                label={
                  props.saving ? <Spinner style={{ padding: 0 }} size={15} /> : saveButtonLabel
                }
                onClick={handleSave}
                disabled={(registrationStatus && registrationStatus.registering) || props.saving}
                primary={true}
              />
            </Box>
          </Box>
        </Box>
      </MainAreaCardBox>
    </StyledLayer>
  );
};
export default EnsFormCard;
