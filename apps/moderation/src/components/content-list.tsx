import React from 'react';
import { useTranslation } from 'react-i18next';
import DS from '@akashaproject/design-system';

import ContentCard from './content-card';
import postRequest from '../services/post-request';
import { ILocale } from '@akashaproject/design-system/lib/utils/time';

import { moderatorList, samplePostData, sampleProfileData } from '../services/dummy-data';
import ContentTab from './content-tab';

const { Box, Text, useViewportSize, ModalRenderer, ToastProvider, ModerateModal } = DS;

interface IContentListProps {
  slotId: string;
  ethAddress: string | null;
  logger: any;
  navigateToUrl: (path: string) => void;
}

interface IBaseItem {
  id: number;
  type: string;
  ethAddress: string;
  reasons: string[];
  description: string;
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
  const { slotId, ethAddress } = props;

  const [pendingItems, setPendingItems] = React.useState<IPendingItem[]>([]);
  const [delistedItems, setDelistedItems] = React.useState<IDelistedItem[]>([]);
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [actionType, setActionType] = React.useState<string>('Delist');
  const [contentType, setContentType] = React.useState<string>('post');
  const [flagged, setFlagged] = React.useState<string>('');
  const [preselectedReasons, setPreselectedReasons] = React.useState<string[]>([]);
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

  // @TODO: Get logged ethAddress from Store state

  const fetchDelistedContents = async () => {
    // fetch pending (reported) contents
    setRequesting(true);
    try {
      const response = await postRequest('https://akasha-mod.herokuapp.com/decisions/moderated', {
        delisted: true,
      });
      // @TODO: get content details using contentId
      const modResponse = response.map(
        (
          {
            contentType: type,
            contentId,
            date,
            explanation,
            moderator,
            reasons,
            reportedBy,
            reportedDate,
          }: any,
          idx: number,
        ) => {
          // formatting data to match labels already in use
          return {
            id: idx,
            type: type,
            ethAddress: contentId,
            reasons: reasons,
            description: explanation,
            reporter: reportedBy,
            moderator: moderator, // @TODO: fetch reporter's Name and ENS (if applicable) from the profile API
            entryDate: reportedDate,
            evaluationDate: date,
          };
        },
      );
      setDelistedItems(modResponse);
      setRequesting(false);
    } catch (error) {
      setRequesting(false);
      props.logger.error('[content-list.tsx]: fetchDelistedContent err %j', error.message || '');
    }
  };

  const fetchPendingContents = async () => {
    // fetch pending (reported) contents
    setRequesting(true);
    try {
      const response = await postRequest('https://akasha-mod.herokuapp.com/decisions/pending');
      // @TODO: get content details using contentId
      const modResponse = response.map(
        (
          { contentType: type, contentId, reasons, reportedBy, reportedDate, reports }: any,
          idx: number,
        ) => {
          // formatting data to match labels already in use
          return {
            id: idx,
            type: type,
            ethAddress: contentId,
            reasons: reasons,
            description: '',
            reporter: reportedBy, // @TODO: fetch reporter's Name and ENS Name (if applicable) from the profile API
            count: reports - 1, // minus reporter, to get count of other users
            entryDate: reportedDate,
          };
        },
      );
      setPendingItems(modResponse);
      setRequesting(false);
    } catch (error) {
      setRequesting(false);
      props.logger.error('[content-list.tsx]: fetchPendingContent err %j', error.message || '');
    }
  };

  const handleButtonClick = (
    entryId: string,
    action: string,
    content: string,
    reasons: string[],
    item: any,
  ) => {
    setFlagged(entryId);
    setModalOpen(true);
    setActionType(action);
    setContentType(content);
    setPreselectedReasons(reasons);
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
              optionsTitleLabel={t('Please select a reason')}
              optionLabels={[
                t('Suspicious, deceptive, or spam'),
                t('Abusive or harmful to others'),
                t('Self-harm or suicide'),
                t('Illegal'),
                t('Nudity'),
                t('Violence'),
              ]}
              preselectedReasons={preselectedReasons}
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
                entryData={pendingItem.type === 'post' ? samplePostData : sampleProfileData}
                repostsLabel={t('Repost')}
                repliesLabel={t('Replies')}
                locale={locale}
                reportedLabel={t('Reported')}
                contentType={t(pendingItem.type)}
                forLabel={t('for')}
                additionalDescLabel={t('Additional description provided by user')}
                additionalDescContent={t(pendingItem.description)}
                reportedByLabel={t('Reported by')}
                ethAddress={t(pendingItem.ethAddress)}
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
                entryData={delistedItem.type === 'post' ? samplePostData : sampleProfileData}
                repostsLabel={t('Repost')}
                repliesLabel={t('Replies')}
                locale={locale}
                determinationLabel={t('Final determination')}
                reportedLabel={t('Reported')}
                contentType={t(delistedItem.type)}
                forLabel={t('for')}
                additionalDescLabel={t("Moderator's evaluation")}
                additionalDescContent={t(delistedItem.description)}
                reportedByLabel={t('Originally reported by')}
                ethAddress={t(delistedItem.ethAddress)}
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
                handleButtonClick={() => null}
              />
            ))
          : renderNotFound('delisted'))}
    </Box>
  );
};

export default ContentList;
