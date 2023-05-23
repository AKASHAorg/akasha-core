import singleSpa from 'single-spa';
import { RootComponentProps, IEntryData, EntityTypes } from '@akashaorg/typings/ui';
import { ILocale } from '@akashaorg/design-system/src/utils/time';
import { ILogger } from '@akashaorg/typings/sdk/log';
import { Profile } from '@akashaorg/typings/sdk/graphql-types-new';

export interface IContentProps extends RootComponentProps {
  user?: string;
  isPending: boolean;
  locale: ILocale;
  entryData: IEntryData | Profile;

  incidentLabel: string;
  uniqueId: string;
  showExplanationsLabel: string;
  hideExplanationsLabel: string;
  determinationLabel?: string;
  determination?: string;
  reportedLabel: string;
  itemType: EntityTypes;
  forLabel: string;
  andLabel?: string;
  reportedByLabel: string;
  originallyReportedByLabel: string;
  itemId: string;
  reasons: string[];
  reporter?: string;
  reporterAvatar?: Profile['avatar'];
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
  handleButtonClick: (param1: string, param2: string | number) => void;
}
