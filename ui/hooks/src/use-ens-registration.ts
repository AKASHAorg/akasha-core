import { IAkashaError } from '@akashaproject/ui-awf-typings';
import {
  ProfileProviderProperties,
  ProfileProviders,
} from '@akashaproject/ui-awf-typings/lib/profile';
import * as React from 'react';
import { createErrorHandler } from './utils/error-handler';
import { switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';

export interface UseENSRegistrationProps {
  profileService: any;
  ensService: any;
  ethAddress: string | null;
  onError?: (err: IAkashaError) => void;
}

export interface UseENSRegistrationActions {
  /**
   *  get ENS name associated with an ethereum address
   */
  getENSByAddress: (payload: { ethAddress: string }) => void;
  /**
   *  register a new ENS name
   */
  register: (payload: { userName: string }) => void;
  /**
   *  update a user name
   */
  updateUserName: (userName: string) => void;
  /**
   *  check if username is valid
   */
  validateName: (userName: string) => void;
  /**
   *  claim a username
   */
  claim: (payload: { userName: string }) => void;
  /**
   *  reset hook internal state
   */
  resetRegistrationStatus: () => void;
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
  //reducer related
  getENSByAddressQuery: null | string;
  registerQuery: null | string;
  validateNameQuery: null | string;
  claimQuery: null | string;
}

const initialENSRegistrationState: UseENSRegistrationState = {
  status: {
    registering: false,
    claiming: false,
    registrationComplete: false,
  },
  userName: null,
  userNameChanged: false,
  isAvailable: null,
  isValidating: false,
  errorMessage: null,
  alreadyRegistered: false,
  //reducer related
  getENSByAddressQuery: null,
  registerQuery: null,
  validateNameQuery: null,
  claimQuery: null,
};

export type IENSRegistrationAction =
  | { type: 'GET_ENS_BY_ADDRESS'; payload: string | null }
  | {
      type: 'GET_ENS_BY_ADDRESS_SUCCESS';
      payload: string;
    }
  | {
      type: 'GET_ENS_BY_ADDRESS_ERROR';
      payload: string;
    }
  | { type: 'REGISTER'; payload: string | null }
  | {
      type: 'REGISTER_SUCCESS';
      payload: string;
    }
  | { type: 'UPDATE_USERNAME'; payload: string }
  | { type: 'VALIDATE_NAME'; payload: string }
  | {
      type: 'VALIDATE_NAME_SUCCESS';
      payload: boolean;
    }
  | { type: 'CLAIM'; payload: string }
  | { type: 'CLAIM_SUCCESS' }
  | {
      type: 'CLAIM_ERROR';
      payload: string;
    }
  | { type: 'RESET_REGISTRATION_STATUS' };

const ENSRegistrationStateReducer = (
  state: UseENSRegistrationState,
  action: IENSRegistrationAction,
) => {
  switch (action.type) {
    case 'GET_ENS_BY_ADDRESS':
      return { ...state, getENSByAddressQuery: action.payload };
    case 'GET_ENS_BY_ADDRESS_SUCCESS':
      return {
        ...state,
        getENSByAddressQuery: null,
        userName: action.payload,
        alreadyRegistered: true,
      };
    case 'GET_ENS_BY_ADDRESS_ERROR':
      return {
        ...state,
        getENSByAddressQuery: null,
        errorMessage: action.payload,
        alreadyRegistered: false,
      };

    case 'REGISTER':
      return {
        ...state,
        registerQuery: action.payload,
        status: { ...state.status, registering: true },
      };
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        registerQuery: null,
        userName: action.payload,
        status: {
          registrationComplete: true,
          registering: false,
          claiming: false,
        },
      };

    case 'UPDATE_USERNAME':
      return {
        ...state,
        userName: action.payload,
      };

    case 'VALIDATE_NAME':
      return {
        ...state,
        validateUsernameQuery: action.payload,
        isValidating: true,
      };
    case 'VALIDATE_NAME_SUCCESS':
      return {
        ...state,
        validateUsernameQuery: null,
        isValidating: false,
        isAvailable: action.payload,
      };

    case 'CLAIM':
      return { ...state, claimQuery: action.payload };
    case 'CLAIM_SUCCESS':
      return {
        ...state,
        claimQuery: null,
        status: {
          ...state.status,
          claiming: false,
          registrationComplete: true,
        },
      };
    case 'CLAIM_ERROR':
      return {
        ...state,
        claimQuery: null,
        errorMessage: action.payload,

        status: {
          registrationComplete: false,
          registering: false,
          claiming: false,
        },
      };

    case 'RESET_REGISTRATION_STATUS':
      return {
        ...state,
        status: {
          registering: false,
          claiming: false,
          registrationComplete: false,
        },
      };

    default:
      throw new Error('[UseENSRegistrationReducer] action is not defined!');
  }
};

const useENSRegistration = (
  props: UseENSRegistrationProps,
): [UseENSRegistrationState, UseENSRegistrationActions] => {
  const { profileService, ensService, ethAddress } = props;
  const [registrationState, dispatch] = React.useReducer(
    ENSRegistrationStateReducer,
    initialENSRegistrationState,
  );

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

  React.useEffect(() => {
    if (registrationState.getENSByAddressQuery) {
      const call = ensService.resolveAddress({
        ethAddress: registrationState.getENSByAddressQuery,
      });
      const sub = call.subscribe({
        next: (resp: any) => {
          if (resp.data && resp.channelInfo.args.ethAddress === ethAddress) {
            dispatch({ type: 'GET_ENS_BY_ADDRESS_SUCCESS', payload: resp.data });
          }
        },
        error: (err: Error) => {
          createErrorHandler('useEnsRegistration.getENSByAddress', false, props.onError)(err);
          dispatch({
            type: 'GET_ENS_BY_ADDRESS_ERROR',
            payload: `Failed to get ENS name. ${err.message}`,
          });
        },
      });
      return () => sub.unsubscribe();
    }
    return;
  }, [registrationState.getENSByAddressQuery]);

  React.useEffect(() => {
    const userName = registrationState.registerQuery;
    if (userName) {
      const register = ensService.registerName({
        name: `${userName.replace('@', '').replace('.akasha.eth', '')}`,
      });
      let userNameCallSub: Subscription;
      const registerCallSub = register.subscribe({
        next: () => {
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
          userNameCallSub = userNameCall
            .pipe(
              switchMap(() => addProvider),
              switchMap(() => makeDefault),
            )
            .subscribe({
              next: () => {
                dispatch({ type: 'REGISTER_SUCCESS', payload: userName });
              },
              error: createErrorHandler(
                'useEnsRegistration.registerUsername',
                false,
                props.onError,
              ),
            });
        },
        error: createErrorHandler('useEnsRegistration.registerName', false, props.onError),
      });
      return () => {
        registerCallSub.unsubscribe();
        if (userNameCallSub.unsubscribe) {
          userNameCallSub.unsubscribe();
        }
      };
    }
    return;
  }, [registrationState.registerQuery]);

  React.useEffect(() => {
    if (registrationState.validateNameQuery) {
      const channel = ensService.isAvailable({ name: registrationState.validateNameQuery });

      const sub = channel.subscribe({
        next: (resp: any) => {
          dispatch({ type: 'VALIDATE_NAME_SUCCESS', payload: resp.data });
        },
        error: createErrorHandler('useEnsRegistration.validateName', false, props.onError),
      });
      return () => sub.unsubscribe();
    }
    return;
  }, [registrationState.validateNameQuery]);

  React.useEffect(() => {
    if (registrationState.claimQuery) {
      const call = ensService.claimName({ name: registrationState.claimQuery });
      const sub = call.subscribe({
        next: () => {
          dispatch({ type: 'CLAIM_SUCCESS' });
        },
        error: (err: Error) => {
          createErrorHandler('useEnsRegistration.claim', false, props.onError)(err);
          dispatch({ type: 'CLAIM_ERROR', payload: `ENS claim failed. ${err.message}` });
        },
      });
      return () => sub.unsubscribe();
    }
    return;
  }, [registrationState.claimQuery]);

  const actions: UseENSRegistrationActions = {
    getENSByAddress: ({ ethAddress }) => {
      dispatch({ type: 'GET_ENS_BY_ADDRESS', payload: ethAddress });
    },
    register: ({ userName }) => {
      dispatch({ type: 'REGISTER', payload: userName });
    },
    updateUserName: (userName: string) => {
      dispatch({ type: 'UPDATE_USERNAME', payload: userName });
    },
    validateName: (userName: string) => {
      dispatch({ type: 'VALIDATE_NAME', payload: userName });
    },
    claim: ({ userName }: { userName: string }) => {
      dispatch({ type: 'CLAIM', payload: userName });
    },
    resetRegistrationStatus() {
      dispatch({ type: 'RESET_REGISTRATION_STATUS' });
    },
  };
  return [registrationState, actions];
};

export default useENSRegistration;
