import React from 'react';
import EntryCard from '@akashaorg/design-system-components/lib/components/Entry/EntryCard';
import { hasOwn } from '@akashaorg/ui-awf-hooks';
import { ILocale } from '@akashaorg/design-system-core/lib/utils';
import { AkashaReflect } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { EntityTypes } from '@akashaorg/typings/lib/ui';
import { decodeb64SlateContent, useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import { useGetProfileByDidQuery } from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';

type ReflectCardProps = {
  entryData: AkashaReflect;
  locale: ILocale;
  onContentClick: () => void;
};

const ReflectCard: React.FC<ReflectCardProps> = props => {
  const { getRoutingPlugin } = useRootComponentProps();
  const { entryData, locale, onContentClick } = props;
  const profileDataReq = useGetProfileByDidQuery(
    { id: entryData.author.id },
    { select: response => response.node },
  );
  const { akashaProfile: profileData } =
    profileDataReq.data && hasOwn(profileDataReq.data, 'isViewer')
      ? profileDataReq.data
      : { akashaProfile: null };

  const navigateTo = getRoutingPlugin().navigateTo;

  const onAvatarClick = (id: string) => () => {
    navigateTo?.({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: routes => `${routes.rootRoute}/${id}`,
    });
  };

  return (
    <EntryCard
      entryData={entryData}
      authorProfile={{ data: profileData, status: profileDataReq.status }}
      locale={locale}
      profileAnchorLink="/@akashaorg/app-profile"
      slateContent={entryData.content.map(item => decodeb64SlateContent(item.value, null, true))}
      itemType={EntityTypes.REFLECT}
      onAvatarClick={onAvatarClick}
      onContentClick={onContentClick}
    />
  );
};

export default ReflectCard;
