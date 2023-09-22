import React from 'react';
import EntryCard from '@akashaorg/design-system-components/lib/components/Entry/EntryCard';
import { hasOwn } from '@akashaorg/ui-awf-hooks';
import { ILocale } from '@akashaorg/design-system-core/lib/utils';
import { AkashaBeam } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { EntityTypes, RootComponentProps } from '@akashaorg/typings/lib/ui';
import { sortByKey, useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import { useGetProfileByDidQuery } from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';

type BeamCardProps = {
  entryData: AkashaBeam;
  locale: ILocale;
  uiEvents: RootComponentProps['uiEvents'];
  onContentClick: () => void;
};

const BeamCard: React.FC<BeamCardProps> = props => {
  const { getRoutingPlugin } = useRootComponentProps();
  const { entryData, locale, uiEvents, onContentClick } = props;
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
      repliesAnchorLink="/@akashaorg/app-akasha-integration/beam"
      profileAnchorLink="/@akashaorg/app-profile"
      sortedContents={sortByKey(entryData.content, 'order')}
      uiEvents={uiEvents}
      itemType={EntityTypes.BEAM}
      onAvatarClick={onAvatarClick}
      onContentClick={onContentClick}
    />
  );
};

export default BeamCard;
