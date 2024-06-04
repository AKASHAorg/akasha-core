import React from 'react';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import { ExclamationTriangleIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
// import Text from '@akashaorg/design-system-core/lib/components/Text';
// import Link from '@akashaorg/design-system-core/lib/components/Link';
// import Button from '@akashaorg/design-system-core/lib/components/Button';

// export type AuthorsRemovedMessage = {
//   firstPart: string;
//   secondPart: string;
//   thirdPart?: { url: string; content: string };
//   tapToViewLabel?: string;
// };
// export type OthersRemovedMessage = { firstLine: string; secondLine: string };
export type EntryCardRemovedProps =
  | { message: React.ReactNode; type: 'author' }
  | { message: React.ReactNode; type: 'others' };

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

        {/*<Stack spacing="gap-y-1" customStyle="grow">*/}
        {/*  {props.message}*/}
        {/*{props.type === 'author' ? (*/}
        {/*    {props.message} /!*{props.message.thirdPart && (*!/*/}
        {/*    /!*  <Link to={props.message.thirdPart.url}>*!/*/}
        {/*    /!*    <Text*!/*/}
        {/*    /!*      variant="footnotes2"*!/*/}
        {/*    /!*      color={{ light: 'secondaryLight', dark: 'secondaryDark' }}*!/*/}
        {/*    /!*    >*!/*/}
        {/*    /!*      {props.message.thirdPart.content}*!/*/}
        {/*    /!*    </Text>*!/*/}
        {/*    /!*  </Link>*!/*/}
        {/*    /!*)}*!/*/}
        {/*    /!*{props.type === 'author' && (*!/*/}
        {/*    /!*  <Button*!/*/}
        {/*    /!*    variant="text"*!/*/}
        {/*    /!*    onClick={props.onTapToView}*!/*/}
        {/*    /!*    label={props.message.tapToViewLabel}*!/*/}
        {/*    /!*  />*!/*/}
        {/*    /!*)}*!/*/}
        {/*  </Stack>*/}
        {/*) : (*/}
        {/*)}*/}
        <Stack spacing="gap-y-1" customStyle="grow">
          {props.message}
        </Stack>
      </Stack>
    </Card>
  );
};

export default EntryCardRemoved;
