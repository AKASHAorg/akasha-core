import * as React from "react";
import { concat } from "rxjs";

export interface UseENSRegistrationProps {
  profileService: any;
  ensService: any;
  ethAddress: string | null;
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
};

// const ENS_REGISTRATION_STATUS = 'ens-registration-status';

const useENSRegistration = (props: UseENSRegistrationProps): [UseENSRegistrationState, UseENSRegistrationActions] => {
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
  }, [registrationState.userName, registrationState.status.registering])

  const actions: UseENSRegistrationActions = {
    getENSByAddress: ({ ethAddress }: { ethAddress: string }) => {
      const call = ensService.resolveAddress({ ethAddress });
      call.subscribe((resp: any) => {
        if (resp.data && resp.channelInfo.args.ethAddress === ethAddress) {
          setRegistrationState(prev => ({
            ...prev,
            userName: resp.data,
            alreadyRegistered: true,
          }));
        }
      }, (err: Error) => {
        setRegistrationState(prev => ({
          ...prev,
          errorMessage: `Failed to get ENS name. ${err.message}`,
          alreadyRegistered: false,
        }));
      });
    },
    register: ({ userName }: { userName: string, ethAddress: string }) => {
      setRegistrationState(prev => ({
        ...prev,
        status: {
          ...prev.status,
          registering: true,
        }
      }));
      const register = ensService.registerName({ name: `@${userName.replace('@', '')}` });
      register.subscribe((_resp: any) => {
        const userNameCall = profileService.registerUserName({ userName: `@${userName.replace('@', '')}` });
        const makeDefault = profileService.makeDefaultProvider({
          provider: 'ewa.providers.ens',
          property: 'userName',
          value: `@${userName.replace('@', '')}`
        });
        concat(userNameCall, makeDefault).subscribe(() => {
          setRegistrationState(prev => ({
            ...prev,
            userName,
            status: {
              registrationComplete: true,
              registering: false,
              claiming: false
            }
          }));
        })
      });
    },
    updateUserName: (userName: string) => {
      setRegistrationState(prev => ({ ...prev, userName }))
    },
    validateName: (userName: string) => {
      const channel = ensService.isAvailable({ name: userName });
      setRegistrationState(prev => ({
        ...prev,
        isValidating: true
      }));
      channel.subscribe((resp: any) => {
        setRegistrationState(prev => ({
          ...prev,
          isValidating: false,
          isAvailable: resp.data,
        }))
      });
    },
    claim: ({ userName }: { userName: string }) => {
      const call = ensService.claimName({ name: userName });
      call.subscribe(() => {
        setRegistrationState(prev => ({
          ...prev,
          status: Object.assign({}, prev.status, {
            claiming: false,
            registrationComplete: true,
          }),
        }));
      }, (err: Error) => {
        setRegistrationState(prev => ({
          ...prev,
          errorMessage: `ENS claim failed. ${err.message}`,
          status: {
            registrationComplete: false,
            registering: false,
            claiming: false,
          }
        }));
      });
    },
    registerLocalUsername: ({ userName }: { userName: string }) => {
      const registerLocal = profileService.registerUserName({ userName: userName });
      setRegistrationState(prev => ({
        ...prev,
        status: {
          ...prev.status,
          registering: true,
        },
      }));
      registerLocal.subscribe((_resp: any) => {
        const makeDefault = profileService.makeDefaultProvider({
          provider: 'ewa.providers.basic',
          property: 'userName',
          value: userName,
        });
        makeDefault.subscribe((_resp: any) => {
          setRegistrationState(prev => ({
            ...prev,
            status: {
              ...prev.status,
              registering: false,
              registrationComplete: true,
            }
          }))
        }, (err: Error) => {
          setRegistrationState(prev => ({
            ...prev,
            errorMessage: `Failed to set default provider. ${err.message}`
          }));
        });
      }, (err: Error) => {
        setRegistrationState(prev => ({
          ...prev,
          errorMessage: `Failed to register local username. ${err.message}`,
        }));
      });
    },
    resetRegistrationStatus() {
      setRegistrationState(prev => ({
        ...prev,
        status: {
          registering: false,
          claiming: false,
          registrationComplete: false,
        }
      }))
    }
  }
  return [registrationState, actions];
}

export default useENSRegistration;
