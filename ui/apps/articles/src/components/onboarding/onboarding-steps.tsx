import React from 'react';
import { useTranslation } from 'react-i18next';

import { RootComponentProps } from '@akashaorg/typings/ui';

import StepOne from './step-one';
import StepTwo from './step-two';
import StepThree from './step-three';
import { ONBOARDING_STATUS } from './intro';

import menuRoute, {
  ONBOARDING_STEP_ONE,
  ONBOARDING_STEP_TWO,
  ONBOARDING_STEP_THREE,
  HOME,
  WRITE_ARTICLE,
} from '../../routes';

interface IOnboardingStepsProps {
  activeIndex?: number;
}

const ArticlesOnboardingSteps: React.FC<RootComponentProps & IOnboardingStepsProps> = props => {
  const { plugins } = props;

  const navigateTo = plugins['@akashaorg/app-routing']?.routing?.navigateTo;

  const [selectedTopics, setSelectedTopics] = React.useState<string[]>([]);
  const [activeIndex, setActiveIndex] = React.useState<number>(props.activeIndex || 0);

  const { t } = useTranslation('app-articles');

  const pathnameArr = [ONBOARDING_STEP_ONE, ONBOARDING_STEP_TWO, ONBOARDING_STEP_THREE].map(
    el => `${props.baseRouteName}${menuRoute[el]}`,
  );

  React.useEffect(() => {
    const idx = pathnameArr.indexOf(location.pathname);
    if (idx === -1) {
      return setActiveIndex(0);
    }
    setActiveIndex(idx);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const isOnboarded = React.useMemo(() => {
    return window.localStorage.getItem(ONBOARDING_STATUS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = (step: string) => () => {
    if (activeIndex === 2 && [HOME, WRITE_ARTICLE].includes(step)) {
      window.localStorage.setItem(ONBOARDING_STATUS, 'completed');
    }
    navigateTo({
      appName: '@akashaorg/app-articles',
      getNavigationUrl: () => menuRoute[step],
    });
  };

  const handleClickTopic = (topic: string) => () => {
    if (selectedTopics.includes(topic)) {
      const filtered = selectedTopics.filter(_topic => _topic !== topic);
      return setSelectedTopics(filtered);
    }
    setSelectedTopics(prev => [...prev, topic]);
  };

  if (isOnboarded) {
    // if user has been onboarded, navigate to home
    return navigateTo({
      appName: '@akashaorg/app-articles',
      getNavigationUrl: () => menuRoute[HOME],
    });
  }

  return (
    <>
      {activeIndex === 0 && (
        <StepOne
          titleLabel={t('Writing Your First Article')}
          textLine1Label={t("It's quite easy! 😉")}
          textLine2Label={t(
            'Our article editor features pretty awesome stuff like adding blocks to your article that will help you elaborate your story better!',
          )}
          textLine3Label={t(
            'Be sure to visit the AKASHAVerse every now and then to check the apps that come with great blocks for your articles!',
          )}
          skipLabel={t('Skip')}
          nextLabel={t('Next')}
          onClickIcon={handleClick(HOME)}
          onClickSkip={handleClick(ONBOARDING_STEP_TWO)}
          onClickNext={handleClick(ONBOARDING_STEP_TWO)}
        />
      )}
      {activeIndex === 1 && (
        <StepTwo
          titleLabel={t('Installing Apps For Blocks')}
          textLine1Label={t(
            'Did you know that by installing these applications you will have some awesome extra blocks for you to add in your articles 🙀',
          )}
          skipLabel={t('Skip')}
          nextLabel={t('Next')}
          onClickIcon={handleClick(ONBOARDING_STEP_ONE)}
          onClickSkip={handleClick(ONBOARDING_STEP_THREE)}
          onClickNext={handleClick(ONBOARDING_STEP_THREE)}
        />
      )}
      {activeIndex === 2 && (
        <StepThree
          titleLabel={t('Lastly, select some topics')}
          textLine1Label={t(
            'Choose the topics of your interests to curate your article feed better',
          )}
          readArticleLabel={t('Read Articles')}
          writeFirstArticleLabel={t('Write my first article')}
          selectedTopics={selectedTopics}
          onClickIcon={handleClick(ONBOARDING_STEP_TWO)}
          onClickTopic={handleClickTopic}
          onClickReadArticle={handleClick(HOME)}
          onClickWriteArticle={handleClick(WRITE_ARTICLE)}
        />
      )}
    </>
  );
};

export default ArticlesOnboardingSteps;
