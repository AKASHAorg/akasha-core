import * as React from 'react';
import { Check } from 'lucide-react';

import { cn } from '@/ui/library/utils';
import { Badge } from '@akashaorg/ui/lib/akasha-components/badge';
import {
  ExtensionAvatar,
  ExtensionAvatarFallback,
  ExtensionAvatarImage,
} from '@/ui/extension-avatar';
import { ExtensionTypeIcon } from '@/ui/extension-type-icon';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import { AkashaAppApplicationType } from '@akashaorg/typings/lib/sdk/graphql-types-new';

const ExtensionCardContext = React.createContext<{
  extensionId?: string;
  extensionType?: AkashaAppApplicationType;
} | null>(null);

const useExtensionCardContext = () => {
  const context = React.useContext(ExtensionCardContext);
  if (!context) {
    throw new Error('`useExtensionCardContext` must be used within `ExtensionCard`');
  }
  return context;
};

const ExtensionCard = ({
  extensionId = '',
  extensionType = AkashaAppApplicationType.App,
  className,
  ...props
}: React.ComponentProps<'div'> & {
  extensionId?: string;
  extensionType?: AkashaAppApplicationType;
}) => {
  return (
    <ExtensionCardContext.Provider value={{ extensionId, extensionType }}>
      <div
        data-slot="extension-card"
        className={cn('grid grid-cols-[60px_auto_1fr] gap-2', className)}
        {...props}
      />
    </ExtensionCardContext.Provider>
  );
};

const ExtensionCardAvatar = (
  props: Omit<React.ComponentProps<typeof ExtensionAvatar>, 'extensionType'>,
) => {
  const { extensionId, extensionType } = useExtensionCardContext();

  return (
    <ExtensionAvatar
      data-slot="extension-card-avatar"
      extensionId={extensionId}
      size="lg"
      extensionType={extensionType}
      {...props}
    />
  );
};

const ExtensionCardAvatarFallback = (
  props: React.ComponentProps<typeof ExtensionAvatarFallback>,
) => <ExtensionAvatarFallback {...props} />;

const ExtensionCardAvatarImage = (props: React.ComponentProps<typeof ExtensionAvatarImage>) => (
  <ExtensionAvatarImage {...props} />
);

const ExtensionCardContent = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return (
    <div
      data-slot="extension-card-content"
      className={cn('flex flex-col gap-1 min-w-0', className)}
      {...props}
    />
  );
};

const ExtensionCardName = ({ className, children, ...props }: React.ComponentProps<'div'>) => {
  const { extensionType } = useExtensionCardContext();
  return (
    <div
      data-slot="extension-card-name-wrapper"
      className={cn('flex items-center gap-1', className)}
      {...props}
    >
      <Typography data-slot="extension-card-name" variant="sm" bold>
        {children}
      </Typography>
      <ExtensionTypeIcon extensionType={extensionType} />
    </div>
  );
};

const ExtensionCardDescription = ({
  className,
  ...props
}: React.ComponentProps<typeof Typography>) => {
  return (
    <Typography
      variant="xs"
      data-slot="extension-card-description"
      className={cn('text-muted-foreground line-clamp-1 truncate block', className)}
      {...props}
    />
  );
};

const ExtensionCardActionContext = React.createContext<{
  active?: boolean;
} | null>(null);

const useExtensionCardActionContext = () => {
  const context = React.useContext(ExtensionCardActionContext);
  if (!context) {
    throw new Error('`useExtensionCardActionContext` must be used within `ExtensionCardAction`');
  }
  return context;
};

const ExtensionCardAction = ({
  active,
  className,
  children,
  ...props
}: React.ComponentProps<'div'> & { active?: boolean }) => {
  return (
    <ExtensionCardActionContext.Provider value={{ active }}>
      <div
        data-slot="extension-card-action"
        className={cn('self-center text-end min-w-20 ml-5', className)}
        {...props}
      >
        {children}
      </div>
    </ExtensionCardActionContext.Provider>
  );
};

const ExtensionCardActionInactive = ({
  className,
  ...props
}: React.ComponentProps<typeof Badge>) => {
  const { active } = useExtensionCardActionContext();
  return (
    !active && (
      <Badge
        data-slot="extension-card-action-inactive"
        variant="outline"
        className={cn('cursor-pointer', className)}
        {...props}
      />
    )
  );
};

const ExtensionCardActionActive = ({
  children,
  className,
  ...props
}: React.ComponentProps<typeof Badge>) => {
  const { active } = useExtensionCardActionContext();
  return (
    active && (
      <Badge
        data-slot="extension-card-action-active"
        variant="secondary"
        className={cn('[&_svg]:size-4 cursor-pointer rounded-full', className)}
        {...props}
      >
        <Check />
        {children}
      </Badge>
    )
  );
};

export {
  ExtensionCard,
  ExtensionCardAvatar,
  ExtensionCardAvatarImage,
  ExtensionCardAvatarFallback,
  ExtensionCardContent,
  ExtensionCardName,
  ExtensionCardDescription,
  ExtensionCardAction,
  ExtensionCardActionInactive,
  ExtensionCardActionActive,
};
