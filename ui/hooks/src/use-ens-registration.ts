import { IAkashaError } from '@akashaproject/ui-awf-typings';
import * as React from 'react';
import { forkJoin } from 'rxjs';
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
  registerLocalUsername: (payload: { userName: string }) => void;
  resetRegistrationStatus: () => void;
}

// const ENS_REGISTRATION_STATUS = 'ens-registration-status';

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
    register: ({ userName }: { userName: string; ethAddress: string }) => {
      setRegistrationState(prev => ({
        ...prev,
        status: {
          ...prev.status,
          registering: true,
        },
      }));
      const register = ensService.registerName({ name: `${userName.replace('@', '')}` });
      register.subscribe((_resp: any) => {
        // if (!resp?.data) {
        //   return createErrorHandler(
        //     'useEnsRegistration.registerName.nullResponse',
        //     false,
        //     props.onError
        //   )(new Error(`Cannot register ${userName}. Unexpected response received!`))
        // }
        const userNameCall = profileService.registerUserName({
          userName: `${userName.replace('@', '')}`,
        });
        const makeDefault = profileService.makeDefaultProvider({
          provider: 'ewa.providers.ens',
          property: 'userName',
          value: `${userName.replace('@', '')}`,
        });
        forkJoin([userNameCall, makeDefault]).subscribe((responses: [any, any]) => {
          const [userNameResp, makeDefaultResp] = responses;

          if (!userNameResp?.data) {
            return createErrorHandler(
              'useEnsRegistration.nullData',
              false,
              props.onError,
            )(new Error(`Cannot save ${userName} to your profile. Unexpected response received!`));
          }

          if (!makeDefaultResp?.data) {
            return createErrorHandler(
              'useEnsRegistration.nullData',
              false,
              props.onError,
            )(
              new Error(
                `Cannot set default provider for ${userName}. Unexpected response received!`,
              ),
            );
          }

          setRegistrationState(prev => ({
            ...prev,
            userName,
            status: {
              registrationComplete: true,
              registering: false,
              claiming: false,
            },
          }));
        }, createErrorHandler('useEnsRegitration.registerUsername', false, props.onError));
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
    registerLocalUsername: ({ userName }: { userName: string }) => {
      const registerLocal = profileService.registerUserName({ userName: userName });
      setRegistrationState(prev => ({
        ...prev,
        userName,
        status: {
          ...prev.status,
          registering: true,
        },
      }));
      registerLocal.subscribe(
        () => {
          const makeDefault = profileService.makeDefaultProvider({
            provider: 'ewa.providers.basic',
            property: 'userName',
            value: userName,
          });
          makeDefault.subscribe(
            (response: any) => {
              if (!response.data) {
                return createErrorHandler(
                  'useEnsRegistration.registerLocalUsername.nullResp',
                  false,
                  props.onError,
                )(new Error(`Cannot set ${userName} as default. Unexpected response.`));
              }
              setRegistrationState(prev => ({
                ...prev,
                status: {
                  ...prev.status,
                  registering: false,
                  registrationComplete: true,
                },
              }));
            },
            (err: Error) => {
              setRegistrationState(prev => ({
                ...prev,
                errorMessage: `Failed to set default provider. ${err.message}`,
              }));
            },
          );
        },
        (err: Error) => {
          createErrorHandler('useEnsRegistration.registerLocalUsername', false, props.onError)(err);
          setRegistrationState(prev => ({
            ...prev,
            errorMessage: `Failed to register local username. ${err.message}`,
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
