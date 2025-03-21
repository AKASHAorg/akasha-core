import * as React from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/ui/hover-card';
import {
  ExtensionCard,
  ExtensionCardAvatar,
  ExtensionCardAvatarFallback,
  ExtensionCardAvatarImage,
  ExtensionCardContent,
  ExtensionCardDescription,
  ExtensionCardName,
} from '@/ui/extension-card';
import {
  ProfileAvatarButton,
  ProfileAvatarButtonAvatar,
  ProfileAvatarButtonAvatarFallback,
  ProfileAvatarButtonAvatarImage,
  ProfileDidField,
  ProfileName,
} from '@/ui/profile-avatar-button';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import { transformSource, useRootComponentProps } from '@akashaorg/ui-core-hooks';
import { AkashaAppInterface } from '@akashaorg/typings/lib/sdk/graphql-types-new';

type ExtensionElementProps = {
  extensionData: AkashaAppInterface;
};

export const ExtensionElement: React.FC<ExtensionElementProps> = props => {
  const { extensionData } = props;

  const { getCorePlugins, encodeAppName } = useRootComponentProps();
  const navigateTo = getCorePlugins().routing.navigateTo;

  const handleNavToApp = (extensionName: string) => {
    navigateTo({
      appName: '@akashaorg/app-extensions',
      getNavigationUrl: () => `/info/${extensionName}`,
    });
  };

  return (
    <HoverCard>
      <HoverCardTrigger>
        <Button
          className="p-0 h-5"
          variant="link"
          onClick={() => handleNavToApp(encodeAppName(extensionData?.name))}
        >
          {extensionData?.displayName}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-full p-0 z-[99]">
        <ExtensionCard className="p-4">
          <ExtensionCardAvatar size="lg" extensionId={extensionData?.id}>
            <ExtensionCardAvatarImage src={transformSource(extensionData?.logoImage)?.src}>
              <ExtensionCardAvatarFallback />
            </ExtensionCardAvatarImage>
          </ExtensionCardAvatar>
          <ExtensionCardContent className="max-w-80">
            <ExtensionCardName>{extensionData?.displayName}</ExtensionCardName>
            <ProfileAvatarButton size="sm" profileDID={extensionData?.author?.id}>
              <ProfileAvatarButtonAvatar>
                <ProfileAvatarButtonAvatarImage
                  src={transformSource(extensionData?.author?.akashaProfile?.avatar?.default)?.src}
                />
                <ProfileAvatarButtonAvatarFallback />
              </ProfileAvatarButtonAvatar>
              <ProfileName>{extensionData?.author?.akashaProfile?.name}</ProfileName>
              <ProfileDidField />
            </ProfileAvatarButton>
            <ExtensionCardDescription>{extensionData?.description}</ExtensionCardDescription>
          </ExtensionCardContent>
        </ExtensionCard>
      </HoverCardContent>
    </HoverCard>
  );
};
