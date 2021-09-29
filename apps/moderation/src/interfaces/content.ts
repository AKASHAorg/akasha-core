import singleSpa from 'single-spa';
import { ILogger } from '@akashaproject/awf-sdk/typings/lib/interfaces/log';
import { IEntryData } from '@akashaproject/ui-awf-typings/lib/entry';
import { IProfileData } from '@akashaproject/ui-awf-typings/lib/profile';
import { ILocale } from '@akashaproject/design-system/lib/utils/time';

export interface IContentProps {
  user?: string;
  isPending: boolean;
  locale: ILocale;
  entryData: IEntryData | IProfileData;

  showExplanationsLabel: string;
  hideExplanationsLabel: string;
  determinationLabel?: string;
  determination?: string;
  reportedLabel: string;
  itemType: string;
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
  logger: ILogger;
  singleSpa: typeof singleSpa;
  handleButtonClick: (param1: string, param2: string) => void;
}
