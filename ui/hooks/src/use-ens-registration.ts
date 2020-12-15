import * as React from "react";

export interface UseENSRegistrationProps {
  profileService: any;
  ensService: any;
  onRegisterSuccess: () => void;
  ethAddress: string | null;
}

export interface UseENSRegistrationState {
  status: {
    registering: boolean;
    claiming: boolean;
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
}

export interface UseENSRegistrationActions {
  saveToProfile: (payload: { userName: string }) => void;
  getENSByAddress: (payload: { ethAddress: string }) => void;
  register: (payload: { userName: string }) => void;
  updateUserName: (userName: string) => void;
  validateName: (userName: string) => void;
  claim: (payload: { userName: string }) => void;
};

// const ENS_REGISTRATION_STATUS = 'ens-registration-status';

const useENSRegistration = (props: UseENSRegistrationProps): [UseENSRegistrationState, UseENSRegistrationActions] => {
  const { profileService, ensService, onRegisterSuccess, ethAddress } = props;
  const [registrationState, setRegistrationState] = React.useState<UseENSRegistrationState>({
    isAvailable: null,
    isValidating: false,
    errorMessage: null,
    userName: null,
    status: {
      registering: false,
      claiming: false,
    },
    userNameChanged: false,
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
    saveToProfile: ({ userName }: { userName: string }) => {
      setRegistrationState(prev => ({
        ...prev,
        registering: true
      }))
      const call = profileService.registerUserName({ userName });
      call.subscribe((_resp: any) => {
        setRegistrationState(prev => ({ ...prev, registering: false }));
        onRegisterSuccess();
      }, (err: Error) => {
        setRegistrationState(prev => ({
          ...prev,
          registering: false,
          errorMessage: `Error registering address: ${err.message}`,
        }));
      });
    },
    getENSByAddress: ({ ethAddress }: { ethAddress: string }) => {
      const call = ensService.resolveAddress({ ethAddress });
      call.subscribe((resp: any) => {
        if (resp.data && resp.channelInfo.args.ethAddress === ethAddress) {
          setRegistrationState(prev => ({
            ...prev,
            userName: resp.data
          }));
        }
      }, (err: Error) => {
        setRegistrationState(prev => ({
          ...prev,
          errorMessage: `Failed to get ENS name. ${err.message}`,
        }))
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
      const call = ensService.registerName({ name: registrationState.userName });
      call.subscribe((_resp: any) => {
        setRegistrationState(prev => ({
          ...prev,
          userName,
          status: {
            registering: false,
            claiming: false
          }
        }));
      });
    },
    updateUserName: (userName: string) => {
      setRegistrationState(prev => ({ ...prev, userName }))
    },
    validateName: (userName: string) => {
      const channel = ensService.isAvailable({ name: userName });
      setRegistrationState(prev => ({
        ...prev,
        isValidating: true,
        isAvailable: false,
      }));
      channel.subscribe((resp: any) => {
        console.log(resp, 'response');
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
            claiming: true,
          }),
        }));
      }, (err: Error) => {
        setRegistrationState(prev => ({
          ...prev,
          errorMessage: `ENS claim failed. ${err.message}`,
          status: {
            registering: false,
            claiming: false,
          }
        }));
      });
    }
  }
  return [registrationState, actions];
}

export default useENSRegistration;
