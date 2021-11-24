import React from 'react';
import { useTranslation } from 'react-i18next';

import DS from '@akashaproject/design-system';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';

const { Box, WelcomeCard } = DS;

const Welcome: React.FC<RootComponentProps> = props => {
  const { t } = useTranslation();

  return (
    <Box
      width={props.isMobile ? '100%' : '38%'}
      margin={{ top: 'small', horizontal: 'auto', bottom: '0' }}
    >
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
        handlePrimaryButtonClick={() => null}
        handleSecondaryButtonClick={() => null}
      />
    </Box>
  );
};

export default Welcome;
