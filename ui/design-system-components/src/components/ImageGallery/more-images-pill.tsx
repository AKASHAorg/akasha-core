import * as React from 'react';
import { tw } from '@twind/core';

export interface IMoreImagesPill {
  imageLabel?: string;
  imagesLabel?: string;
  hiddenImages: number;
}

export const MoreImagesPill: React.FC<IMoreImagesPill> = ({
  hiddenImages,
  imageLabel,
  imagesLabel,
}) => {
  const label = hiddenImages > 1 ? imagesLabel : imageLabel;
  return (
    <div
      className={tw(
        'flex flex-row items-center justify-items-center w-full max-w-[6rem] h-6 rounded-xl bg-secondary absolute right-4 bottom-5 z-1',
      )}
    >
      <p className={tw('text-white')}>{`+${hiddenImages} ${label}`}</p>
    </div>
  );
};

MoreImagesPill.defaultProps = {
  imagesLabel: 'images',
  imageLabel: 'image',
};
