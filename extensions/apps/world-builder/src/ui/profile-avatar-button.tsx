'use client';

import * as React from 'react';

import { cn } from '@/ui/library/utils';
import { IconContainer } from '@akashaorg/ui/lib/akasha-components/icon-container';
import {
  ProfileAvatarFallback,
  ProfileAvatarImage,
  ProfileAvatar as ProfileAvatarRoot,
} from '@/ui/profile-avatar';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import { DidKey } from '@akashaorg/ui/lib/custom-icons/did-key';
import { Ethereum } from '@akashaorg/ui/lib/custom-icons/ethereum';
import { NoEth } from '@akashaorg/ui/lib/custom-icons/no-eth';
import { Solana } from '@akashaorg/ui/lib/custom-icons/solana';

type ProfileAvatarButtonSize = 'sm' | 'lg' | 'md';

const ProfileAvatarButtonContext = React.createContext<{
  size: ProfileAvatarButtonSize;
  nsfw: boolean;
  nsfwLabel?: string;
  metadata?: React.ReactNode;
  vertical: boolean;
} | null>(null);

const useProfileAvatarButtonContext = () => {
  const context = React.useContext(ProfileAvatarButtonContext);
  if (!context) {
    throw new Error('`useProfileAvatarButtonContext` must be used within `ProfileAvatarButton`');
  }
  return context;
};

const truncateMiddle = (str: string, startChars = 6, endChars = 4) =>
  str ? `${str.substring(0, startChars)}...${str.substring(str.length - endChars)}` : '';

const truncateDid = (didKey: string, type = 'eth') => {
  if (!didKey) return '';
  if (didKey.length <= 12) return didKey;
  const address = didKey.split(':').pop() || '';
  return truncateMiddle(address, type === 'eth' || type === 'solana' ? 6 : 5, 6);
};

const getDidFieldIconType = (didKey: string) => {
  if (!didKey) return 'noDid';
  // eslint-disable-next-line unicorn/no-nested-ternary
  return didKey.includes('eip155') ? 'ethereum' : didKey.includes('solana') ? 'solana' : 'did';
};

const ProfileAvatarButton = ({
  nsfw = false,
  nsfwLabel,
  metadata,
  children,
  size = 'md',
  vertical = false,
  className,
  ...props
}: { nsfw?: boolean; nsfwLabel?: string; metadata?: React.ReactNode } & (
  | { size?: Exclude<ProfileAvatarButtonSize, 'lg'>; vertical?: false }
  | {
      size?: 'lg';
      vertical?: true;
    }
) &
  React.ComponentProps<'div'>) => {
  return (
    <ProfileAvatarButtonContext.Provider value={{ size, nsfw, nsfwLabel, metadata, vertical }}>
      <div
        data-slot="profile-avatar-button"
        className={cn(
          {
            'grid grid-cols-[0.5fr_1fr] grid-rows-2': size === 'lg' && !vertical,
            'grid grid-cols-[0fr_1fr] grid-rows-2': size === 'md',
            'flex items-center flex-col': size === 'lg' && vertical,
            'flex items-center': size === 'sm',
          },
          'gap-1',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </ProfileAvatarButtonContext.Provider>
  );
};

const sizeMap = { lg: 'xl', md: 'lg', sm: 'xs' } as const;

const ProfileAvatar = ({
  className,
  ...props
}: Omit<React.ComponentProps<typeof ProfileAvatarRoot>, 'size'>) => {
  const { size, nsfw, vertical } = useProfileAvatarButtonContext();
  return (
    <ProfileAvatarRoot
      data-slot="profile-avatar"
      size={sizeMap[size]}
      nsfw={nsfw}
      className={cn(
        {
          'self-center row-span-2': size === 'md' || (size === 'lg' && !vertical),
        },
        className,
      )}
      {...props}
    />
  );
};

const ProfileName = ({ className, children, ...props }: React.ComponentProps<'div'>) => {
  const { size, vertical, nsfw, nsfwLabel, metadata } = useProfileAvatarButtonContext();
  return (
    size && (
      <Stack
        data-slot="profile-name"
        direction="row"
        alignItems="center"
        spacing={1}
        className={cn({
          'self-end': size === 'lg' && !vertical,
          'justify-self-start': size === 'md' || (size === 'lg' && !vertical),
        })}
        {...props}
      >
        <Typography
          variant={size === 'sm' ? 'xs' : 'sm'}
          bold={size !== 'sm'}
          className={className}
        >
          {children}
        </Typography>
        {nsfw && size !== 'sm' && (
          <Typography data-slot="nsfw-label" variant="xs" bold={true} className="text-destructive">
            {nsfwLabel}
          </Typography>
        )}
        {metadata}
      </Stack>
    )
  );
};

const didNetworkIconMapping = {
  ethereum: <Ethereum />,
  solana: <Solana />,
  did: <DidKey />,
  noDid: <NoEth />,
};

const ProfileDidField = ({
  did,
  isValid = true,
  className,
}: React.ComponentProps<'div'> & {
  did: string;
  isValid?: boolean;
  className?: string;
}) => {
  const { size, vertical } = useProfileAvatarButtonContext();
  const networkType = getDidFieldIconType(did);
  return (
    <Stack
      data-slot="profile-did-field"
      direction="row"
      spacing={1.5}
      alignItems="center"
      className={cn(
        'h-4',
        {
          'col-start-2': size === 'md' || (size === 'lg' && !vertical),
        },
        className,
      )}
    >
      <IconContainer size="xs" className="text-secondary-foreground">
        {isValid ? didNetworkIconMapping[networkType] : <NoEth />}
      </IconContainer>
      <Typography variant="xs" className="text-secondary-foreground">
        {truncateDid(did, networkType)}
      </Typography>
    </Stack>
  );
};

export {
  ProfileAvatarButton,
  ProfileAvatar,
  ProfileAvatarFallback,
  ProfileAvatarImage,
  ProfileName,
  ProfileDidField,
};
