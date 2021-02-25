import React from 'react';
import { useTranslation } from 'react-i18next';
import DS from '@akashaproject/design-system';
import { ILocale } from '@akashaproject/design-system/lib/utils/time';
import { moderationRequest } from '@akashaproject/ui-awf-hooks';

import ContentCard from './content-card/content-card';
import ContentTab from './content-tab';

import { BASE_DECISION_URL } from '../services/constants';

const { Box, Text, useViewportSize, ModalRenderer, ToastProvider, ModerateModal } = DS;

interface IContentListProps {
  slotId: string;
  ethAddress: string | null;
  logger: any;
  singleSpa: any;
  sdkModules: any;
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
}

interface IModeratedItem extends IPendingItem {
  delisted: boolean;
  moderator: string;
  evaluationDate: string;
}

interface ICount {
  kept: number;
  pending: number;
  delisted: number;
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
  const [count, setCount] = React.useState<ICount>({ kept: 0, pending: 0, delisted: 0 });

  const { t, i18n } = useTranslation();
  const locale = (i18n.languages[0] || 'en') as ILocale;
  const {
    size,
    dimensions: { width },
  } = useViewportSize();

  React.useEffect(() => {
    if (!ethAddress) {
      // if not authenticated, prompt to authenticate
      props.singleSpa.navigateToUrl('/moderation-app/unauthenticated');
    } else {
      // if authenticated,
      if (isPending) {
        // if authorised, check for pending contents while pending tab is active
        fetchPendingContents();
      }
      if (!isPending) {
        // check for moderated contents while moderated tab is active
        fetchModeratedContents();
      }
    }
  }, [ethAddress, isPending]);

  const getStatusCount = async () => {
    setRequesting(true);
    try {
      const response = await moderationRequest.getCount();
      setCount(response);
    } catch (error) {
      logger.error('[content-list.tsx]: getStatusCount err %j', error.message || '');
    }
  };

  const fetchPendingContents = async () => {
    // fetch pending (reported) contents
    setRequesting(true);
    try {
      const modResponse = await moderationRequest.getAllPending();
      setPendingItems(modResponse);
      getStatusCount();
    } catch (error) {
      logger.error('[content-list.tsx]: fetchPendingContents err %j', error.message || '');
    } finally {
      setRequesting(false);
    }
  };

  const fetchModeratedContents = async () => {
    // fetch delisted (moderated) contents
    setRequesting(true);
    try {
      const modResponse = await moderationRequest.getAllModerated();
      setModeratedItems(modResponse);
      getStatusCount();
    } catch (error) {
      logger.error('[content-list.tsx]: fetchModeratedContents err %j', error.message || '');
    } finally {
      setRequesting(false);
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
              altTitleLabel={t('Review a Decision')}
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
              baseUrl={BASE_DECISION_URL}
              isReview={true}
              size={size}
              width={width}
              onModalClose={() => {
                setModalOpen(false);
                // on modal close, fetch moderated contents
                fetchModeratedContents();
              }}
              closeModal={() => {
                setModalOpen(false);
              }}
              signData={sdkModules.auth.authService.signData}
            />
          </ToastProvider>
        )}
      </ModalRenderer>
      <ContentTab
        isPending={isPending}
        isDelisted={isDelisted}
        pendingLabel={t('Pending')}
        moderatedLabel={t('Moderated')}
        countKept={count.kept}
        countPending={count.pending}
        countDelisted={count.delisted}
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
                {...props}
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
                andLabel={t('and')}
                otherReporters={
                  pendingItem.count
                    ? t(`${pendingItem.count} ${pendingItem.count === 1 ? 'other' : 'others'}`)
                    : ''
                }
                reportedOnLabel={t('On')}
                reportedDateTime={pendingItem.entryDate}
                makeADecisionLabel={t('Make a Decision')}
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
                  {...props}
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
                  moderatedByLabel={t('Moderated by')}
                  moderatedOnLabel={t('On')}
                  evaluationDateTime={moderatedItem.evaluationDate}
                  reviewDecisionLabel={t('Review decision')}
                  handleButtonClick={() => handleButtonClick}
                />
              ))
          : renderNotFound('moderated'))}
    </Box>
  );
};

export default ContentList;
