import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import { ItemReports } from '../components/dashboard';
import routes, { VIEW_SPECIFIC_REPORT } from '../routes';

export type ItemReportsPageProps = {
  id: string;
  reportId?: string;
};

export const ItemReportsPage: React.FC<ItemReportsPageProps> = props => {
  const { id, reportId } = props;
  const navigate = useNavigate();
  const { t } = useTranslation('app-vibes-console');
  const handleViewMoreClick = (reportId: string) => {
    navigate({
      to: routes[VIEW_SPECIFIC_REPORT],
      params: { id, reportId },
    });
  };
  return (
    <ItemReports
      introLabel={t('Flagged 60 times for')}
      reportLabel={t('Hate Speech')}
      noExplanationLabel={t('No explanation was left by user.')}
      viewMoreLabel={t('View more')}
      onClickViewMore={handleViewMoreClick}
      reportId={reportId}
      reports={[]}
    />
  );
};
