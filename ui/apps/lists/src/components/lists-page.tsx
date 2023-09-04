import React from 'react';
import { useTranslation } from 'react-i18next';

import Box from '@akashaorg/design-system-core/lib/components/Box';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import Modal from '@akashaorg/design-system-core/lib/components/Modal';
import Spinner from '@akashaorg/design-system-core/lib/components/Spinner';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import ListAppTopbar from '@akashaorg/design-system-components/lib/components/ListAppTopbar';
import DefaultEmptyCard from '@akashaorg/design-system-components/lib/components/DefaultEmptyCard';
import { RootComponentProps, EntityTypes, ModalNavigationOptions } from '@akashaorg/typings/ui';
import FeedWidget from '@akashaorg/ui-lib-feed/lib/components/app';
import { useEntryNavigation } from '@akashaorg/ui-awf-hooks';
import { useGetMyProfileQuery } from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';

type ListsPageProps = Omit<
  RootComponentProps,
  'layout' | 'events' | 'domElement' | 'name' | 'unmountSelf' | 'activeWhen' | 'rootNodeId'
>;

const ListsPage: React.FC<ListsPageProps> = props => {
  const { uiEvents, plugins, navigateToModal, layoutConfig } = props;
  const { t } = useTranslation('app-lists');
  const [showModal, setShowModal] = React.useState(false);
  const bookmarkDelete = null;

  const profileDataReq = useGetMyProfileQuery(null, {
    select: resp => {
      return resp.viewer?.akashaProfile;
    },
  });
  const loggedProfileData = profileDataReq?.data;

  const isLoggedIn = React.useMemo(() => {
    return loggedProfileData?.did?.id;
  }, [loggedProfileData?.did?.id]);

  const listsReq = null;
  /**
   * Currently react query's initialData isn't working properly so listsReq.data will return undefined even if we supply initialData.
   * This will be fixed in v4 of React query(https://github.com/DamianOsipiuk/vue-query/issues/124).
   * In the meantime, the following check will ensure undefined data is handled.  */
  const lists = listsReq?.data || [];

  const bookmarkedBeamsIds = lists?.map((bm: Record<string, string>) => bm.itemId);
  const bookmarkedBeams = undefined;
  const numberOfBookmarkedInactivePosts = React.useMemo(
    () => bookmarkedBeams?.filter(({ data }) => (data ? data.active : false)).length,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [bookmarkedBeamsIds],
  );

  const showLoginModal = (redirectTo?: { modal: ModalNavigationOptions }) => {
    props.navigateToModal({ name: 'login', redirectTo });
  };

  const handleEntryFlag = (itemId: string, itemType: EntityTypes) => () => {
    if (!loggedProfileData?.did?.id) {
      return showLoginModal({ modal: { name: 'report-modal', itemId, itemType } });
    }
    props.navigateToModal({ name: 'report-modal', itemId, itemType });
  };

  const handleEntryRemove = (itemId: string) => {
    props.navigateToModal({
      name: 'entry-remove-confirmation',
      itemId,
      itemType: EntityTypes.BEAM,
    });
  };

  const description = t('Lists help you save your favorite posts for quick access at any time.');

  const getInactivePostsText = (numberOfBookmarkedInactivePosts: number) => {
    const linkingVerb = numberOfBookmarkedInactivePosts > 1 ? t('are') : t('is');
    const result = numberOfBookmarkedInactivePosts
      ? t('{{ deletedCount }} of which {{ linkingVerb }} deleted', {
          deletedCount: numberOfBookmarkedInactivePosts,
          linkingVerb,
        })
      : '';
    return result ? ` (${result})` : '';
  };

  const getSubtitleText = () => {
    if (isLoggedIn && lists?.length) {
      return t('You have {{ bookmarkCount }} lists.{{ inactivePostsText }}', {
        bookmarkCount: lists.length,
        inactivePostsText: getInactivePostsText(numberOfBookmarkedInactivePosts),
      });
    }
    if (isLoggedIn && !lists?.length) {
      return description;
    }
    return t('Check out the posts saved in your lists');
  };

  const handleIconMenuClick = () => {
    setShowModal(!showModal);
  };

  const removeAllBookmarkedItems = () => {
    bookmarkedBeamsIds.forEach(itemId => bookmarkDelete.mutate(itemId));
  };

  return (
    <Card elevation={'1'} radius={16} padding={'p-4'}>
      <ListAppTopbar resetLabel={t('Reset')} handleIconMenuClick={handleIconMenuClick} />
      {listsReq?.status === 'error' && (
        <ErrorLoader
          type="script-error"
          title={t('There was an error loading the lists')}
          details={listsReq?.error as string}
        />
      )}

      <Box data-testid="lists" customStyle="space-x-8 space-y-8">
        {/* <StartCard
            title={t('Lists')}
            subtitle={getSubtitleText()}
            heading={t('✨ Save what inspires you ✨')}
            description={description}
            image={'/images/no-saved-posts-error.webp'}
            showMainArea={!isLoggedIn}
          /> */}

        {!listsReq?.isFetched && isLoggedIn && <Spinner />}
        {(!isLoggedIn || (listsReq.isFetched && (!lists || !lists.length))) && (
          <DefaultEmptyCard infoText={t('You don’t have any saved content in your List')} />
        )}

        <FeedWidget
          queryKey="akasha-lists-page-query"
          modalSlotId={layoutConfig.modalSlotId}
          // @TODO: create an entry for lists
          itemType={EntityTypes.BEAM}
          loggedProfileData={loggedProfileData}
          navigateToModal={navigateToModal}
          onLoginModalOpen={showLoginModal}
          contentClickable={true}
          onEntryFlag={handleEntryFlag}
          onEntryRemove={handleEntryRemove}
          uiEvents={uiEvents}
          itemSpacing={8}
          onNavigate={useEntryNavigation(plugins['@akashaorg/app-routing']?.routing?.navigateTo)}
          i18n={plugins['@akashaorg/app-translation']?.translation?.i18n}
        />
      </Box>
      <Modal
        title={{ label: t('Remove Content') }}
        show={showModal}
        onClose={() => {
          setShowModal(false);
        }}
        actions={[
          {
            variant: 'secondary',
            label: t('Cancel'),
            onClick: () => {
              setShowModal(!showModal);
            },
          },
          {
            variant: 'primary',
            label: 'Remove All',
            onClick: () => {
              removeAllBookmarkedItems();
              setShowModal(!showModal);
            },
          },
        ]}
      >
        <Text variant="body1">
          {t('Are you sure you want to remove all saved content from your list?')}
        </Text>
      </Modal>
    </Card>
  );
};

export default ListsPage;
