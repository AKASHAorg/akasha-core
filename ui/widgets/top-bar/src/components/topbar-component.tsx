import * as React from 'react';
import DS from '@akashaproject/design-system';
import { useLocation } from 'react-router-dom';
import {
  IMenuItem,
  EventTypes,
  MenuItemAreaType,
  UIEventData,
} from '@akashaproject/ui-awf-typings/lib/app-loader';
import {
  useLoginState,
  useErrors,
  useNotifications,
  useProfile,
  useModalState,
} from '@akashaproject/ui-awf-hooks';
import { MODAL_NAMES } from '@akashaproject/ui-awf-hooks/lib/use-modal-state';
import { useTranslation } from 'react-i18next';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import getSDK from '@akashaproject/awf-sdk';
import { extensionPointsMap } from '../extension-points';

const {
  lightTheme,
  Topbar,
  ThemeSelector,
  LoginModal,
  FeedbackModal,
  ModalRenderer,
  ExtensionPoint,
} = DS;

const TopbarComponent = (props: RootComponentProps) => {
  const { singleSpa, getMenuItems, uiEvents, layoutConfig, logger } = props;

  const sdk = getSDK();

  const { modalSlotId } = layoutConfig;
  const { navigateToUrl } = singleSpa;

  const [currentMenu, setCurrentMenu] = React.useState<IMenuItem[]>([]);

  const [suggestSignUp, setSuggestSignUp] = React.useState<boolean>(false);
  const [showSignUpModal, setshowSignUpModal] = React.useState<{
    inviteToken: string | null;
    status: boolean;
  }>({
    inviteToken: null,
    status: false,
  });
  const [errorState, errorActions] = useErrors({ logger });

  const [loginState, loginActions] = useLoginState({
    onError: errorActions.createError,
  });
  const [inviteTokenForm, setinviteTokenForm] = React.useState<{
    submitted: boolean;
    submitting: boolean;
    success: boolean;
    hasError: boolean;
    errorMsg: string;
  }>({
    submitted: false,
    submitting: false,
    success: false,
    hasError: false,
    errorMsg: '',
  });
  const [termsState, setTermsState] = React.useState<{
    waitForCheckTerms: boolean;
    checkedTermsValues: string[];
    acceptedTerms: boolean;
  }>({
    waitForCheckTerms: true,
    checkedTermsValues: [],
    acceptedTerms: false,
  });
  const [loggedProfileData, loggedProfileActions] = useProfile({
    onError: err => logger.error(err),
  });

  const [notificationsState, notificationActions] = useNotifications({
    onError: err => logger.error(err),

    loggedEthAddress: loginState.ethAddress,
  });

  const [modalState, modalStateActions] = useModalState({
    initialState: {
      feedback: false,
    },
    isLoggedIn: !!loginState.ethAddress,
  });

  React.useEffect(() => {
    if (loginState.ready?.ethAddress && loginState.ethAddress) {
      notificationActions.hasNewNotifications();
    }
  }, [loginState.ready?.ethAddress, loginState.ethAddress]);

  React.useEffect(() => {
    if (loginState.pubKey) {
      loggedProfileActions.getProfileData({ pubKey: loginState.pubKey });
    }
  }, [loginState.pubKey]);

  const loginErrors: string | null = React.useMemo(() => {
    if (errorState && Object.keys(errorState).length) {
      const txt = Object.keys(errorState)
        .filter(key => key.split('.')[0] === 'useLoginState')
        .map(k => {
          if (errorState[k].error.name === 'UserNotRegistered') {
            setSuggestSignUp(true);
          }
          return errorState[k];
        })
        .reduce((acc, errObj) => `${acc}\n${errObj.error.message}`, '');
      return txt;
    }
    return null;
  }, [errorState]);

  React.useEffect(() => {
    const updateMenu = () => {
      const menuItems = getMenuItems ? getMenuItems() : [];
      setCurrentMenu(menuItems);
    };
    updateMenu();
    const sub = uiEvents.subscribe({
      next: (eventData: UIEventData) => {
        if (
          eventData.event === EventTypes.InstallIntegration ||
          eventData.event === EventTypes.UninstallIntegration
        ) {
          updateMenu();
        }
      },
    });
    return () => sub.unsubscribe();
  }, []);

  React.useEffect(() => {
    if (loginState.ethAddress && modalState[MODAL_NAMES.LOGIN]) {
      setTimeout(() => handleLoginModalClose(), 500);
    }
  }, [loginState.ethAddress, modalState[MODAL_NAMES.LOGIN]]);

  React.useEffect(() => {
    const isLoadingProfile =
      loggedProfileData.isLoading !== undefined && loggedProfileData.isLoading;
    if (loginState.ethAddress && !isLoadingProfile) {
      if (!loggedProfileData.userName) {
        return props.singleSpa.navigateToUrl('/profile/my-profile/update-info');
      }
    }
  }, [loggedProfileData.isLoading, loginState.ethAddress]);
  // *how to obtain different topbar menu sections
  const quickAccessItems = currentMenu?.filter(
    menuItem => menuItem.area === MenuItemAreaType.QuickAccessArea,
  );
  // sort them so that avatar is last on the topbar menu
  const sortedQuickAccessItems = quickAccessItems.sort((menuItemA, menuItemB) => {
    if (menuItemA.name && menuItemB.name) {
      const getPluginName = (pluginName: string) => {
        const splitName = pluginName.split('-');
        const name = splitName[splitName.length - 1];
        return name;
      };

      if (getPluginName(menuItemA.name) > getPluginName(menuItemB.name)) {
        return 1;
      }
      if (getPluginName(menuItemA.name) < getPluginName(menuItemB.name)) {
        return -1;
      }
    }

    return 0;
  });

  const searchAreaItem = currentMenu?.filter(
    menuItem => menuItem.area === MenuItemAreaType.SearchArea,
  )[0];

  const otherAreaItems = currentMenu?.filter(
    menuItem => menuItem.area === MenuItemAreaType.OtherArea,
  );

  const handleNavigation = (path: string) => {
    navigateToUrl(path);
  };

  const handleLoginClick = () => {
    modalStateActions.show(MODAL_NAMES.LOGIN);
  };
  const handleLogin = (provider: 2 | 3) => {
    loginActions.login(provider, !showSignUpModal?.status);
  };

  const handleLogout = async () => {
    await Promise.resolve(loginActions.logout()).then(_ => {
      navigateToUrl('/');
      setTimeout(() => window.location.reload(), 50);
    });
  };
  const _handleModalClose = () => {
    setshowSignUpModal({
      inviteToken: null,
      status: false,
    });
    setSuggestSignUp(false);
    errorActions.removeLoginErrors();
  };
  const handleSignUpClick = () => {
    const state = {
      inviteToken: localStorage.getItem('@signUpToken'),
      status: true,
    };
    setshowSignUpModal(state);
    if (showSignUpModal.inviteToken) {
      triggerInviteValidation();
    }
    modalStateActions.show(MODAL_NAMES.LOGIN);
  };

  const onInputTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setinviteTokenForm({
      submitted: false,
      submitting: false,
      success: false,
      hasError: false,
      errorMsg: '',
    });
    setshowSignUpModal({
      inviteToken: e.target.value,
      status: true,
    });
  };
  const triggerInviteValidation = () => {
    if (showSignUpModal.inviteToken?.length && showSignUpModal.inviteToken.length === 24) {
      checkIsValidToken();
    }
  };
  const checkIsValidToken = () => {
    setinviteTokenForm({
      submitted: false,
      submitting: true,
      success: false,
      hasError: false,
      errorMsg: '',
    });
    sdk.api.auth
      .validateInvite(showSignUpModal.inviteToken)
      .toPromise()
      .then((_: any) => {
        setinviteTokenForm({
          submitted: true,
          submitting: false,
          success: true,
          hasError: false,
          errorMsg: '',
        });
      })
      .catch((err: Error) => {
        setinviteTokenForm({
          submitted: true,
          submitting: false,
          success: false,
          hasError: true,
          errorMsg: err.message,
        });
      });
  };
  const validateTokenFn = (e: any) => {
    e.preventDefault();
    checkIsValidToken();
  };
  const onCheckedTermsValues = (e: any) => {
    setTermsState(prevState => {
      return {
        ...prevState,
        checkedTermsValues: e.value,
      };
    });
  };
  const onAcceptTerms = (_: any) => {
    setTermsState(prevState => {
      return {
        ...prevState,
        acceptedTerms: true,
      };
    });
    localStorage.setItem('@acceptedTermsAndPrivacy', new Date().toISOString());
  };
  const activateAcceptButton = () => {
    setTermsState(prevState => {
      return {
        ...prevState,
        waitForCheckTerms: !(termsState.checkedTermsValues.length === 2),
      };
    });
  };
  React.useEffect(triggerInviteValidation, [showSignUpModal]);
  React.useEffect(activateAcceptButton, [termsState.checkedTermsValues]);

  const handleLoginModalClose = () => {
    modalStateActions.hide(MODAL_NAMES.LOGIN);
    _handleModalClose();
    errorActions.removeLoginErrors();
  };

  const handleFeedbackModalClose = () => {
    modalStateActions.hide(MODAL_NAMES.FEEDBACK);
  };

  const handleFeedbackModalShow = () => {
    modalStateActions.show(MODAL_NAMES.FEEDBACK);
  };

  const handleSearch = (inputValue: string) => {
    const encodedSearchKey = encodeURIComponent(inputValue);
    if (searchAreaItem) {
      handleNavigation(`${searchAreaItem.route}/${encodedSearchKey}`);
    }
  };

  const { t } = useTranslation();
  const location = useLocation();

  const onExtMount = (name: string) => {
    uiEvents.next({
      event: EventTypes.ExtensionPointMount,
      data: {
        name,
      },
    });
  };

  const onExtUnmount = (name: string) => {
    uiEvents.next({
      event: EventTypes.ExtensionPointUnmount,
      data: {
        name,
      },
    });
  };

  return (
    <ThemeSelector availableThemes={[lightTheme]} settings={{ activeTheme: 'Light-Theme' }}>
      <Topbar
        loggedProfileData={loggedProfileData}
        brandLabel="Ethereum World"
        signInLabel={t('Sign In')}
        signUpLabel={t('Sign Up')}
        signOutLabel={t('Sign Out')}
        searchBarLabel={t('Search profiles or topics')}
        legalLabel={t('Legal')}
        feedbackLabel={t('Send Us Feedback')}
        feedbackInfoLabel={t('Help us improve the experience!')}
        legalCopyRightLabel={'© Ethereum World Association'}
        versionLabel="ALPHA"
        versionURL="https://github.com/AKASHAorg/akasha-world-framework/discussions/categories/general"
        onNavigation={handleNavigation}
        onSearch={handleSearch}
        quickAccessItems={sortedQuickAccessItems}
        searchAreaItem={searchAreaItem}
        otherAreaItems={otherAreaItems}
        onLoginClick={handleLoginClick}
        onSignUpClick={handleSignUpClick}
        onLogout={handleLogout}
        onFeedbackClick={handleFeedbackModalShow}
        hasNewNotifications={notificationsState.hasNewNotifications}
        currentLocation={location?.pathname}
      >
        <ExtensionPoint
          name={extensionPointsMap.QuickAccess}
          shouldMount={!!loggedProfileData.ethAddress}
          onMount={name => onExtMount(name)}
          onUnmount={name => onExtUnmount(name)}
        />
      </Topbar>
      <ModalRenderer slotId={modalSlotId}>
        {modalState[MODAL_NAMES.FEEDBACK] && (
          <FeedbackModal
            titleLabel={t("We'd love to hear your feedback!")}
            subtitleLabel={t('If you find any bugs or problems, please let us know')}
            openAnIssueLabel={t('Open an Issue')}
            emailUsLabel={t('Email Us')}
            footerTextLabel={t(
              'Join our Discord channel to meet everyone, say "Hello!", provide feedback and share ideas.',
            )}
            footerLinkText1Label={t('Join in')}
            footerLinkText2Label={t('Discord')}
            openIssueLink={'https://github.com/AKASHAorg/akasha-world-framework/issues/new/choose'}
            emailUsLink={'mailto:feedback@ethereum.world'}
            joinDiscordLink={'https://discord.gg/A5wfg6ZCRt'}
            closeModal={handleFeedbackModalClose}
          />
        )}
      </ModalRenderer>
      <LoginModal
        slotId={modalSlotId}
        onLogin={handleLogin}
        showSignUpModal={showSignUpModal}
        onInputTokenChange={onInputTokenChange}
        validateTokenFn={validateTokenFn}
        submitted={inviteTokenForm.submitted}
        submitting={inviteTokenForm.submitting}
        success={inviteTokenForm.success}
        hasError={inviteTokenForm.hasError}
        errorMsg={inviteTokenForm.errorMsg}
        onModalClose={handleLoginModalClose}
        showModal={modalState[MODAL_NAMES.LOGIN]}
        subtitleLabel={t('Please enter your invitation code')}
        headerLabel={t('Sign Up')}
        titleLabel={t('Connect a wallet')}
        metamaskModalHeadline={t('Connecting')}
        metamaskModalMessage={t('Please complete the process in your wallet')}
        error={loginErrors}
        onAcceptTerms={onAcceptTerms}
        onCheckedTermsValues={onCheckedTermsValues}
        waitForCheckTerms={termsState.waitForCheckTerms}
        checkedTermsValues={termsState.checkedTermsValues}
        acceptedTerms={termsState.acceptedTerms}
        suggestSignUp={suggestSignUp}
        suggestedSignUpFn={handleSignUpClick}
      />
    </ThemeSelector>
  );
};

export default TopbarComponent;
