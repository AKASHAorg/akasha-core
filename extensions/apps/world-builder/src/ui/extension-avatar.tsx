'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { EyeOff } from 'lucide-react';

import { cn } from '@/ui/library/utils';
import { getImageFromSeed } from '@/ui/library/get-image-from-seed';
import { ExtensionType } from '@/ui/types/extension-type';
import { Image, ImageFallback } from '@akashaorg/ui/lib/akasha-components/image';

const extensionVariants = cva(
  'flex justify-center items-center rounded-lg overflow-hidden shrink-0',
  {
    variants: {
      size: {
        xl: 'size-28 [&_svg]:size-6',
        lg: 'size-15 [&_svg]:size-4',
        md: 'size-12 [&_svg]:size-4',
        sm: 'size-10 [&_svg]:size-4',
      },
    },
    defaultVariants: {
      size: 'lg',
    },
  },
);

const ExtensionAvatarContext = React.createContext<{
  extensionId: string;
  extensionType: ExtensionType;
  nsfw: boolean;
  publicImgPath: string;
} | null>(null);

const useExtensionAvatarContext = () => {
  const context = React.useContext(ExtensionAvatarContext);
  if (!context) {
    throw new Error(
      '`useExtensionAvatarContext` must be used within an `ExtensionAvatar` component',
    );
  }
  return context;
};

const ExtensionAvatar = ({
  extensionId = '',
  size = 'lg',
  extensionType = ExtensionType.Widget,
  publicImgPath = '/images',
  nsfw = false,
  className,
  ...props
}: React.ComponentProps<'div'> &
  VariantProps<typeof extensionVariants> & {
    extensionId?: string;
    extensionType?: ExtensionType;
    nsfw?: boolean;
    publicImgPath?: string;
  }) => (
  <ExtensionAvatarContext.Provider value={{ extensionId, extensionType, nsfw, publicImgPath }}>
    <div
      data-slot="extension-avatar"
      className={cn(extensionVariants({ size }), nsfw && 'bg-muted', className)}
      {...props}
    />
  </ExtensionAvatarContext.Provider>
);

const ExtensionAvatarImage = ({ className, ...props }: React.ComponentProps<typeof Image>) => {
  const { nsfw } = useExtensionAvatarContext();
  return nsfw ? (
    <EyeOff strokeWidth={1} className={cn('text-destructive', className)} />
  ) : (
    <Image
      data-slot="extension-avatar-image"
      className={cn(className)}
      alt={props.alt}
      {...props}
    />
  );
};

const ExtensionAvatarFallback = ({
  children,
  ...props
}: React.ComponentProps<typeof ImageFallback>) => {
  const { extensionType, publicImgPath, extensionId, nsfw } = useExtensionAvatarContext();
  const seed = getImageFromSeed(extensionId, 3);

  let avatarFallback: string;

  switch (extensionType) {
    case ExtensionType.App:
      avatarFallback = `${publicImgPath}/app-${seed}.webp`;
      break;
    case ExtensionType.Widget:
      avatarFallback = `${publicImgPath}/widget-${seed}.webp`;
      break;
    case ExtensionType.Plugin:
      avatarFallback = `${publicImgPath}/plugin-${seed}.webp`;
      break;
    case ExtensionType.Other:
      avatarFallback = `${publicImgPath}/other-${seed}.webp`;
      break;
    default:
      avatarFallback = `${publicImgPath}/app-${seed}.webp`;
      break;
  }

  return (
    !nsfw &&
    avatarFallback && (
      <ImageFallback data-slot="extension-avatar-fallback" {...props}>
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
      </ImageFallback>
    )
  );
};

export { ExtensionAvatar, ExtensionAvatarImage, ExtensionAvatarFallback };
