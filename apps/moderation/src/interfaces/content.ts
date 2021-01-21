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
  reporterName?: string;
  reporterENSName?: string;
  otherReporters?: string;
  reportedOnLabel?: string;
  reportedDateTime: string;
  moderatorDecision?: string;
  moderator?: string;
  moderatorName?: string;
  moderatorENSName?: string;
  moderatedByLabel?: string;
  moderatedOnLabel?: string;
  evaluationDateTime?: string;
  makeADecisionLabel?: string;
  reviewDecisionLabel?: string;
  logger: any;
  handleButtonClick: (param1: string, param2: string) => void;
}
