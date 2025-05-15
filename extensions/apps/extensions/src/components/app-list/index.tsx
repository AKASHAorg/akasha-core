import React from 'react';
import {
  InfiniteScroll,
  InfiniteScrollList,
} from '@akashaorg/ui/lib/akasha-components/infinite-scroll';
import ExtensionCard, { ExtensionCardProps } from '../extension-card';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { XCircleIcon } from 'lucide-react';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';

export type AppListProps = {
  apps: ExtensionCardProps[];
  loadErrorMessage?: {
    title: string;
    message: string;
  };
  hasNextPage?: boolean;
  loading?: boolean;
  overScan?: number;
  onLoadMore?: () => void;
};
const ENTRY_HEIGHT = 92;
const ITEM_SPACING = 16;

/**
 * Component that renders a list of apps
 * @param apps - array of extensions
 * @param showAppTypeIndicator - boolean (optional) to show app type
 * @param loading -  boolean (optional) indicates if data is loading
 * @param hasNextPage - boolean (optional) used for pagination to indicate if next set of data is available
 * @param onLoadMore - handler for loading more data
 * @param overScan - overscan value
 */
const AppList: React.FC<AppListProps> = ({
  apps,
  loading,
  hasNextPage,
  onLoadMore,
  overScan = 1,
  loadErrorMessage,
}) => {
  return (
    <InfiniteScroll
      count={apps.length}
      estimatedHeight={ENTRY_HEIGHT}
      gap={ITEM_SPACING}
      overScan={overScan}
      lanes={2}
      hasNextPage={hasNextPage}
      loading={loading}
      onLoadMore={onLoadMore}
      className={
        apps.length > 1
          ? 'grid grid-cols-[repeat(auto-fit,_minmax(min(16rem,_100%),_1fr))] gap-4'
          : 'flex'
      }
    >
      <InfiniteScrollList>
        {itemIndex => {
          if (!apps[itemIndex]) {
            return (
              <Card className="h-full flex flex-col justify-center items-center">
                <XCircleIcon className="h-5 w-5 mb-4 [&>*]:fill-errorLight dark:[&>*]:fill-errorLight" />
                <Typography variant="sm" bold>
                  {loadErrorMessage?.title}
                </Typography>
                <Typography variant="sm">{loadErrorMessage?.message}</Typography>
              </Card>
            );
          }
          const {
            coverImageSrc,
            displayName,
            applicationType,
            extensionTypeLabel,
            author,
            description,
            action,
            defaultLabel,
            nsfwLabel,
            isDefaultWorldExtension,
            nsfw,
            featured,
          } = apps[itemIndex];
          return (
            <ExtensionCard
              coverImageSrc={coverImageSrc}
              displayName={displayName}
              applicationType={applicationType}
              extensionTypeLabel={extensionTypeLabel}
              author={author}
              description={description}
              action={action}
              nsfw={nsfw}
              featured={featured || apps.length === 1}
              defaultLabel={defaultLabel}
              nsfwLabel={nsfwLabel}
              isDefaultWorldExtension={isDefaultWorldExtension}
              customStyle="h-full"
            />
          );
        }}
      </InfiniteScrollList>
    </InfiniteScroll>
  );
};
export default AppList;
