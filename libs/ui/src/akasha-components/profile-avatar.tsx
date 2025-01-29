'use client';

import * as React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cva, type VariantProps } from 'class-variance-authority';
import { EyeOff } from 'lucide-react';

import { cn } from '@/library/utils';

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

export interface ProfileAvatarProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>,
    VariantProps<typeof profileAvatarVariants> {
  nsfw?: boolean;
}

const ProfileAvatarContext = React.createContext<{
  nsfw: boolean;
} | null>(null);

const useAvatarContext = () => {
  const context = React.useContext(ProfileAvatarContext);
  if (!context) {
    throw new Error('`useAvatarContext` must be used within an `ProfileAvatar` component');
  }
  return context;
};

const ProfileAvatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  ProfileAvatarProps
>(({ className, size, nsfw = false, ...props }, ref) => {
  return (
    <ProfileAvatarContext.Provider value={{ nsfw }}>
      <AvatarPrimitive.Root
        ref={ref}
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
});
ProfileAvatar.displayName = 'ProfileAvatar';

const ProfileAvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image> & {
    nsfw?: boolean;
  }
>(({ className, ...props }, ref) => {
  const { nsfw } = useAvatarContext();
  return nsfw ? (
    <EyeOff className={cn('text-destructive', className)} />
  ) : (
    <AvatarPrimitive.Image
      ref={ref}
      className={cn('aspect-square h-full w-full', className)}
      {...props}
      onLoadingStatusChange={() => {}}
    />
  );
});
ProfileAvatarImage.displayName = 'ProfileAvatarImage';

const ProfileAvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => {
  const { nsfw } = useAvatarContext();
  return (
    !nsfw && (
      <AvatarPrimitive.Fallback
        ref={ref}
        className={cn(
          'flex h-full w-full items-center justify-center rounded-full bg-muted',
          className,
        )}
        {...props}
      />
    )
  );
});
ProfileAvatarFallback.displayName = 'ProfileAvatarFallback';

export { ProfileAvatar, ProfileAvatarImage, ProfileAvatarFallback, profileAvatarVariants };
