import singleSpa from 'single-spa';
import { RootComponentProps, IEntryData, IProfileData } from '@akashaorg/typings/ui';
import { ILocale } from '@akashaorg/design-system/lib/utils/time';
import { ILogger } from '@akashaorg/typings/sdk/log';

export interface IContentProps extends RootComponentProps {
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
  reporterAvatar?: string | null;
  reporterName?: string | null;
  reporterENSName?: string | null;
  otherReporters?: string;
  reportedOnLabel?: string;
  reportedDateTime: Date;
  moderatorDecision?: string;
  moderator?: string;
  moderatorName?: string | null;
  moderatorENSName?: string | null;
  moderatedByLabel?: string;
  moderatedOnLabel?: string;
  evaluationDateTime?: Date;
  makeADecisionLabel?: string;
  reviewDecisionLabel?: string;
  logger: ILogger;
  singleSpa: typeof singleSpa;
  handleButtonClick: (param1: string, param2: string) => void;
}
