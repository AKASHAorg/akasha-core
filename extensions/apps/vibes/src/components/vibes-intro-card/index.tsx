import React from 'react';
import Link from '@akashaorg/design-system-core/lib/components/Link';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
export type OverviewCTA = {
  label: string;
  url: string;
  handler?: () => void;
};
export type VibesIntroCardProps = {
  titleLabel: string;
  subtitleLabel: string;
  overviewCTAArr: OverviewCTA[];
};

/**
 * Component used in the vibes app as a header with links to relevant pages
 */
const VibesIntroCard: React.FC<VibesIntroCardProps> = props => {
  const { titleLabel, subtitleLabel, overviewCTAArr } = props;
  return (
    <Card className="p-4 shadow-nones">
      <Stack spacing={4}>
        <Typography variant="h5">{titleLabel}</Typography>

        {subtitleLabel && (
          <Typography variant="sm" className="font-light text-grey5 dark:text-grey6">
            {subtitleLabel}.
          </Typography>
        )}

        {overviewCTAArr && overviewCTAArr.length > 0 && (
          <Stack justifyContent="between" spacing={4}>
            {overviewCTAArr.map(({ url, label, handler }, idx) => (
              <Stack key={label + idx}>
                {handler && typeof handler === 'function' ? (
                  <button onClick={handler}>
                    <Typography
                      bold
                      variant="sm"
                      className="text-secondaryLight dark:text-secondaryDark"
                    >
                      {label}
                    </Typography>
                  </button>
                ) : (
                  <Link to={url} dataTestId={`${label}-link`} customStyle="text-sm font-bold">
                    {label}
                  </Link>
                )}
              </Stack>
            ))}
          </Stack>
        )}
      </Stack>
    </Card>
  );
};
export default VibesIntroCard;
