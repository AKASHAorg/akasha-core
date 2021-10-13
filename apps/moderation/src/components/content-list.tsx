import React from 'react';
import SingleSpa from 'single-spa';
import { useTranslation } from 'react-i18next';

import DS from '@akashaproject/design-system';
import { ILocale } from '@akashaproject/design-system/lib/utils/time';
import { ButtonValues, RootComponentProps } from '@akashaproject/ui-awf-typings';
import {
  useGetCount,
  useInfiniteKept,
  useCheckModerator,
  useInfinitePending,
  useInfiniteDelisted,
} from '@akashaproject/ui-awf-hooks/lib/use-moderation';
import { IModeratedItem, IPendingItem } from '@akashaproject/ui-awf-hooks/lib/moderation-requests';

import ContentTab from './content-tab';
import ContentCard from './content-card/content-card';
import NoItemsFound from './no-items-found';
import PromptAuthorization from './prompt-authorization';

const { Box, Spinner, SwitchCard, useIntersectionObserver } = DS;

interface IContentListProps {
  slotId: string;
  user: string | null;
  singleSpa: typeof SingleSpa;
}

const DEFAULT_LIMIT = 10;

const ContentList: React.FC<IContentListProps & RootComponentProps> = props => {
  const { user } = props;

  const [isPending, setIsPending] = React.useState<boolean>(true);
  const [isDelisted, setIsDelisted] = React.useState<boolean>(true);

  const { t, i18n } = useTranslation();
  const locale = (i18n.languages[0] || 'en') as ILocale;

  const getCountQuery = useGetCount();
  const count = getCountQuery.data;

  const checkModeratorQuery = useCheckModerator(user);
  const checkModeratorResp = checkModeratorQuery.data;
  const isAuthorised = React.useMemo(() => {
    if (checkModeratorResp === 200) {
      return true;
    } else return false;
  }, [checkModeratorResp]);

  const pendingItemsQuery = useInfinitePending(DEFAULT_LIMIT);
  const pendingItemPages = React.useMemo(() => {
    if (pendingItemsQuery.data) {
      return pendingItemsQuery.data.pages;
    }
    return [];
  }, [pendingItemsQuery.data]);

  const keptItemsQuery = useInfiniteKept(DEFAULT_LIMIT);
  const keptItemPages = React.useMemo(() => {
    if (keptItemsQuery.data) {
      return keptItemsQuery.data.pages;
    }
    return [];
  }, [keptItemsQuery.data]);

  const delistedItemsQuery = useInfiniteDelisted(DEFAULT_LIMIT);
  const delistedItemPages = React.useMemo(() => {
    if (delistedItemsQuery.data) {
      return delistedItemsQuery.data.pages;
    }
    return [];
  }, [delistedItemsQuery.data]);

  React.useEffect(() => {
    if (!user) {
      // if not authenticated, prompt to authenticate
      props.singleSpa.navigateToUrl('/moderation-app/unauthenticated');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleLoadMorePending = React.useCallback(() => {
    if (!pendingItemsQuery.isLoading && pendingItemsQuery.hasNextPage) {
      pendingItemsQuery.fetchNextPage();
    }
  }, [pendingItemsQuery]);

  const handleLoadMoreKept = React.useCallback(() => {
    if (!keptItemsQuery.isLoading && keptItemsQuery.hasNextPage) {
      keptItemsQuery.fetchNextPage();
    }
  }, [keptItemsQuery]);

  const handleLoadMoreDelisted = React.useCallback(() => {
    if (!delistedItemsQuery.isLoading && delistedItemsQuery.hasNextPage) {
      delistedItemsQuery.fetchNextPage();
    }
  }, [delistedItemsQuery]);

  // loadmore refs
  const loadmorePendingRef = React.createRef<HTMLDivElement>();
  const loadmoreKeptRef = React.createRef<HTMLDivElement>();
  const loadmoreDelistedRef = React.createRef<HTMLDivElement>();

  // intersection observers
  useIntersectionObserver({
    target: loadmorePendingRef,
    onIntersect: handleLoadMorePending,
    threshold: 0,
  });

  useIntersectionObserver({
    target: loadmoreKeptRef,
    onIntersect: handleLoadMoreKept,
    threshold: 0,
  });

  useIntersectionObserver({
    target: loadmoreDelistedRef,
    onIntersect: handleLoadMoreDelisted,
    threshold: 0,
  });

  const handleButtonClick = (entryId: string, itemType: string) => {
    props.navigateToModal({
      name: 'moderate-modal',
      status: isPending ? 'pending' : 'moderated',
      entryId,
      itemType,
    });
  };

  const buttonValues = [ButtonValues.KEPT, ButtonValues.DELISTED];

  const buttonLabels = buttonValues.map(value => t(value));

  const onTabClick = (value: string) => {
    // toggle list accordingly
    if (value === ButtonValues.KEPT) {
      setIsDelisted(false);
    } else if (value === ButtonValues.DELISTED) {
      setIsDelisted(true);
    }
  };

  const showDelistedItems = React.useMemo(() => {
    if (!delistedItemsQuery.isLoading && isDelisted && delistedItemPages.length) {
      return true;
    }
    return false;
  }, [isDelisted, delistedItemPages.length, delistedItemsQuery.isLoading]);

  const showKeptItems = React.useMemo(() => {
    if (!keptItemsQuery.isLoading && !isDelisted && keptItemPages.length) {
      return true;
    }
    return false;
  }, [isDelisted, keptItemPages.length, keptItemsQuery.isLoading]);

  if (!isAuthorised) {
    return (
      <PromptAuthorization
        titleLabel={t('You must be an Ethereum World Moderator to access this page')}
        subtitleLabel={t(
          'The wallet you connected does not match a moderator account in our system. Please try again with the correct wallet.',
        )}
      />
    );
  }

  return (
    <Box>
      <ContentTab
        isPending={isPending}
        pendingLabel={t('Pending')}
        moderatedLabel={t('Moderated')}
        countKept={count.kept}
        countPending={count.pending}
        countDelisted={count.delisted}
        setIsPending={setIsPending}
      />
      {!isPending && (
        <SwitchCard
          count={isDelisted ? count.delisted : count.kept}
          activeButton={isDelisted ? ButtonValues.DELISTED : ButtonValues.KEPT}
          countLabel={!isDelisted ? buttonLabels[0] : buttonLabels[1]}
          buttonLabels={buttonLabels}
          buttonValues={buttonValues}
          onTabClick={onTabClick}
          buttonsWrapperWidth={'40%'}
          loggedUser={user}
        />
      )}
      {!pendingItemsQuery.isLoading &&
        isPending &&
        (pendingItemPages.length ? (
          <>
            {pendingItemPages.map((page, index) => (
              <Box key={index} flex={false}>
                {page.results.map((pendingItem: IPendingItem, index: number) => (
                  <ContentCard
                    {...props}
                    key={index}
                    isPending={isPending}
                    locale={locale}
                    showExplanationsLabel={t('Show explanations')}
                    hideExplanationsLabel={t('Hide explanations')}
                    reportedLabel={t('reported')}
                    itemType={pendingItem.contentType}
                    forLabel={t('for')}
                    reportedByLabel={t('Reported by')}
                    originallyReportedByLabel={t('Initially reported by')}
                    entryId={pendingItem.contentID}
                    reasons={pendingItem.reasons.map((el: string) => t(el))}
                    reporter={pendingItem.reportedBy}
                    reporterAvatar={pendingItem.reportedByProfile?.avatar}
                    reporterName={pendingItem.reportedByProfile?.name}
                    reporterENSName={pendingItem.reportedByProfile?.userName}
                    andLabel={t('and')}
                    otherReporters={
                      pendingItem.count
                        ? `${pendingItem.count} ${
                            pendingItem.count === 1 ? `${t('other')}` : `${t('others')}`
                          }`
                        : ''
                    }
                    reportedOnLabel={t('On')}
                    reportedDateTime={pendingItem.reportedDate}
                    makeADecisionLabel={t('Make a Decision')}
                    handleButtonClick={handleButtonClick}
                  />
                ))}
              </Box>
            ))}
            {/* triggers intersection observer */}
            <Box pad="xxsmall" ref={loadmorePendingRef} />
          </>
        ) : (
          <NoItemsFound activeTab={'pending'} />
        ))}
      {/* fetch indicator for load more on scroll */}
      {pendingItemsQuery.isLoading && isPending && (
        <Box pad="large">
          <Spinner />
        </Box>
      )}
      {!isPending &&
        (showDelistedItems ? (
          <>
            {delistedItemPages.map((page, index) => (
              <Box key={index} flex={false}>
                {page.results.map((moderatedItem: IModeratedItem, index: number) => (
                  <ContentCard
                    {...props}
                    key={index}
                    isPending={isPending}
                    locale={locale}
                    showExplanationsLabel={t('Show explanations')}
                    hideExplanationsLabel={t('Hide explanations')}
                    determinationLabel={t('Determination')}
                    determination={moderatedItem.delisted ? t('Delisted') : t('Kept')}
                    reportedLabel={t('reported')}
                    itemType={moderatedItem.contentType}
                    forLabel={t('for')}
                    reportedByLabel={t('Reported by')}
                    originallyReportedByLabel={t('Initially reported by')}
                    entryId={moderatedItem.contentID}
                    reasons={moderatedItem.reasons.map(el => t(el))}
                    reporter={moderatedItem.reportedBy}
                    reporterAvatar={moderatedItem.reportedByProfile?.avatar}
                    reporterName={moderatedItem.reportedByProfile?.name}
                    reporterENSName={moderatedItem.reportedByProfile?.userName}
                    andLabel={t('and')}
                    otherReporters={
                      moderatedItem.count
                        ? `${moderatedItem.count} ${
                            moderatedItem.count === 1 ? `${t('other')}` : `${t('others')}`
                          }`
                        : ''
                    }
                    reportedOnLabel={t('On')}
                    reportedDateTime={moderatedItem.reportedDate}
                    moderatorDecision={moderatedItem.explanation}
                    moderator={moderatedItem.moderator}
                    moderatorName={moderatedItem.moderatorProfile.name}
                    moderatorENSName={moderatedItem.moderatorProfile.userName}
                    moderatedByLabel={t('Moderated by')}
                    moderatedOnLabel={t('On')}
                    evaluationDateTime={moderatedItem.moderatedDate}
                    reviewDecisionLabel={t('Review decision')}
                    handleButtonClick={handleButtonClick}
                  />
                ))}
              </Box>
            ))}
            {/* triggers intersection observer */}
            <Box pad="xxsmall" ref={loadmoreDelistedRef} />
          </>
        ) : showKeptItems ? (
          <>
            {keptItemPages.map((page, index) => (
              <Box key={index} flex={false}>
                {page.results.map((moderatedItem: IModeratedItem, index: number) => (
                  <ContentCard
                    {...props}
                    key={index}
                    isPending={isPending}
                    locale={locale}
                    showExplanationsLabel={t('Show explanations')}
                    hideExplanationsLabel={t('Hide explanations')}
                    determinationLabel={t('Determination')}
                    determination={moderatedItem.delisted ? t('Delisted') : t('Kept')}
                    reportedLabel={t('reported')}
                    itemType={moderatedItem.contentType}
                    forLabel={t('for')}
                    reportedByLabel={t('Reported by')}
                    originallyReportedByLabel={t('Initially reported by')}
                    entryId={moderatedItem.contentID}
                    reasons={moderatedItem.reasons.map(el => t(el))}
                    reporter={moderatedItem.reportedBy}
                    reporterAvatar={moderatedItem.reportedByProfile?.avatar}
                    reporterName={moderatedItem.reportedByProfile?.name}
                    reporterENSName={moderatedItem.reportedByProfile?.userName}
                    andLabel={t('and')}
                    otherReporters={
                      moderatedItem.count
                        ? `${moderatedItem.count} ${
                            moderatedItem.count === 1 ? `${t('other')}` : `${t('others')}`
                          }`
                        : ''
                    }
                    reportedOnLabel={t('On')}
                    reportedDateTime={moderatedItem.reportedDate}
                    moderatorDecision={moderatedItem.explanation}
                    moderator={moderatedItem.moderator}
                    moderatorName={moderatedItem.moderatorProfile.name}
                    moderatorENSName={moderatedItem.moderatorProfile.userName}
                    moderatedByLabel={t('Moderated by')}
                    moderatedOnLabel={t('On')}
                    evaluationDateTime={moderatedItem.moderatedDate}
                    reviewDecisionLabel={t('Review decision')}
                    handleButtonClick={handleButtonClick}
                  />
                ))}
              </Box>
            ))}
            {/* triggers intersection observer */}
            <Box pad="xxsmall" ref={loadmoreKeptRef} />
          </>
        ) : (
          <NoItemsFound activeTab={'moderated'} />
        ))}
      {/* fetch indicator for load more on scroll */}
      {delistedItemsQuery.isLoading && !isPending && isDelisted && (
        <Box pad="large">
          <Spinner />
        </Box>
      )}
      {/* fetch indicator for load more on scroll */}
      {keptItemsQuery.isLoading && !isPending && !isDelisted && (
        <Box pad="large">
          <Spinner />
        </Box>
      )}
    </Box>
  );
};

export default ContentList;
