import * as React from 'react';
export interface IUserNameOption {
  name: 'ensSubdomain' | 'ensDomain' | 'local' | 'ethAddress';
  label: string;
  isDisabled?: boolean;
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
  onSave: (
    data:
      | IEnsData
      | {
          name: string;
          option: IUserNameOption;
        },
  ) => void;
  onCancel?: () => void;
  isValidating?: boolean;
  ensSubdomain?: string;
  userNameProviderOptions: IUserNameOption[];
  disableInputOnOption?: {
    [key: string]: boolean;
  };
  errorMessage?: string | null;
  registrationStatus?: {
    registering: boolean;
    claiming: boolean;
  };
}
export interface IEnsData {
  name?: string;
}
declare const EnsFormCard: React.FC<IEnsFormCardProps>;
export default EnsFormCard;
