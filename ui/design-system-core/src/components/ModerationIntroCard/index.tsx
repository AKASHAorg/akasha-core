import React from 'react';
import { apply, tw } from '@twind/core';

import { IconType } from '@akashaorg/typings/ui';

import BasicCardBox from '../BasicCardBox';
import Icon from '../Icon';
import Text from '../Text';

export type OverviewCTA = {
  label: string;
  url: string;
  iconType: IconType;
};

export interface IModerationIntroCardProps {
  assetName?: string;
  titleLabel: string;
  introLabel: string;
  subtitleLabel: string;
  publicImgPath?: string;
  codeOfConductLabel: string;
  overviewCTAArr: OverviewCTA[];
  onCodeOfConductClick?: () => void;
}

const ModerationIntroCard: React.FC<IModerationIntroCardProps> = props => {
  const {
    assetName = 'moderation',
    titleLabel,
    introLabel,
    subtitleLabel,
    publicImgPath = '/images',
    codeOfConductLabel,
    overviewCTAArr,
    onCodeOfConductClick,
  } = props;

  return (
    <BasicCardBox pad="p-4" margin="mb-4">
      <div className={tw(apply('grid gap-4 grid-cols-1'))}>
        <Text variant="h5" align="center">
          {titleLabel}
        </Text>

        <div className={tw(apply('w-40 h-40 my-2 mx-auto'))}>
          <img
            className={tw('object-contain')}
            aria-label={assetName}
            src={`${publicImgPath}/${assetName}.webp`}
            alt={assetName}
            data-testid={`${assetName}-image`}
          />
        </div>

        {introLabel && (
          <Text variant="body1" weight="bold" align="center">
            {introLabel}
          </Text>
        )}

        {subtitleLabel && (
          <Text variant="subtitle2" align="center">
            {subtitleLabel}
          </Text>
        )}

        {codeOfConductLabel && (
          <div onClick={onCodeOfConductClick}>
            <Text
              variant="subtitle2"
              color={{ light: 'text-secondary-light', dark: 'dark:text-secondary-dark' }}
              weight="bold"
              align="center"
              style="cursor-pointer"
            >
              {codeOfConductLabel}
            </Text>
          </div>
        )}

        {overviewCTAArr && overviewCTAArr.length > 0 && (
          <div className={tw(apply('flex md:px-20 justify-between'))}>
            {overviewCTAArr.map(({ url, label, iconType }) => (
              <div key={label + iconType} className={tw(apply('grid gap-1 grid-cols-1 w-[30%]'))}>
                <Icon size="md" accentColor={true} type={iconType} style="mx-auto my-0" />
                <a
                  href={url}
                  className={tw(
                    apply(
                      'text-sm text-center font-bold no-underline text-secondary-light dark:text-secondary-dark',
                    ),
                  )}
                  target="_blank"
                  rel="noreferrer noopener"
                  data-testid={`${iconType}-link`}
                >
                  {label}
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </BasicCardBox>
  );
};

export default ModerationIntroCard;
