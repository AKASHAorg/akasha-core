import * as React from 'react';
import isUrl from 'is-url';
import { tw, apply, tx } from '@twind/core';
import { LinkPreviewExt } from '@akashaorg/typings/lib/ui';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import {
  LinkIcon,
  XMarkIcon,
} from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';

const closeDivClass = apply(
  'flex items-center justify-items-center z-1 w-6 h-6 rounded-full bg-grey7',
);
const flexCenteredClass = apply(`flex items-center justify-items-center`);

function htmlDecode(input) {
  if (!input) {
    return;
  }
  const doc = new DOMParser().parseFromString(input, 'text/html');
  return doc.documentElement.textContent;
}

export interface ILinkPreview {
  handleLinkClick?: (url: string) => void;
  handleDeletePreview?: () => void;
  uploading?: boolean;
  linkPreviewData?: LinkPreviewExt;
  uploadingLinkPreviewLabel?: string;
}

const LinkPreview: React.FC<ILinkPreview> = props => {
  const {
    handleLinkClick,
    handleDeletePreview,
    linkPreviewData,
    uploading,
    uploadingLinkPreviewLabel,
  } = props;

  const [showCover, setShowCover] = React.useState(false);
  const [faviconErr, setFaviconErr] = React.useState(false);

  const handleCoverLoad = () => {
    setShowCover(true);
  };

  const handleFaviconErr = () => {
    setFaviconErr(true);
  };

  let hostname = '';
  if (isUrl(linkPreviewData?.url)) {
    hostname = new URL(linkPreviewData?.url).hostname;
  }

  return (
    <>
      {uploading && (
        <div
          className={tx(
            `${flexCenteredClass} relative h-[8.125rem] w-full bg(grey9 dark:grey1) border(solid grey8 dark:grey3) rounded-lg`,
          )}
        >
          <div className={tw(`flex flex-col gap-4 items-center justify-items-center`)}>
            <p className={tw(`text(center secondary) px-12`)}>{uploadingLinkPreviewLabel}</p>
          </div>
        </div>
      )}
      {!uploading && linkPreviewData && (
        <Button
          plain={true}
          onClick={ev => {
            if (new URL(linkPreviewData.url).origin === window.location.origin) {
              handleLinkClick(linkPreviewData.url);
              ev.stopPropagation();
              ev.preventDefault();
              return false;
            } else {
              window.open(linkPreviewData?.url, '_blank', 'noopener');
            }
            return ev.stopPropagation();
          }}
        >
          <div className={tw(`relative flex rounded-t-lg`)}>
            {handleDeletePreview && (
              <Button
                plain={true}
                onClick={ev => {
                  ev.stopPropagation();
                  ev.preventDefault();
                  handleDeletePreview();
                }}
              >
                <div className={tx(`${closeDivClass}`)}>
                  <Icon icon={<XMarkIcon />} />
                </div>
              </Button>
            )}
            {!!(linkPreviewData.imageSources?.url || linkPreviewData.imageSources?.fallbackUrl) &&
              showCover && (
                <div className={tw(`flex rounded-t-sm border(solid grey8 dark:grey3)`)}>
                  <div className={tw(`flex`)}>
                    <source srcSet={linkPreviewData.imageSources?.url} />
                    <img
                      // don't resize the image to fit the width of the container
                      // because the image width might be smaller than the container width
                      className={tw(
                        `w-fit max-w-full max-h-full my-0 mx-auto object-contain rounded-t-lg`,
                      )}
                      src={linkPreviewData.imageSources?.fallbackUrl}
                      onLoad={handleCoverLoad}
                      alt={linkPreviewData.imageSources?.fallbackUrl}
                      referrerPolicy={'no-referrer'}
                    />
                  </div>
                </div>
              )}

            <div
              className={tx(
                `bg(grey9 dark:grey2) p-4 gap-4 border(solid grey8 dark:grey3) ${
                  linkPreviewData.images?.length && showCover ? 'rounded-b-sm' : 'rounded-sm'
                }`,
              )}
            >
              <div className={tw(`flex flex-row gap-3 py-3 items-center`)}>
                {!!(
                  linkPreviewData.faviconSources?.url || linkPreviewData.faviconSources?.fallbackUrl
                ) && !faviconErr ? (
                  <div className={tw(`flex`)}>
                    <source srcSet={linkPreviewData.faviconSources?.url} />
                    <img
                      className={tw(`h-4 w-4`)}
                      src={linkPreviewData.faviconSources?.fallbackUrl}
                      alt={linkPreviewData.faviconSources?.fallbackUrl}
                      onError={handleFaviconErr}
                      referrerPolicy={'no-referrer'}
                    />
                  </div>
                ) : (
                  <Icon
                    icon={<LinkIcon />}
                    customStyle={'h-3 w-3 text(secondaryLight dark:secondaryDark)'}
                  />
                )}
                {!!linkPreviewData.url && (
                  <p className={'text(secondaryLight dark:secondaryDark) truncate'}>{hostname}</p>
                )}
              </div>
              {!!linkPreviewData.title && (
                <p className={`text-lg font-semibold`}>{linkPreviewData.title}</p>
              )}
              {!!linkPreviewData.description && <p>{htmlDecode(linkPreviewData.description)}</p>}
            </div>
          </div>
        </Button>
      )}
    </>
  );
};

LinkPreview.defaultProps = {
  uploadingLinkPreviewLabel: 'Loading preview',
};

export default LinkPreview;
