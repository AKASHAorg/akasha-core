'use client';

import * as React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cva, type VariantProps } from 'class-variance-authority';
import { EyeOff } from 'lucide-react';

import { cn } from '@/ui/library/utils';
import { getImageFromSeed } from '@/ui/library/get-image-from-seed';

const profileAvatarVariants = cva(
  'relative flex shrink-0 justify-center items-center overflow-hidden rounded-full',
  {
    variants: {
      size: {
        xl: 'size-20 [&_svg]:size-8',
        lg: 'size-10 [&_svg]:size-4',
        md: 'size-8 [&_svg]:size-3',
        sm: 'size-6 [&_svg]:size-3',
        xs: 'size-4 [&_svg]:size-3',
      },
    },
    defaultVariants: {
      size: 'lg',
    },
  },
);

const ProfileAvatarContext = React.createContext<{
  profileDID: string;
  publicImgPath: string;
  nsfw: boolean;
} | null>(null);

const useAvatarContext = () => {
  const context = React.useContext(ProfileAvatarContext);
  if (!context) {
    throw new Error('`useAvatarContext` must be used within an `ProfileAvatar` component');
  }
  return context;
};

const ProfileAvatar = ({
  profileDID = '',
  publicImgPath = '/images',
  nsfw = false,
  size,
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root> &
  VariantProps<typeof profileAvatarVariants> & {
    profileDID?: string;
    publicImgPath?: string;
    nsfw?: boolean;
  }) => {
  return (
    <ProfileAvatarContext.Provider value={{ nsfw, profileDID, publicImgPath }}>
      <AvatarPrimitive.Root
        data-slot="profile-avatar"
        className={cn(
          profileAvatarVariants({
            size,
            className,
          }),
          nsfw && 'bg-muted',
        )}
        {...props}
      />
    </ProfileAvatarContext.Provider>
  );
};

const ProfileAvatarImage = ({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image> & {
  nsfw?: boolean;
}) => {
  const { nsfw } = useAvatarContext();
  return nsfw ? (
    <EyeOff className={cn('text-destructive', className)} />
  ) : (
    <AvatarPrimitive.Image
      data-slot="profile-avatar-image"
      className={cn('aspect-square h-full w-full', className)}
      {...props}
      onLoadingStatusChange={() => {}}
    />
  );
};

const ProfileAvatarFallback = ({
  children,
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) => {
  const { profileDID, publicImgPath, nsfw } = useAvatarContext();

  const seed = getImageFromSeed(profileDID, 7);
  const avatarFallback = `${publicImgPath}/avatar-${seed}-min.webp`;
  return (
    !nsfw && (
      <AvatarPrimitive.Fallback
        data-slot="profile-avatar-fallback"
        className={cn(
          'flex h-full w-full items-center justify-center rounded-full bg-muted',
          className,
        )}
        {...props}
      >
        {React.Children.count(children) ? (
          children
        ) : (
          <img
            data-slot="image"
            loading="lazy"
            decoding="async"
            src={avatarFallback}
            alt="fallback"
            className="object-contain"
          />
        )}
      </AvatarPrimitive.Fallback>
    )
  );
};

export { ProfileAvatar, ProfileAvatarImage, ProfileAvatarFallback, profileAvatarVariants };
