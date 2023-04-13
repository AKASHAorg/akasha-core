import React from 'react';
import { useTranslation } from 'react-i18next';

import DS from '@akashaorg/design-system';
import { ILocale } from '@akashaorg/design-system/src/utils/time';
import {
  ButtonValues,
  EntityTypes,
  IModeratedItem,
  IPendingItem,
  RootComponentProps,
} from '@akashaorg/typings/ui';
import {
  useGetCount,
  useInfiniteKept,
  useInfinitePending,
  useInfiniteDelisted,
} from '@akashaorg/ui-awf-hooks';

import GuestDashboard from '../components/guest';
import ContentTab from '../components/content-tab';
import ContentCard from '../components/content-card';
import { NoItemsFound } from '../components/error-cards';

const {
  Box,
  ModerationIntroCard,
  Spinner,
  TabsToolbar,
  StyledSwitchCardButton,
  useIntersectionObserver,
} = DS;

export interface IDashboardProps extends RootComponentProps {
  slotId?: string;
  user: string | null;
  isAuthorised: boolean;
  handleCTAClick?: () => void;
}

const DEFAULT_LIMIT = 10;

export const Dashboard: React.FC<IDashboardProps> = props => {
  const { user, isAuthorised, plugins } = props;

  // const [activeButton, setActiveButton] = React.useState<string>(ButtonValues.ALL);
  const [isPending, setIsPending] = React.useState<boolean>(true);
  const [isDelisted, setIsDelisted] = React.useState<boolean>(true);

  const { t } = useTranslation('app-moderation-ewa');
  const locale = (props.plugins['@akashaorg/app-translation']?.translation?.i18n?.languages?.[0] ||
    'en') as ILocale;

  const getCountQuery = useGetCount();
  const count = getCountQuery.data;

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

  const handleButtonClick = (itemId: string, itemType: EntityTypes) => {
    props.navigateToModal({
      name: 'moderate-modal',
      status: isPending ? 'pending' : 'moderated',
      itemId,
      itemType,
    });
  };

  const buttonValues = [
    {
      value: ButtonValues.KEPT,
      label: t('{{ buttonValueKept }} items', { buttonValueKept: ButtonValues.KEPT }),
    },
    {
      value: ButtonValues.DELISTED,
      label: t('{{ buttonValueDelisted }} items', { buttonValueDelisted: ButtonValues.DELISTED }),
    },
  ];

  const onTabClick = (value: string) => () => {
    // toggle list accordingly
    if (value === ButtonValues.KEPT) {
      setIsDelisted(false);
    } else if (value === ButtonValues.DELISTED) {
      setIsDelisted(true);
    }
  };

  const showDelistedItems = React.useMemo(() => {
    if (!delistedItemsQuery.isLoading && isDelisted && delistedItemPages[0].results.length) {
      return true;
    }
    return false;
  }, [isDelisted, delistedItemPages, delistedItemsQuery.isLoading]);

  const showKeptItems = React.useMemo(() => {
    if (!keptItemsQuery.isLoading && !isDelisted && keptItemPages[0].results.length) {
      return true;
    }
    return false;
  }, [isDelisted, keptItemPages, keptItemsQuery.isLoading]);

  if (!isAuthorised) {
    return <GuestDashboard plugins={plugins} />;
  }

  return (
    <Box gap="small">
      <ModerationIntroCard
        titleLabel="Moderating"
        subtitleLabel="Find all the moderated posts, replies and accounts"
        isIntro={false}
      />
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
        <TabsToolbar
          count={isDelisted ? count.delisted : count.kept}
          activeButton={isDelisted ? ButtonValues.DELISTED : ButtonValues.KEPT}
          countLabel={!isDelisted ? buttonValues[0].label : buttonValues[1].label}
          tabButtons={
            <>
              <StyledSwitchCardButton
                label={t('{{ buttonValuesKept }}', { buttonValuesKept: ButtonValues.KEPT })}
                size="large"
                removeBorder={false}
                primary={!isDelisted}
                onClick={onTabClick(ButtonValues.KEPT)}
              />
              <StyledSwitchCardButton
                label={t('{{ buttonValuesDelisted }}', {
                  buttonValuesDelisted: ButtonValues.DELISTED,
                })}
                size="large"
                removeBorder={true}
                primary={isDelisted}
                onClick={onTabClick(ButtonValues.DELISTED)}
              />
            </>
          }
          buttonValues={buttonValues}
          onTabClick={onTabClick}
          buttonsWrapperWidth={'40%'}
          loggedUser={user}
        />
      )}
      {!pendingItemsQuery.isLoading &&
        isPending &&
        (pendingItemPages[0].results.length ? (
          <>
            {pendingItemPages.map((page, index) => (
              <Box key={index} flex={false}>
                {page.results.map((pendingItem: IPendingItem, index: number) => (
                  <ContentCard
                    {...props}
                    key={index}
                    isPending={isPending}
                    locale={locale}
                    incidentLabel={t('Case ID')}
                    uniqueId={pendingItem.decisionID}
                    showExplanationsLabel={t('Show explanations')}
                    hideExplanationsLabel={t('Hide explanations')}
                    reportedLabel={t('reported')}
                    itemType={pendingItem.contentType}
                    forLabel={t('for')}
                    reportedByLabel={t('Reported by')}
                    originallyReportedByLabel={t('Initially reported by')}
                    itemId={pendingItem.contentID}
                    reasons={pendingItem.reasons.map((el: string) =>
                      t('{{ pendingItemReasons }}', { pendingItemReasons: el }),
                    )}
                    reporter={pendingItem.reportedBy}
                    reporterAvatar={pendingItem.reportedByProfile?.avatar}
                    reporterName={pendingItem.reportedByProfile?.name}
                    reporterENSName={pendingItem.reportedByProfile?.userName}
                    andLabel={t('and')}
                    otherReporters={
                      pendingItem.count
                        ? t('{{ pendingItemCount }} {{ itemCountWord }}', {
                            pendingItemCount: pendingItem.count,
                            itemCountWord: pendingItem.count === 1 ? 'other' : 'others',
                          })
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
          <NoItemsFound
            titleLabel={t('No pending items')}
            subtitleLabel={t('There are no pending items at the moment. Please check back later')}
          />
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
                    incidentLabel={t('Case ID')}
                    uniqueId={moderatedItem.decisionID}
                    showExplanationsLabel={t('Show explanations')}
                    hideExplanationsLabel={t('Hide explanations')}
                    determinationLabel={t('Determination')}
                    determination={moderatedItem.delisted ? t('Delisted') : t('Kept')}
                    reportedLabel={t('reported')}
                    itemType={moderatedItem.contentType}
                    forLabel={t('for')}
                    reportedByLabel={t('Reported by')}
                    originallyReportedByLabel={t('Initially reported by')}
                    itemId={moderatedItem.contentID}
                    reasons={moderatedItem.reasons.map(el =>
                      t('{{ moderatedItemReasons }}', { moderatedItemReasons: el }),
                    )}
                    reporter={moderatedItem.reportedBy}
                    reporterAvatar={moderatedItem.reportedByProfile?.avatar}
                    reporterName={moderatedItem.reportedByProfile?.name}
                    reporterENSName={moderatedItem.reportedByProfile?.userName}
                    andLabel={t('and')}
                    otherReporters={
                      moderatedItem.count
                        ? t('{{ moderatedItemCount }} {{ itemCountWord }}', {
                            moderatedItemCount: moderatedItem.count,
                            itemCountWord: moderatedItem.count === 1 ? 'other' : 'others',
                          })
                        : ''
                    }
                    reportedOnLabel={t('On')}
                    reportedDateTime={moderatedItem.reportedDate}
                    moderatorDecision={moderatedItem.explanation}
                    moderator={moderatedItem.moderator}
                    moderatorName={moderatedItem.moderatorProfile?.name}
                    moderatorENSName={moderatedItem.moderatorProfile?.userName}
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
                    incidentLabel={t('Case ID')}
                    uniqueId={moderatedItem.decisionID}
                    showExplanationsLabel={t('Show explanations')}
                    hideExplanationsLabel={t('Hide explanations')}
                    determinationLabel={t('Determination')}
                    determination={moderatedItem.delisted ? t('Delisted') : t('Kept')}
                    reportedLabel={t('reported')}
                    itemType={moderatedItem.contentType}
                    forLabel={t('for')}
                    reportedByLabel={t('Reported by')}
                    originallyReportedByLabel={t('Initially reported by')}
                    itemId={moderatedItem.contentID}
                    reasons={moderatedItem.reasons.map(el =>
                      t('{{ moderatedItemReasons }}', { moderatedItemReasons: el }),
                    )}
                    reporter={moderatedItem.reportedBy}
                    reporterAvatar={moderatedItem.reportedByProfile?.avatar}
                    reporterName={moderatedItem.reportedByProfile?.name}
                    reporterENSName={moderatedItem.reportedByProfile?.userName}
                    andLabel={t('and')}
                    otherReporters={
                      moderatedItem.count
                        ? t('{{ moderatedItemCount }} {{ itemCountWord }}', {
                            moderatedItemCount: moderatedItem.count,
                            itemCountWord: moderatedItem.count === 1 ? 'other' : 'others',
                          })
                        : ''
                    }
                    reportedOnLabel={t('On')}
                    reportedDateTime={moderatedItem.reportedDate}
                    moderatorDecision={moderatedItem.explanation}
                    moderator={moderatedItem.moderator}
                    moderatorName={moderatedItem.moderatorProfile?.name}
                    moderatorENSName={moderatedItem.moderatorProfile?.userName}
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
          <NoItemsFound
            titleLabel={t('No moderated items')}
            subtitleLabel={t('There are no moderated items at the moment. Please check back later')}
          />
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
