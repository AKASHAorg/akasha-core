import React from 'react';
import { useTranslation } from 'react-i18next';
import DS from '@akashaproject/design-system';
import { ILocale } from '@akashaproject/design-system/lib/utils/time';

import ContentCard from './content-card';
import ContentTab from './content-tab';

import { getAllPending, getAllModerated } from '../services/fetch-contents';
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
  count: number;
  entryDate: string;
}

interface IPendingItem extends IBaseItem {
  reporter: string;
  reporterName: string;
  reporterENSName: string;
}

interface IModeratedItem extends IPendingItem {
  delisted: boolean;
  moderator: string;
  moderatorName: string;
  moderatorENSName: string;
  evaluationDate: string;
}

const ContentList: React.FC<IContentListProps> = props => {
  const { slotId, ethAddress, logger, sdkModules } = props;

  const [pendingItems, setPendingItems] = React.useState<IPendingItem[]>([]);
  const [moderatedItems, setModeratedItems] = React.useState<IModeratedItem[]>([]);
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [contentType, setContentType] = React.useState<string>('post');
  const [flagged, setFlagged] = React.useState<string>('');
  const [isPending, setIsPending] = React.useState<boolean>(true);
  const [isDelisted, setIsDelisted] = React.useState<boolean>(true);
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
      fetchModeratedContents();
    }
  }, [ethAddress]);

  React.useEffect(() => {
    // checks for new content if pending tab is active
    if (isPending) {
      fetchPendingContents();
    }
  }, [isPending]);

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

  const fetchModeratedContents = async () => {
    // fetch delisted (moderated) contents
    setRequesting(true);
    try {
      const modResponse = await getAllModerated();
      setModeratedItems(modResponse);
      setRequesting(false);
    } catch (error) {
      setRequesting(false);
      logger.error('[content-list.tsx]: fetchModeratedContents err %j', error.message || '');
    }
  };

  const handleButtonClick = (entryId: string, content: string) => {
    setFlagged(entryId);
    setModalOpen(true);
    setContentType(content);
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
              titleLabel={t('Make a Decision')}
              contentType={t(contentType)}
              decisionLabel={t('Decision')}
              optionLabels={[t('Delist'), t('Keep')]}
              descriptionLabel={t('Evaluation')}
              descriptionPlaceholder={t('Please explain the reason(s)')}
              footerText1Label={t('If you are unsure, you can refer to our')}
              footerLink1Label={t('Code of Conduct')}
              footerUrl1={'https://akasha.slab.com/public/ethereum-world-code-of-conduct-e7ejzqoo'}
              footerText2Label={t('and')}
              footerLink2Label={t('Terms of Service')}
              footerUrl2={'https://ethereum.world/terms-of-service'}
              cancelLabel={t('Cancel')}
              user={ethAddress}
              contentId={flagged}
              size={size}
              onModalClose={() => {
                setModalOpen(false);
                // on modal close, fetch pending and delisted items again
                fetchPendingContents();
                fetchModeratedContents();
              }}
              closeModal={() => {
                setModalOpen(false);
              }}
            />
          </ToastProvider>
        )}
      </ModalRenderer>
      <ContentTab
        isPending={isPending}
        isDelisted={isDelisted}
        pendingLabel={t('Pending')}
        moderatedLabel={t('Moderated')}
        count={moderatedItems.length}
        countLabel={t('Moderated items')}
        keptLabel={t('Kept')}
        delistedLabel={t('Delisted')}
        setIsPending={setIsPending}
        setIsDelisted={setIsDelisted}
      />
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
                makeADecisionLabel={t('Make a Decision')}
                logger={logger}
                sdkModules={sdkModules}
                handleButtonClick={handleButtonClick}
              />
            ))
          : renderNotFound('pending'))}
      {!requesting &&
        !isPending &&
        (moderatedItems.length
          ? moderatedItems
              .filter(item => item.delisted === isDelisted)
              .map(moderatedItem => (
                <ContentCard
                  key={moderatedItem.id}
                  isPending={isPending}
                  locale={locale}
                  showExplanationsLabel={t('Show explanations')}
                  hideExplanationsLabel={t('Hide explanations')}
                  determinationLabel={t('Determination')}
                  determination={moderatedItem.delisted ? t('Delisted') : t('Kept')}
                  reportedLabel={t('reported')}
                  contentType={t(moderatedItem.type)}
                  forLabel={t('for')}
                  reportedByLabel={t('Reported by')}
                  originallyReportedByLabel={t('Initially reported by')}
                  entryId={t(moderatedItem.entryId)}
                  reasons={moderatedItem.reasons.map(el => t(el))}
                  reporter={moderatedItem.reporter}
                  reporterName={t(moderatedItem.reporterName)}
                  reporterENSName={t(moderatedItem.reporterENSName)}
                  andLabel={t('and')}
                  otherReporters={
                    moderatedItem.count
                      ? t(
                          `${moderatedItem.count} ${
                            moderatedItem.count === 1 ? 'other' : 'others'
                          }`,
                        )
                      : ''
                  }
                  reportedOnLabel={t('On')}
                  reportedDateTime={moderatedItem.entryDate}
                  moderatorDecision={moderatedItem.description}
                  moderator={moderatedItem.moderator}
                  moderatorName={t(moderatedItem.moderatorName)}
                  moderatorENSName={t(moderatedItem.moderatorENSName)}
                  moderatedByLabel={t('Moderated by')}
                  moderatedOnLabel={t('On')}
                  evaluationDateTime={moderatedItem.evaluationDate}
                  reviewDecisionLabel={t('Review decision')}
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
