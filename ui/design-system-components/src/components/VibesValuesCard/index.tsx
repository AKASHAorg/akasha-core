import React from 'react';
import { tw } from '@twind/core';

import VibesValueCard from './value-card';

import Card from '@akashaorg/design-system-core/lib/components/Card';
import Text from '@akashaorg/design-system-core/lib/components/Text';

type VibesValue = {
  path: string;
  title: string;
  assetName: string;
  description: string;
};
export interface VibesValuesCardProps {
  titleLabel: string;
  subtitleLabel: string;
  ctaLabel: string;
  ctaUrl: string;
  values: VibesValue[];
  onValueClick: (path: VibesValue['path']) => () => void;
}

const VibesValuesCard: React.FC<VibesValuesCardProps> = props => {
  const { titleLabel, subtitleLabel, ctaLabel, ctaUrl, values, onValueClick } = props;

  return (
    <Card padding={16}>
      <div className={tw('grid gap-4 grid-cols-1 md:px-10')}>
        <Text variant="h5" align="center">
          {titleLabel}
        </Text>

        <Text variant="subtitle2" align="center">
          {subtitleLabel}
        </Text>
        <div className={tw('grid gap-4 grid-cols-2 md:grid-cols-3')}>
          {values.map((value, idx) => (
            <VibesValueCard
              key={value.title + idx}
              isMini={true}
              label={value.title}
              assetName={value.assetName}
              onClick={onValueClick(value.path)}
            />
          ))}

          <a
            href={ctaUrl}
            className={tw(
              'flex md:hidden text-sm text-center font-bold no-underline text-secondaryLight dark:text-secondaryDark',
            )}
            target="_blank"
            rel="noreferrer noopener"
          >
            <div
              className={tw(
                'h-32 w-full flex items-center justify-center p-3 bg-grey9 dark:bg-grey3 rounded-2xl cursor-pointer',
              )}
            >
              <Text
                variant="footnotes1"
                align="center"
                color={{
                  light: 'secondaryLight',
                  dark: 'secondaryDark',
                }}
                weight="bold"
              >
                {ctaLabel}
              </Text>
            </div>
          </a>
        </div>
        {ctaLabel && (
          <div
            className={tw(
              'hidden md:flex p-5 justify-center bg-grey9 dark:bg-grey3 rounded-2xl cursor-pointer',
            )}
          >
            <a
              href={ctaUrl}
              className={tw(
                'text-sm text-center font-bold no-underline text-secondaryLight dark:text-secondaryDark',
              )}
              target="_blank"
              rel="noreferrer noopener"
            >
              {ctaLabel}
            </a>
          </div>
        )}
      </div>
    </Card>
  );
};

export default VibesValuesCard;
