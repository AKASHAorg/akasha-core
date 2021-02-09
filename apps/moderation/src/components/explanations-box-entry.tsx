import React from 'react';
import DS from '@akashaproject/design-system';
import { useProfile } from '@akashaproject/ui-awf-hooks';

const { Text } = DS;

export interface IExplanationsBoxEntryProps {
  entry: any;
  reportedByLabel: string;
  forLabel: string;
  logger: any;
  sdkModules: any;
}

const ExplanationsCardEntry: React.FC<IExplanationsBoxEntryProps> = props => {
  const { entry, reportedByLabel, forLabel } = props;

  const [reporterProfileState, reporterProfileActions] = useProfile({
    onError: error => {
      props.logger.error('[explanations-box-entry.tsx]: useProfile err %j', error.error || '');
    },
    ipfsService: props.sdkModules.commons.ipfsService,
    profileService: props.sdkModules.profiles.profileService,
  });

  React.useEffect(() => {
    if (entry.user) {
      reporterProfileActions.getProfileData({ ethAddress: entry.user });
    }
  }, [entry]);

  return (
    <>
      <Text as="p" margin={{ top: 'none', bottom: 'xxsmall' }}>
        {reportedByLabel}
        <Text as="span" margin={{ left: '0.2rem' }} color="accentText">
          {reporterProfileState.name
            ? reporterProfileState.name
            : `${entry.user.slice(0, 6)}...${entry.user.slice(entry.user.length - 4)}`}
        </Text>
        <Text as="span" margin={{ left: '0.2rem' }}>
          {forLabel}
        </Text>
        <Text as="span" margin={{ left: '0.2rem' }}>
          {entry.reason}
        </Text>
      </Text>
      <Text as="p" margin={{ top: 'none', bottom: 'xsmall' }} color="secondaryText">
        {entry.explanation}
      </Text>
    </>
  );
};

export default ExplanationsCardEntry;
