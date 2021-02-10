import { ILocale } from '@akashaproject/design-system/lib/utils/time';

export interface IContentProps {
  isPending: boolean;
  locale: ILocale;
  entryData: any;

  showExplanationsLabel: string;
  hideExplanationsLabel: string;
  determinationLabel?: string;
  determination?: string;
  reportedLabel: string;
  contentType: string;
  forLabel: string;
  andLabel?: string;
  reportedByLabel: string;
  originallyReportedByLabel: string;
  entryId: string;
  reasons: string[];
  reporter?: string;
  reporterAvatar?: string;
  reporterName?: string | null;
  reporterENSName?: string | null;
  otherReporters?: string;
  reportedOnLabel?: string;
  reportedDateTime: string;
  moderatorDecision?: string;
  moderator?: string;
  moderatorName?: string | null;
  moderatorENSName?: string | null;
  moderatedByLabel?: string;
  moderatedOnLabel?: string;
  evaluationDateTime?: string;
  makeADecisionLabel?: string;
  reviewDecisionLabel?: string;
  logger: any;
  sdkModules: any;
  handleButtonClick: (param1: string, param2: string) => void;
}
