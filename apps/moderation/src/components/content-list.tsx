import React from 'react';
import { useTranslation } from 'react-i18next';
import DS from '@akashaproject/design-system';
import { ILocale } from '@akashaproject/design-system/lib/utils/time';

import ContentCard from './content-card';
import ContentTab from './content-tab';

import { getAllPending, getAllDelisted } from '../services/fetch-contents';
import { moderatorList } from '../services/dummy-data';

const { Box, Text, useViewportSize, ModalRenderer, ToastProvider, ModerateModal } = DS;

interface IContentListProps {
  slotId: string;
  ethAddress: string | null;
  logger: any;
  sdkModules: any;
  navigateToUrl: (path: string) => void;
}

interface IBaseItem {
  id: number;
  type: string;
  entryId: string;
  reasons: string[];
  description?: string;
  entryDate: string;
}

interface IPendingItem extends IBaseItem {
  reporter: string;
  reporterName: string;
  reporterENSName: string;
  count: number;
}

interface IDelistedItem extends Omit<IPendingItem, 'count'> {
  moderator: string;
  moderatorName: string;
  moderatorENSName: string;
  evaluationDate: string;
}

const ContentList: React.FC<IContentListProps> = props => {
  const { slotId, ethAddress, logger, sdkModules } = props;

  const [pendingItems, setPendingItems] = React.useState<IPendingItem[]>([]);
  const [delistedItems, setDelistedItems] = React.useState<IDelistedItem[]>([]);
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [actionType, setActionType] = React.useState<string>('Delist');
  const [contentType, setContentType] = React.useState<string>('post');
  const [flagged, setFlagged] = React.useState<string>('');
  const [flaggedItemData, setFlaggedItemData] = React.useState<any>({});
  const [isPending, setIsPending] = React.useState<boolean>(true);
  const [requesting, setRequesting] = React.useState<boolean>(false);

  const { t, i18n } = useTranslation();
  const locale = (i18n.languages[0] || 'en') as ILocale;
  const { size } = useViewportSize();

  React.useEffect(() => {
    // if not authenticated, prompt to authenticate
    if (!ethAddress) {
      props.navigateToUrl('/moderation-app/unauthenticated');
    } else if (!moderatorList.includes(ethAddress)) {
      // if not an approved moderator address(es) on file, restrict access
      props.navigateToUrl('/moderation-app/restricted');
    } else {
      fetchPendingContents();
      fetchDelistedContents();
    }
  }, [ethAddress]);

  const fetchPendingContents = async () => {
    // fetch pending (reported) contents
    setRequesting(true);
    try {
      const modResponse = await getAllPending();
      setPendingItems(modResponse);
      setRequesting(false);
    } catch (error) {
      setRequesting(false);
      logger.error('[content-list.tsx]: fetchPendingContents err %j', error.message || '');
    }
  };

  const fetchDelistedContents = async () => {
    // fetch delisted (moderated) contents
    setRequesting(true);
    try {
      const modResponse = await getAllDelisted();
      setDelistedItems(modResponse);
      setRequesting(false);
    } catch (error) {
      setRequesting(false);
      logger.error('[content-list.tsx]: fetchDelistedContents err %j', error.message || '');
    }
  };

  const handleButtonClick = (entryId: string, action: string, content: string, item: any) => {
    setFlagged(entryId);
    setModalOpen(true);
    setActionType(action);
    setContentType(content);
    setFlaggedItemData(item);
  };

  const renderNotFound = (type: string) => {
    return <Text textAlign="center">No {type} items found. Please check again later</Text>;
  };

  return (
    <Box>
      <ModalRenderer slotId={slotId}>
        {modalOpen && (
          <ToastProvider autoDismiss={true} autoDismissTimeout={5000}>
            <ModerateModal
              titleLabel={t(
                `${
                  contentType === 'profile' && actionType === 'Delist' ? 'Remove' : actionType
                } a ${contentType}`,
              )}
              contentType={t(contentType)}
              flaggedItemData={flaggedItemData}
              repostsLabel={t('Repost')}
              repliesLabel={t('Replies')}
              locale={locale}
              descriptionLabel={t('Evaluation')}
              descriptionPlaceholder={
                actionType === 'Delist'
                  ? t('Please describe the issue')
                  : t('Please explain the reason(s)')
              }
              footerText1Label={t('If you are unsure, you can refer to our')}
              footerLink1Label={t('Code of Conduct')}
              footerUrl1={'https://akasha.slab.com/public/ethereum-world-code-of-conduct-e7ejzqoo'}
              footerText2Label={t('and')}
              footerLink2Label={t('Terms of Service')}
              footerUrl2={'https://ethereum.world/terms-of-service'}
              cancelLabel={t('Cancel')}
              reportLabel={t(actionType)}
              user={ethAddress}
              contentId={flagged}
              size={size}
              onModalClose={() => {
                setModalOpen(false);
                // on modal close, fetch pending and delisted items again
                fetchPendingContents();
                fetchDelistedContents();
              }}
              closeModal={() => {
                setModalOpen(false);
              }}
            />
          </ToastProvider>
        )}
      </ModalRenderer>
      <ContentTab isPending={isPending} setIsPending={setIsPending} />
      {requesting && <Text textAlign="center">Fetching items. Please wait...</Text>}
      {!requesting &&
        isPending &&
        (pendingItems.length
          ? pendingItems.map((pendingItem: IPendingItem) => (
              <ContentCard
                key={pendingItem.id}
                isPending={isPending}
                locale={locale}
                showExplanationsLabel={t('Show explanations')}
                hideExplanationsLabel={t('Hide explanations')}
                reportedLabel={t('reported')}
                contentType={t(pendingItem.type)}
                forLabel={t('for')}
                reportedByLabel={t('Reported by')}
                originallyReportedByLabel={t('Initially reported by')}
                entryId={t(pendingItem.entryId)}
                reasons={pendingItem.reasons.map((el: string) => t(el))}
                reporter={t(pendingItem.reporter)}
                reporterName={t(pendingItem.reporterName)}
                reporterENSName={t(pendingItem.reporterENSName)}
                andLabel={t('and')}
                otherReporters={
                  pendingItem.count
                    ? t(`${pendingItem.count} ${pendingItem.count === 1 ? 'other' : 'others'}`)
                    : ''
                }
                reportedOnLabel={t('On')}
                reportedDateTime={pendingItem.entryDate}
                keepContentLabel={
                  pendingItem.type === 'post'
                    ? t('Keep Post')
                    : pendingItem.type === 'profile'
                    ? t('Keep User')
                    : ''
                }
                delistContentLabel={
                  pendingItem.type === 'post'
                    ? t('Delist Post')
                    : pendingItem.type === 'profile'
                    ? t('Remove User')
                    : ''
                }
                logger={logger}
                sdkModules={sdkModules}
                handleButtonClick={handleButtonClick}
              />
            ))
          : renderNotFound('pending'))}
      {!requesting &&
        !isPending &&
        (delistedItems.length
          ? delistedItems.map(delistedItem => (
              <ContentCard
                key={delistedItem.id}
                isPending={isPending}
                locale={locale}
                showExplanationsLabel={t('Show explanations')}
                hideExplanationsLabel={t('Hide explanations')}
                determinationLabel={t('Final determination')}
                reportedLabel={t('reported')}
                contentType={t(delistedItem.type)}
                forLabel={t('for')}
                reportedByLabel={t('Reported by')}
                originallyReportedByLabel={t('Originally reported by')}
                entryId={t(delistedItem.entryId)}
                reasons={delistedItem.reasons.map(el => t(el))}
                reporter={delistedItem.reporter}
                reporterName={t(delistedItem.reporterName)}
                reporterENSName={t(delistedItem.reporterENSName)}
                reportedOnLabel={t('on')}
                reportedDateTime={delistedItem.entryDate}
                moderator={delistedItem.moderator}
                moderatorName={t(delistedItem.moderatorName)}
                moderatorENSName={t(delistedItem.moderatorENSName)}
                moderatedByLabel={t('Moderated by')}
                moderatedOnLabel={t('On')}
                evaluationDateTime={delistedItem.evaluationDate}
                logger={logger}
                sdkModules={sdkModules}
                handleButtonClick={() => null}
              />
            ))
          : renderNotFound('delisted'))}
    </Box>
  );
};

export default ContentList;
