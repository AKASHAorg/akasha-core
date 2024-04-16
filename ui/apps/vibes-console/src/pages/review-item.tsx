import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import { NotificationEvents, NotificationTypes } from '@akashaorg/typings/lib/ui';
import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import { CheckCircleIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import { ReviewItem } from '../components/dashboard';
import routes, { DASHBOARD } from '../routes';

export type ReviewItemPageProps = {
  action: string;
};

export const ReviewItemPage: React.FC<ReviewItemPageProps> = props => {
  const { action } = props;

  const navigate = useNavigate();
  const { t } = useTranslation('app-vibes');
  const { getRoutingPlugin, uiEvents } = useRootComponentProps();

  const navigateTo = getRoutingPlugin().navigateTo;

  const handleCancelButtonClick = () => {
    navigate({
      to: routes[DASHBOARD],
    });
  };

  const handleConfirmButtonClick = () => {
    navigate({
      to: routes[DASHBOARD],
    });
    uiEvents.next({
      event: NotificationEvents.ShowNotification,
      data: {
        type: NotificationTypes.Success,
        message: t('Content successfully reviewed'),
        snackbarIcon: <CheckCircleIcon />,
      },
    });
  };

  const handleSubtitleLinkClick = (link: string) => {
    navigateTo?.({
      appName: '@akashaorg/app-legal',
      getNavigationUrl: () => link,
    });
  };

  const footnoteLabels = [
    {
      label: t('If you are unsure, you can refer to our'),
    },
    { label: t('Code of Conduct'), link: '/code-of-conduct' },
    { label: t('and') },
    { label: t('Terms of Service'), link: '/terms-of-service' },
  ];

  return (
    <ReviewItem
      section1Label={t('The content was reported for violating the following Code of Conduct')}
      section2Label={t('Please explain your decision')}
      reasonPlaceholderLabel={t('Write down some reason here')}
      subtitleLabels={footnoteLabels}
      cancelButtonLabel={t('Cancel')}
      confirmButtonLabel={t('{{action}}', { action })}
      onLinkClick={handleSubtitleLinkClick}
      onCancelButtonClick={handleCancelButtonClick}
      onConfirmButtonClick={handleConfirmButtonClick}
    />
  );
};
