import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavigateToParams } from '@akashaorg/typings/ui';

import ModerationActivity from '../components/dashboard/tabs/activity/moderation';

export interface IModerationActivityPageProps {
  navigateTo: (args: NavigateToParams) => void;
}

export const ModerationActivityPage: React.FC<IModerationActivityPageProps> = props => {
  const { navigateTo } = props;

  const { t } = useTranslation('app-moderation-ewa');

  return <ModerationActivity label={t('Moderation Activity')} />;
};
