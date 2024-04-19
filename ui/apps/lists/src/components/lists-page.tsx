import React from 'react';
import { useTranslation } from 'react-i18next';

import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import Modal from '@akashaorg/design-system-core/lib/components/Modal';
import Spinner from '@akashaorg/design-system-core/lib/components/Spinner';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import ListAppTopbar from '@akashaorg/design-system-components/lib/components/ListAppTopbar';
import DefaultEmptyCard from '@akashaorg/design-system-components/lib/components/DefaultEmptyCard';
import { useGetLogin } from '@akashaorg/ui-awf-hooks';

const ListsPage: React.FC<unknown> = () => {
  const [showModal, setShowModal] = React.useState(false);

  const { t } = useTranslation('app-lists');
  const { data } = useGetLogin();

  const bookmarkDelete = null;

  const isLoggedIn = !!data?.id;

  //temporary
  const listsReq = { isFetched: true, data: null, status: 'success', error: null };
  const lists = listsReq?.data || [];

  const bookmarkedBeamsIds = lists?.map((bm: Record<string, string>) => bm.itemId);

  const handleIconMenuClick = () => {
    setShowModal(!showModal);
  };

  const removeAllBookmarkedItems = () => {
    bookmarkedBeamsIds.forEach(itemId => bookmarkDelete.mutate(itemId));
  };

  return (
    <Card radius={16} padding="p-4">
      <ListAppTopbar
        titleLabel={t('Your List')}
        resetLabel={t('Reset')}
        removeAllLabel={t('Remove All')}
        dropDownMenuItems={[
          { id: '0', title: t('All Categories') },
          { id: '1', title: t('Beams') },
          { id: '2', title: t('Reflections') },
        ]}
        handleIconMenuClick={handleIconMenuClick}
      />
      {listsReq?.status === 'error' && (
        <ErrorLoader
          type="script-error"
          title={t('There was an error loading the lists')}
          details={listsReq?.error as string}
        />
      )}

      <Stack data-testid="lists" spacing="gap-8">
        {/* <StartCard
            title={t('Lists')}
            subtitle={getSubtitleText()}
            heading={t('✨ Save what inspires you ✨')}
            description={description}
            image={'/images/no-saved-posts-error.webp'}
            showMainArea={!isLoggedIn}
          /> */}

        {!listsReq?.isFetched && isLoggedIn && <Spinner />}
        {(!isLoggedIn || (listsReq?.isFetched && (!lists || !lists.length))) && (
          <DefaultEmptyCard
            infoText={t("You don't have any saved content in your List")}
            noBorder
            assetName="listsapp-empty-min"
          />
        )}
      </Stack>
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
