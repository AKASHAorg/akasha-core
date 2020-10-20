import * as React from 'react';
import DS from '@akashaproject/design-system';
import { filter, takeLast } from 'rxjs/operators';
import { race } from 'rxjs';
import { IProfileData } from '@akashaproject/design-system/lib/components/Cards/profile-cards/profile-widget-card';

const { useGlobalLogin } = DS;

type voidFunc<T = Object> = (arg?: T) => void;

export interface ErrorObj {
  errorKey: string;
  error: Error;
  critical: boolean;
}

export interface ILoggedProfile {
  ethAddress?: string;
  token?: string;
  profileData?: IProfileData;
}

export interface ILoggedProfileActions {
  login: voidFunc;
  logout: voidFunc;
}

export interface UseLoggedProfileProps {
  globalChannel: any;
  authService: any;
  onError: (err: ErrorObj) => void;
}

const useLoggedProfile = (props: UseLoggedProfileProps) => {
  const { globalChannel, onError, authService } = props;
  const [loggedProfile, setLoggedProfile] = React.useState<ILoggedProfile>({});
  
  // hook to fetch the profile data
  React.useEffect(() => {
    if (loggedProfile.ethAddress) {
      // fetch profile data
    }
  }, [loggedProfile.ethAddress])
  
  // listen for global login
  useGlobalLogin(globalChannel,
    (data) => {
      setLoggedProfile({
        ethAddress: data.ethAddress,
        token: data.token,
      })
    },
    (ex) => {
      if (onError) {
        onError({
          errorKey: 'useLoggedProfile.globalLogin',
          error: ex.error,
          critical: false,
        });
      }
    });
    // actions exposed to the component
    // every action encapsulates the logic for a remote call and 
    const actions: ILoggedProfileActions = {
      login: async (selectedProvider: number) => {
        try {
          const call = authService.signIn(selectedProvider);
          // handle the case where signIn was triggered from another place
          const globalCall = globalChannel.pipe(
            filter((response: any) => response.channelInfo.method === 'signIn'),
            takeLast(1),
          );
          race(call, globalCall).subscribe(
            (response: any) => {
              const { token, ethAddress } = response.data;
              setLoggedProfile({
                token,
                ethAddress
              });
            },
            (err: Error) => {
              // console.error('action[subscription].authorize', err);
              onError({
                errorKey: 'useLoggedProfile[subscription].login',
                error: err,
                critical: false,
              });
            },
          );
        } catch (ex) {
          onError({
            errorKey: 'useLoggedProfile.login',
            error: ex,
            critical: false,
          });
        }
      },
      logout: () => {
        setLoggedProfile({});
      }
    }
  return [loggedProfile, actions];
}

export default useLoggedProfile;
