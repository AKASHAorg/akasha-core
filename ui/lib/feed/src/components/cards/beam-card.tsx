import React from 'react';
import EntryCard from '@akashaorg/design-system-components/lib/components/Entry/EntryCard';
import { ContentBlockExtension } from '@akashaorg/ui-lib-extensions/lib/react/content-block';

import { hasOwn } from '@akashaorg/ui-awf-hooks';
import { ILocale } from '@akashaorg/design-system-core/lib/utils';
import { AkashaBeam } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { ContentBlockModes, EntityTypes, RootComponentProps } from '@akashaorg/typings/lib/ui';
import { sortByKey, useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import { useGetProfileByDidQuery } from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';
import { useTranslation } from 'react-i18next';

type BeamCardProps = {
  entryData: AkashaBeam;
  locale: ILocale;
  uiEvents: RootComponentProps['uiEvents'];
  onContentClick: () => void;
};

const BeamCard: React.FC<BeamCardProps> = props => {
  const { getRoutingPlugin } = useRootComponentProps();
  const { t } = useTranslation('ui-lib-feed');

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

  const onAvatarClick = (id: string) => {
    navigateTo({
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
      removed={{
        author: {
          firstPart: t('AKASHA world members won’t be able to see the content '),
          secondPart: t('of your beam because you have violated the following '),
          thirdPart: { url: '' /*@TODO */, content: t('Code of Conduct.') },
          tapToViewLabel: t('Tap to view'),
        },
        others: {
          firstLine: t('This beam has been delisted for the violation of our Code of Conduct.'),
          secondLine: t('All reflections are disabled.'),
        },
      }}
      nsfw={{
        sensitiveContentLabel: t('Sensitive Content!'),
        clickToViewLabel: t('Click to View'),
      }}
      itemType={EntityTypes.BEAM}
      onAvatarClick={onAvatarClick}
      onContentClick={onContentClick}
    >
      {({ blockID }) => (
        <ContentBlockExtension readMode={{ blockID }} mode={ContentBlockModes.READONLY} />
      )}
    </EntryCard>
  );
};

export default BeamCard;
