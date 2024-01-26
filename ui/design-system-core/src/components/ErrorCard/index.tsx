import React from 'react';
import { tw } from '@twind/core';

import Button from '../Button';

export type ErrorCardProps = {
  boxSize: string;
  errorType: string;
  titleLabel: string;
  subtitleLabel: string;
  buttonLabel?: string;
  textMarginTop?: boolean;
  textMarginBottom?: boolean;
  hasButton?: boolean;
  imageBoxHasMargin?: boolean;
  /* Path to public folder */
  publicImgPath?: string;
  onClick?: () => void;
};

/**
 * Internal component used by ErrorLoader.
 * Use ErrorLoader instead.
 */
const ErrorCard: React.FC<ErrorCardProps> = props => {
  const {
    boxSize,
    errorType,
    titleLabel,
    subtitleLabel,
    buttonLabel,
    textMarginTop,
    textMarginBottom,
    hasButton,
    imageBoxHasMargin,
    publicImgPath = '/images',
    onClick,
  } = props;

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const contentWrapperClass =
    'flex flex-col items-center bg-white dark:bg-grey2 pt-0 px-4 md:px-20 pb-5 rounded-lg';

  return (
    <div className={tw(contentWrapperClass)}>
      <div className={tw(`h-[${boxSize}] w-[${boxSize}] mb-${imageBoxHasMargin ? '0.5' : '0'}`)}>
        <img
          className={tw('object-contain')}
          src={`${publicImgPath}/${errorType}.webp`}
          alt="error"
        />
      </div>

      <span className={tw('font-semibold mb-0.5 mx-auto text-xl text-center')}>{titleLabel}</span>

      <span
        className={tw(
          `font-normal ${textMarginTop ? 'mt-[0.25]' : ''} ${
            textMarginBottom ? 'mb-[1.5]' : ''
          } text(secondaryLight dark:secondaryDark) text-lg text-center leading-6`,
        )}
      >
        {subtitleLabel}
      </span>

      {hasButton && (
        <div className={tw('w-fit mt-4')}>
          <Button onClick={handleClick} label={buttonLabel} />
        </div>
      )}
    </div>
  );
};

export default ErrorCard;
