import React from 'react';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import { ExclamationTriangleIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Link from '@akashaorg/design-system-core/lib/components/Link';
import Button from '@akashaorg/design-system-core/lib/components/Button';

export type AuthorsRemovedMessage = {
  firstPart: string;
  secondPart: string;
  thirdPart: { url: string; content: string };
  tapToViewLabel: string;
};
export type OthersRemovedMessage = { firstLine: string; secondLine: string };
export type EntryCardRemovedProps =
  | { message: AuthorsRemovedMessage; type: 'author'; onTapToView: () => void }
  | { message: OthersRemovedMessage; type: 'others' };

const EntryCardRemoved: React.FC<EntryCardRemovedProps> = props => {
  return (
    <Card
      background={props.type === 'author' ? 'grey8/50' : 'errorLight/30'}
      radius={10}
      padding={{ x: 16, y: 8 }}
      elevation="none"
      customStyle={props.type === 'author' ? '' : 'border-bg-errorLight'}
    >
      <Stack direction="row" spacing="gap-x-1">
        <Icon color="errorLight" icon={<ExclamationTriangleIcon />} />

        {props.type === 'author' ? (
          <Stack spacing="gap-y-1" customStyle="grow">
            <Text variant="button-sm">
              {props.message.firstPart}{' '}
              <Text as="span" variant="footnotes2">
                {props.message.secondPart}
              </Text>
              <Link to={props.message.thirdPart.url}>
                <Text
                  variant="footnotes2"
                  color={{ light: 'secondaryLight', dark: 'secondaryDark' }}
                >
                  {props.message.thirdPart.content}
                </Text>
              </Link>
            </Text>
            {props.type === 'author' && (
              <Button
                variant="text"
                onClick={props.onTapToView}
                label={props.message.tapToViewLabel}
              />
            )}
          </Stack>
        ) : (
          <Stack>
            <Text variant="footnotes2">{props.message.firstLine}</Text>
            <Text variant="button-sm">{props.message.secondLine}</Text>
          </Stack>
        )}
      </Stack>
    </Card>
  );
};

export default EntryCardRemoved;
