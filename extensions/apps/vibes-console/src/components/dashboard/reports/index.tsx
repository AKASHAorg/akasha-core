import React from 'react';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import { ReportsHeader, ReportsHeaderProps } from './header';
import { ReportItem, ReportItemProps, TReport } from './item';
import { NoItemFound } from '../../no-item-found';

export type TItemReportsProps = ReportsHeaderProps &
  Omit<ReportItemProps, 'report'> & {
    reports: TReport[];
    reportId?: string;
  };

export const ItemReports: React.FC<TItemReportsProps> = props => {
  const {
    introLabel,
    reportLabel,
    noExplanationLabel,
    viewMoreLabel,
    reports,
    reportId,
    onClickViewMore,
  } = props;
  if (!reports.length) {
    return (
      <Card>
        <NoItemFound title="No reports found. Please try again later" />
      </Card>
    );
  }
  return (
    <Stack spacing="gap-y-4">
      <ReportsHeader introLabel={introLabel} reportLabel={reportLabel} />
      {!reportId &&
        reports.map(r => (
          <ReportItem
            key={r.name}
            report={r}
            sliceIndex={2}
            noExplanationLabel={noExplanationLabel}
            viewMoreLabel={viewMoreLabel}
            onClickViewMore={onClickViewMore}
          />
        ))}
      {reportId && (
        <ReportItem
          key={reports[0].name}
          report={reports[0]}
          noExplanationLabel={noExplanationLabel}
        />
      )}
    </Stack>
  );
};
