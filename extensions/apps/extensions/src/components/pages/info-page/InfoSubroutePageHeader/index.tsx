import * as React from 'react';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import AppAvatar from '@akashaorg/design-system-components/lib/components/AppAvatar';
import {
  AkashaAppApplicationType,
  AppImageSource,
} from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { transformSource } from '@akashaorg/ui-core-hooks/lib/utils/media-utils';
export type ExtensionHeaderProps = {
  pageTitle?: string;
  appName: string;
  packageName?: string;
  appType?: AkashaAppApplicationType;
  nsfw?: boolean;
  description?: string;
  appLogo?: AppImageSource;
};

/**
 * Component used in the extension info page
 * @param pageTitle - optional page title
 * @param appName - display name of the extension
 * @param packageName - unique identifier for the extension
 * @param appType - type of extension
 * @param description - optional description for the extension
 * @param nsfw - sets if the extension is safe for work or not
 */
const ExtensionHeader: React.FC<ExtensionHeaderProps> = ({
  pageTitle,
  appName,
  packageName,
  appType,
  appLogo,
}) => {
  return (
    <Stack spacing={4}>
      {pageTitle && <Typography variant="h5">{pageTitle}</Typography>}
      <Stack direction="row" alignItems="center" spacing={2}>
        <AppAvatar height={3} width={3} appType={appType} avatar={transformSource(appLogo)} />
        <Stack direction="column">
          <Typography variant="h6">{appName}</Typography>
          <Typography
            variant="xs"
            className="font-medium font-normal text-grey4 dark:text-grey7 truncate"
          >
            {packageName}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};
export default ExtensionHeader;
