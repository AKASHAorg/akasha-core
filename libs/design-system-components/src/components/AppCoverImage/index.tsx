import React, { useMemo } from 'react';
import { AkashaAppApplicationType } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { EyeOffIcon } from 'lucide-react';
import { cn } from '@akashaorg/ui/lib/library/utils';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';

export type AppCoverImageProps = {
  src?: string;
  appType?: string;
  isNSFW?: boolean;
  publicImgPath?: string;
  customStyle?: string;
};

const AppCoverImage = (props: AppCoverImageProps) => {
  const {
    src,
    isNSFW,
    publicImgPath = '/images',
    appType = AkashaAppApplicationType.App,
    customStyle,
  } = props;

  const coverByType = useMemo(() => {
    switch (appType) {
      case AkashaAppApplicationType.App:
        return {
          desktop: 'extension-cover-desktop-1',
          mobile: 'extension-cover-mobile-1',
        };
      case AkashaAppApplicationType.Widget:
        return {
          desktop: 'extension-cover-desktop-2',
          mobile: 'extension-cover-mobile-2',
        };
      case AkashaAppApplicationType.Plugin:
        return {
          desktop: 'extension-cover-desktop-3',
          mobile: 'extension-cover-mobile-3',
        };
      default:
        return {
          desktop: 'extension-cover-desktop-3',
          mobile: 'extension-cover-mobile-3',
        };
    }
  }, [appType]);

  if (isNSFW) {
    return (
      <Stack
        alignItems="center"
        justifyContent="center"
        className={`bg-grey9 dark:bg-grey5 w-full ${customStyle}`}
      >
        {isNSFW && (
          <EyeOffIcon className="h-5 w-5 [&>*]:stroke-errorLight dark:[&>*]:stroke-errorDark" />
        )}
      </Stack>
    );
  }

  return (
    <picture className={cn(`w-full overflow-hidden ${customStyle}`)}>
      {src && <source srcSet={src} />}
      {!src && (
        <>
          {/*desktop version*/}
          <source
            srcSet={`${publicImgPath}/${coverByType.desktop}.webp`}
            type="image/webp"
            media="(min-width: 768px) and (max-width: 1279px), (min-width: 1441px)"
          />
          {/*mobile version*/}
          <source
            srcSet={`${publicImgPath}/${coverByType.mobile}.webp`}
            type="image/webp"
            media="(max-width: 767px), (min-width: 1280px) and (max-width: 1440px)"
          />
        </>
      )}
      <img
        className={cn(`w-full ${customStyle}`)}
        src={src || `${publicImgPath}/${coverByType.desktop}.webp`}
        alt="App Cover"
      />
    </picture>
  );
};

export default AppCoverImage;
