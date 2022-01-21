import React from 'react';
import { useTranslation } from 'react-i18next';

import DS from '@akashaproject/design-system';
import { useGetLogin } from '@akashaproject/ui-awf-hooks';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import routes, { rootAKASHARoute, rootProfileRoute, SIGN_IN } from '../../routes';

const { WelcomeCard } = DS;

const Welcome: React.FC<RootComponentProps> = props => {
  const { t } = useTranslation();

  const loginQuery = useGetLogin();

  React.useEffect(() => {
    // redirect to sign in page if not logged in
    if (loginQuery.isSuccess && !loginQuery.data?.pubKey) {
      props.singleSpa.navigateToUrl(routes[SIGN_IN]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePrimaryButtonClick = () => {
    props.singleSpa.navigateToUrl(`${rootAKASHARoute}/feed`);
  };

  const handleSecondaryButtonClick = () => {
    props.singleSpa.navigateToUrl(`${rootProfileRoute}/my-profile?modal[name]=update-profile`);
  };

  return (
    <WelcomeCard
      titleLabel={t('Welcome to the alpha!')}
      subtitleLabel={t('Congratulations, you are the newest member of Ethereum World!')}
      paragraphOneLabel={t(
        'You can now browse the feed, subscribe to topics, write your own posts, and reply to other Ethereans.',
      )}
      paragraphTwoIntroLabel={t('While you don’t have to do it now,')}
      paragraphTwoBoldLabel={t('we do recommend you take the time to customize your profile')}
      paragraphTwoNextLabel={t(
        'You can change your display name and avatar, add a cover image and description, as well as claim your own AKASHA ENS name.',
      )}
      paragraphThreeLabel={t('We are very happy you’ve joined us!')}
      primaryButtonLabel={t('Browse Ethereum World')}
      secondaryButtonLabel={t('Customize My Profile')}
      handlePrimaryButtonClick={handlePrimaryButtonClick}
      handleSecondaryButtonClick={handleSecondaryButtonClick}
    />
  );
};

export default Welcome;
