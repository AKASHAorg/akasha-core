import { IAkashaError } from '@akashaproject/ui-awf-typings';
import {
  ProfileProviderProperties,
  ProfileProviders,
} from '@akashaproject/ui-awf-typings/lib/profile';
import * as React from 'react';
import { concat } from 'rxjs';
import { createErrorHandler } from './utils/error-handler';

export interface UseENSRegistrationProps {
  profileService: any;
  ensService: any;
  ethAddress: string | null;
  onError?: (err: IAkashaError) => void;
}

export interface UseENSRegistrationState {
  status: {
    registering: boolean;
    claiming: boolean;
    /* used to signal modal close */
    registrationComplete: boolean;
  };
  userName: null | string;
  /* Triggered by a form change */
  userNameChanged: boolean;
  /* wether the specified name was already registered */
  isAvailable: boolean | null;
  /* generic flag used when validating name */
  isValidating: boolean;
  /* error that must be shown in form */
  errorMessage: null | string;
  alreadyRegistered: boolean;
}

export interface UseENSRegistrationActions {
  getENSByAddress: (payload: { ethAddress: string }) => void;
  register: (payload: { userName: string }) => void;
  updateUserName: (userName: string) => void;
  validateName: (userName: string) => void;
  claim: (payload: { userName: string }) => void;
  resetRegistrationStatus: () => void;
}

const useENSRegistration = (
  props: UseENSRegistrationProps,
): [UseENSRegistrationState, UseENSRegistrationActions] => {
  const { profileService, ensService, ethAddress } = props;
  const [registrationState, setRegistrationState] = React.useState<UseENSRegistrationState>({
    isAvailable: null,
    isValidating: false,
    errorMessage: null,
    userName: null,
    status: {
      registering: false,
      claiming: false,
      registrationComplete: false,
    },
    userNameChanged: false,
    alreadyRegistered: false,
  });

  React.useEffect(() => {
    if (ethAddress) {
      actions.getENSByAddress({ ethAddress });
    }
  }, [ethAddress]);

  React.useEffect(() => {
    if (registrationState.userName && !registrationState.status.registering) {
      actions.validateName(registrationState.userName);
    }
  }, [registrationState.userName, registrationState.status.registering]);

  const actions: UseENSRegistrationActions = {
    getENSByAddress: (_payload: { ethAddress: string }) => {
      const call = ensService.resolveAddress({ ethAddress });
      call.subscribe(
        (resp: any) => {
          if (resp.data && resp.channelInfo.args.ethAddress === ethAddress) {
            setRegistrationState(prev => ({
              ...prev,
              userName: resp.data,
              alreadyRegistered: true,
            }));
          }
        },
        (err: Error) => {
          createErrorHandler('useEnsRegistration.getENSByAddress', false, props.onError)(err);
          setRegistrationState(prev => ({
            ...prev,
            errorMessage: `Failed to get ENS name. ${err.message}`,
            alreadyRegistered: false,
          }));
        },
      );
    },
    register: ({ userName }) => {
      setRegistrationState(prev => ({
        ...prev,
        status: {
          ...prev.status,
          registering: true,
        },
      }));
      const register = ensService.registerName({
        name: `${userName.replace('@', '').replace('.akasha.eth', '')}`,
      });
      register.subscribe((_resp: any) => {
        const userNameCall = profileService.registerUserName({
          userName: `${userName.replace('@', '').replace('.akasha.eth', '')}`,
        });
        const makeDefault = profileService.makeDefaultProvider([
          {
            provider: ProfileProviders.ENS,
            property: ProfileProviderProperties.USERNAME,
            value: `${userName.replace('@', '')}`,
          },
        ]);
        const addProvider = profileService.addProfileProvider([
          {
            provider: ProfileProviders.ENS,
            property: ProfileProviderProperties.USERNAME,
            value: `${userName.replace('@', '')}`,
          },
        ]);
        concat(userNameCall, addProvider, makeDefault).subscribe((resp: any) => {
          if (!resp.data) {
            return createErrorHandler(
              'useEnsRegistration.nullData',
              false,
              props.onError,
            )(new Error(`Cannot save ${userName} to your profile.`));
          }
          if (resp.data.makeDefaultProvider) {
            setRegistrationState(prev => ({
              ...prev,
              userName,
              status: {
                registrationComplete: true,
                registering: false,
                claiming: false,
              },
            }));
          }
        }, createErrorHandler('useEnsRegistration.registerUsername', false, props.onError));
      }, createErrorHandler('useEnsRegistration.registerName', false, props.onError));
    },
    updateUserName: (userName: string) => {
      setRegistrationState(prev => ({ ...prev, userName }));
    },
    validateName: (userName: string) => {
      const channel = ensService.isAvailable({ name: userName });
      setRegistrationState(prev => ({
        ...prev,
        isValidating: true,
      }));
      channel.subscribe((resp: any) => {
        setRegistrationState(prev => ({
          ...prev,
          isValidating: false,
          isAvailable: resp.data,
        }));
      }, createErrorHandler('useEnsRegistration.validateName', false, props.onError));
    },
    claim: ({ userName }: { userName: string }) => {
      const call = ensService.claimName({ name: userName });
      call.subscribe(
        () => {
          setRegistrationState(prev => ({
            ...prev,
            status: Object.assign({}, prev.status, {
              claiming: false,
              registrationComplete: true,
            }),
          }));
        },
        (err: Error) => {
          createErrorHandler('useEnsRegistration.claim', false, props.onError)(err);
          setRegistrationState(prev => ({
            ...prev,
            errorMessage: `ENS claim failed. ${err.message}`,
            status: {
              registrationComplete: false,
              registering: false,
              claiming: false,
            },
          }));
        },
      );
    },
    resetRegistrationStatus() {
      setRegistrationState(prev => ({
        ...prev,
        status: {
          registering: false,
          claiming: false,
          registrationComplete: false,
        },
      }));
    },
  };
  return [registrationState, actions];
};

export default useENSRegistration;
