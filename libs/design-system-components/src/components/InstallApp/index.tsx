import React, { useMemo } from 'react';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import Text, { TextProps } from '@akashaorg/design-system-core/lib/components/Text';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import ErrorIcon from './error-icon';
import InstallIcon from './install-icon';
import SuccessIcon from './success-icon';

import AppAvatar from '@akashaorg/design-system-core/lib/components/AppAvatar';
import {
  AkashaAppApplicationType,
  AppImageSource,
} from '@akashaorg/typings/lib/sdk/graphql-types-new';
import AppIcon from '@akashaorg/design-system-core/lib/components/AppIcon';
import {
  Akasha,
  Walletconnect,
} from '@akashaorg/design-system-core/lib/components/Icon/akasha-icons';
import IndicatorDots from '../IndicatorDots';

export type InstallAppProps = {
  title: string;
  appName: string;
  appAvatar?: AppImageSource;
  appType: AkashaAppApplicationType;
  publisherName?: string;
  publisherDID: string;
  progressInfo: string;
  status: 'in-progress' | 'error' | 'complete' | 'authorize-request';
  actions?: { label: string; onClick: () => void }[];
  successLabel: string;
};

const errorStyle = '[&>*]:fill-errorLight dark:[&>*]:fill-errorDark';
const errorAnimationStyle = `animate-ping absolute h-full w-full ${errorStyle} opacity-75`;

const installStyle = `animate-bounce [&>*]:fill-secondaryLight dark:[&>*]:fill-secondaryDark`;

const successStyle = '[&>*]:fill:success';
const successAnimationStyle = `animate-ping absolute h-full w-full ${successStyle} opacity-75`;

const TruncateText = ({
  text,
  visibleCount,
  textProps,
}: {
  text: string;
  visibleCount: number;
  textProps: TextProps;
}) => {
  const [first, last] = useMemo(() => {
    return [text.slice(0, text.length - visibleCount), text.slice(text.length - visibleCount)];
  }, [text, visibleCount]);

  return (
    <Text {...textProps} customStyle={`${textProps.customStyle} flex`}>
      <span
        title={text}
        className="max-w-[20ch] md:max-w-[30ch] overflow-hidden truncate inline-block"
      >
        {first}
      </span>
      <span className="inline-block">{last}</span>
    </Text>
  );
};

const InstallApp = ({
  title,
  appName,
  appAvatar,
  appType,
  publisherName,
  publisherDID,
  progressInfo,
  status,
  actions = [],
  successLabel = 'Success',
}: InstallAppProps) => {
  return (
    <Card className="p-6">
      <Stack alignItems="center" direction="column" spacing={8}>
        <Text variant="h5">{title}</Text>
        <Stack direction="row" spacing={4} className="px-2 py-2.5 bg(grey9 dark:grey5) rounded-xl">
          <AppAvatar appType={appType} avatar={appAvatar} width={4} height={4} />
          <Stack direction="column" justifyContent="between">
            <Text variant="button-lg">{appName}</Text>
            <Stack>
              <Text variant="footnotes2">{publisherName}</Text>
              <TruncateText
                text={publisherDID}
                visibleCount={6}
                textProps={{
                  variant: 'footnotes2',
                  color: { light: 'secondaryLight', dark: 'secondaryDark' },
                }}
              />
            </Stack>
          </Stack>
        </Stack>
        <Stack direction="column" className="max-w-xs">
          <Stack alignItems="center" direction="column" spacing={4}>
            {status === 'authorize-request' && (
              <Stack direction="row" alignItems="center" justifyContent="center">
                <AppIcon
                  placeholderIcon={<Walletconnect />}
                  radius={24}
                  iconColor="self-color"
                  customStyle="bg-gradient-to-b orange-50 orange-200 size-10"
                />
                <IndicatorDots size="sm" />
                <AppIcon
                  placeholderIcon={<Akasha />}
                  solid={true}
                  radius={8}
                  iconColor="black"
                  customStyle="bg-gradient-to-b from-blue-200 to-red-200 size-6"
                />
              </Stack>
            )}
            {status === 'error' && (
              <div className={'relative'}>
                <ErrorIcon className={`${errorAnimationStyle}`} />
                <ErrorIcon className={`${errorStyle}`} />
              </div>
            )}
            {status === 'in-progress' && <InstallIcon className={installStyle} />}
            {status === 'complete' && (
              <Stack direction="row" spacing={4} alignItems="center">
                <div className={'relative'}>
                  <SuccessIcon className={`${successAnimationStyle}`} />
                  <SuccessIcon className={`${successStyle}`} />
                </div>
                <Text color="success" variant="button-lg">
                  {successLabel}
                </Text>
              </Stack>
            )}
            <Text
              align="center"
              variant="subtitle1"
              weight="light"
              color={{ light: 'grey4', dark: 'grey6' }}
            >
              {progressInfo}
            </Text>
          </Stack>
        </Stack>
        <Stack>
          {actions.map(action => (
            <Button key={action.label} onClick={action.onClick} variant="link">
              {action.label}
            </Button>
          ))}
        </Stack>
      </Stack>
    </Card>
  );
};

export default InstallApp;
