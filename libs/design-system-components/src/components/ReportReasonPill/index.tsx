import React from 'react';
import { FlagIcon } from 'lucide-react';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
export type ReportReasonPillProps = {
  reportCount: number;
  reason: string;
  handleClick: () => void;
};

/**
 * Component used in the vibes and vibes console apps to display moderation data
 * @param reportCount - number of times of report
 * @param reason - report reason text
 * @param handleClick - click handler for the pill
 */
const ReportReasonPill: React.FC<ReportReasonPillProps> = props => {
  const { reason, reportCount, handleClick } = props;
  return (
    <button onClick={handleClick}>
      <Stack
        direction="row"
        className="w-fit rounded-full bg-secondaryLight/30 dark:bg-secondaryDark"
      >
        <Stack direction="row" alignItems="center" spacing={1} className="p-2">
          <FlagIcon className="h-5 w-5 [&>*]:stroke-secondaryLight dark:[&>*]:stroke-grey2" />
          <Typography variant="xs" className="font-medium text-secondaryLight dark:text-grey2">
            {reportCount}
          </Typography>
        </Stack>

        <Stack className="p-2 border-l-1 border-solid border-white dark:border-grey2">
          <Typography variant="xs" className="font-medium text-secondaryLight dark:text-grey2">
            {reason}
          </Typography>
        </Stack>
      </Stack>
    </button>
  );
};
export default ReportReasonPill;
