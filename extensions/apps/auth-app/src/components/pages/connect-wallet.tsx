import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { EthProviders, PROVIDER_ERROR_CODES } from '@akashaorg/typings/lib/sdk';
import {
  switchToRequiredNetwork,
  useConnectWallet,
  useAkashaStore,
  useNetworkChangeListener,
  useRequiredNetwork,
  useRootComponentProps,
} from '@akashaorg/ui-core-hooks';
import IndicatorDots from '@akashaorg/design-system-components/lib/components/IndicatorDots';
import ConnectErrorCard from '@akashaorg/design-system-components/lib/components/ConnectErrorCard';
import {
  Akasha,
  Walletconnect,
} from '@akashaorg/design-system-core/lib/components/Icon/akasha-icons';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import { useNavigate } from '@tanstack/react-router';
import { ArrowRightLeftIcon } from 'lucide-react';

const ConnectWallet: React.FC = () => {
  const { t } = useTranslation('app-auth-ewa');
  const navigate = useNavigate();
  const { worldConfig } = useRootComponentProps();
  const selectedProvider = EthProviders.WalletConnect;
  const worldName = worldConfig.title;
  const {
    data: { authenticatedDID, authenticationError },
    authenticationStore,
  } = useAkashaStore();
  const isLoggedIn = !!authenticatedDID;
  const [errors, setErrors] = useState<
    {
      title: string;
      subtitle: string;
    }[]
  >([]);
  const [isSignInRetry, setIsSignInRetry] = useState(false);
  const onDisconnect = () => {
    authenticationStore.logout();
    navigate({
      to: '/',
    });
  };
  const onSignIn = provider => {
    authenticationStore.login({
      provider,
    });
  };
  const signInCall = useRef(onSignIn);
  const signOutCall = useRef(onDisconnect);
  const connectWalletCall = useConnectWallet();
  const requiredNetworkQuery = useRequiredNetwork();
  const [changedNetwork, changedNetworkUnsubscribe] = useNetworkChangeListener();
  useEffect(() => {
    connectWalletCall.connect();
  }, []);
  useEffect(() => {
    if (
      requiredNetworkQuery.isSuccess &&
      changedNetwork?.chainId === requiredNetworkQuery.data.chainId &&
      !connectWalletCall.isSuccess &&
      !connectWalletCall.isLoading
    ) {
      setErrors([]);
      connectWalletCall.connect();
    } else if (changedNetwork) {
      const errorTitle = t('Network not supported');
      const errorSubtitle = t(
        'The network you just changed to is not supported. Please change it to {{requiredNetworkName}}.',
        {
          requiredNetworkName,
        },
      );
      if (errors.find(e => e.title === errorTitle)) {
        return;
      }
      setErrors(prev => [
        ...prev,
        {
          title: errorTitle,
          subtitle: errorSubtitle,
        },
      ]);
    }
    return () => {
      changedNetworkUnsubscribe();
    };
  }, [changedNetwork, requiredNetworkQuery.data]);
  useEffect(() => {
    if (connectWalletCall.isSuccess && connectWalletCall.data.length == 42 && !isSignInRetry) {
      signInCall.current(selectedProvider);
    }
  }, [connectWalletCall.isSuccess, isSignInRetry]);
  const requiredNetworkName = useMemo(() => {
    if (requiredNetworkQuery.isSuccess) {
      return `${requiredNetworkQuery.data.name.charAt(0).toLocaleUpperCase()}${requiredNetworkQuery.data.name.substring(1).toLocaleLowerCase()}`;
    } else {
      return null;
    }
  }, [requiredNetworkQuery]);
  const networkNotSupportedError = useMemo(() => {
    if (connectWalletCall.isError) {
      if (
        (
          connectWalletCall.error as Error & {
            code?: number;
          }
        )?.code === PROVIDER_ERROR_CODES.UserRejected
      ) {
        return t('You have rejected the change network request. Please change it manually.');
      }
      return t(
        "To use AKASHA World during the alpha period, you'll need to set your preferred provider's network to {{requiredNetworkName}}",
        {
          requiredNetworkName,
        },
      );
    }
    return null;
  }, [connectWalletCall.error, connectWalletCall.isError, requiredNetworkName, t]);
  const hasErrors =
    Boolean(networkNotSupportedError) || Boolean(errors.length) || Boolean(authenticationError);
  const handleChangeNetwork = () => {
    /**
     * change network to requiredNetwork,
     * avoid spamming the user with errors
     */
    switchToRequiredNetwork()
      .then(() => {
        /**
         * reset error state and trigger connect wallet modal
         */
        setErrors([]);
        connectWalletCall.connect();
      })
      .catch(err => {
        let errorTitle = t("Switch Your Wallet's Network");
        let errorSubtitle = t(
          'The selected provider does not support changing networks, please manually change it to {{requiredNetworkName}}',
          {
            requiredNetworkName,
          },
        );
        if (err.code === PROVIDER_ERROR_CODES.UserRejected) {
          errorTitle = t('Request Rejected!');
          errorSubtitle = t(
            'You have rejected the change network request. Please change it manually or try again.',
          );
        }
        if (errors.find(err => err.title === errorTitle)) {
          return;
        }
        setErrors(prevState => {
          if (prevState.find(err => err.title === errorTitle)) {
            return [
              ...prevState,
              {
                title: errorTitle,
                subtitle: errorSubtitle,
              },
            ];
          }
          return prevState;
        });
      });
  };
  const handleSignInRetry = () => {
    setErrors([]);
    setIsSignInRetry(true);
    signInCall.current(selectedProvider);
  };
  const handleDisconnect = () => {
    // disconnect wallet
    signOutCall.current();
  };
  const textColor = {
    light: 'grey4',
    dark: 'grey7',
  } as const;
  return (
    <Stack spacing={8}>
      <Stack>
        <Typography bold className="text-center">
          {t('Connecting to {{worldName}}', {
            worldName,
          })}
        </Typography>
        <Typography bold className="text-center">
          {t('using your wallet')}
        </Typography>
      </Stack>
      <Stack direction="row" alignItems="center" justifyContent="center">
        <Walletconnect height={80} width={80} />
        <IndicatorDots isSuccess={isLoggedIn} hasErrors={hasErrors} />
        <div className="flex justify-center items-center bg-gradient-to-b from-blue-200 to-red-200 rounded-[24px] size-20 [&>*]:fill-black">
          <Akasha height={54} width={54} />
        </div>
      </Stack>
      {networkNotSupportedError && (
        <ConnectErrorCard
          title={t("Switch Your Wallet's Network")}
          message={networkNotSupportedError}
          action={{
            onClick: handleChangeNetwork,
            label: t('Change Network'),
          }}
        />
      )}
      {authenticationError && (
        <ConnectErrorCard
          title={t('Request Rejected!')}
          message={t('You have rejected the request. Please try again!')}
          action={{
            onClick: handleSignInRetry,
            label: t('Retry Request'),
          }}
        />
      )}

      {errors.map((errObj, idx) => (
        <ConnectErrorCard key={idx} title={errObj.title} message={errObj.subtitle} />
      ))}

      {!hasErrors && (
        <Stack spacing={6}>
          {!!connectWalletCall.data?.length && (
            <Stack spacing={8}>
              <Stack spacing={2}>
                <Typography variant="h6" bold className="text-center">
                  {isLoggedIn ? t('Authorized 🙌🏽') : t('Authorizing')}
                </Typography>
                <Typography className="text-center">
                  {isLoggedIn
                    ? t('You have successfully connected and authorized your address')
                    : t('You will be prompted with 1 signature')}
                </Typography>
              </Stack>

              <Stack spacing={2}>
                <Typography variant="xs" bold className="text-center">
                  {t('Your Address')}
                </Typography>
                <Typography variant="sm" className="font-light text-center break-all">
                  {connectWalletCall.data}
                </Typography>
              </Stack>
            </Stack>
          )}
          <Stack alignItems="center" justifyContent="center">
            <Card onClick={handleDisconnect} className="shadow-none">
              <Stack alignItems="center" spacing={2} className="md:flex-row">
                <ArrowRightLeftIcon className="h-5 w-5 [&>*]:stroke-secondaryLight dark:[&>*]:stroke-secondaryDark" />
                <Typography
                  bold
                  className="text-secondaryLight dark:text-secondaryDark text-center"
                >
                  {t('Disconnect or change the way to connect')}
                </Typography>
              </Stack>
            </Card>
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};
export default ConnectWallet;
