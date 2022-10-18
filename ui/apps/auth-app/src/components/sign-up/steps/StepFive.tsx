import * as React from 'react';
import DS from '@akashaorg/design-system';
import {
  useAnalytics,
  useGetLogin,
  useProfileUpdate,
  useUsernameValidation,
} from '@akashaorg/ui-awf-hooks';
import { AnalyticsCategories, NavigateToParams } from '@akashaorg/typings/ui';
import { StyledButton, StyledBox } from './styles';
import { WELCOME } from '../../../routes';

const { Box, Text, styled, Icon, TextInputIconForm } = DS;

interface IStepFiveProps {
  textIdentifier: string;
  textUnchangeable: string;
  textEnsure: string;
  textCriterionLowercase: string;
  textCriterionEndsWithLetter: string;
  textCriterionCharCount: string;
  textUsername: string;
  textInputPlaceholder: string;
  textUsernameTakenError: string;
  textUsernameUnknownError: string;
  textUsernameAvailable: string;
  buttonLabel: string;
  navigateTo: (args: NavigateToParams) => void;
}

const StyledIcon = styled(Box)`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  max-width: 1.35rem;
  width: 1.35rem;
  height: 1.35rem;
  border-radius: 50%;
  margin-right: 0.2rem;
`;

const CONDITION_LOWERCASE = new RegExp('^[a-z0-9]*$');
const CONDITION_ENDS_WITH_LETTER = new RegExp('.*[a-zA-Z]$');
const CONDITION_CHAR_COUNT = new RegExp('^\\S{3,14}$');

interface ConditionsProps {
  conditions: {
    text: string;
    regex: RegExp;
  }[];
  username: string;
}

const Conditions = ({ conditions, username }: ConditionsProps) => (
  <>
    {conditions.map(({ text, regex }, index) => {
      const satisfiesCondition = regex.test(username);
      return (
        <Box key={index} direction="row" margin={{ bottom: 'xxxsmall' }} align="center">
          <StyledIcon>
            {!username.length && <>•</>}
            {!!username.length && satisfiesCondition && (
              <Icon type="checkSimple" size="xxs" color="green" />
            )}
            {!!username.length && !satisfiesCondition && (
              <Icon type="close" size="sm" color="red" style={{ marginLeft: '-0.1rem' }} />
            )}
          </StyledIcon>
          <Text size="large" weight={satisfiesCondition || !username.length ? 'normal' : 'bold'}>
            {text}
          </Text>
        </Box>
      );
    })}
  </>
);

const StepFive: React.FC<IStepFiveProps> = props => {
  const {
    textIdentifier,
    textUnchangeable,
    textEnsure,
    textCriterionLowercase,
    textCriterionEndsWithLetter,
    textCriterionCharCount,
    textUsername,
    textInputPlaceholder,
    textUsernameTakenError,
    textUsernameUnknownError,
    textUsernameAvailable,
    buttonLabel,
    navigateTo,
  } = props;
  const [username, setUsername] = React.useState('');
  const [usernameValidationTrigger, setUsernameValidationTrigger] = React.useState(false);
  const conditions = React.useMemo(
    () => [
      {
        text: textCriterionLowercase,
        regex: CONDITION_LOWERCASE,
      },
      {
        text: textCriterionEndsWithLetter,
        regex: CONDITION_ENDS_WITH_LETTER,
      },
      {
        text: textCriterionCharCount,
        regex: CONDITION_CHAR_COUNT,
      },
    ],
    [textCriterionLowercase, textCriterionEndsWithLetter, textCriterionCharCount],
  );

  const allowUsernameCheckRequest = React.useMemo(
    () => conditions.every(({ regex }) => regex.test(username)) && usernameValidationTrigger,
    [username, conditions, usernameValidationTrigger],
  );

  const loginQuery = useGetLogin();
  const [analyticsActions] = useAnalytics();
  const profileUpdateMutation = useProfileUpdate(loginQuery.data?.pubKey);
  const usernameValidationQuery = useUsernameValidation(username, allowUsernameCheckRequest);
  const userNameValidationError = React.useMemo(() => {
    if (usernameValidationQuery.isSuccess && !usernameValidationQuery.data) {
      return textUsernameTakenError;
    }
    if (usernameValidationQuery.isError) {
      return textUsernameUnknownError;
    }
  }, [usernameValidationQuery, textUsernameTakenError, textUsernameUnknownError]);

  React.useEffect(() => {
    if (usernameValidationQuery.isFetched) {
      setUsernameValidationTrigger(false);
    }
  }, [usernameValidationQuery.isFetched]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleBlur = () => {
    setUsernameValidationTrigger(true);
  };

  const finishSignUp = async () => {
    await profileUpdateMutation.mutateAsync({
      profileData: {
        pubKey: loginQuery.data?.pubKey,
        ethAddress: loginQuery.data?.ethAddress,
        userName: username,
      },
      changedFields: ['userName'],
    });
    analyticsActions.trackEvent({
      category: AnalyticsCategories.SIGN_UP,
      action: 'Username Setup',
    });
    navigateTo?.({
      appName: '@akashaorg/app-auth-ewa',
      getNavigationUrl: navRoutes => navRoutes[WELCOME],
    });
  };

  return (
    <>
      <Text margin={{ bottom: 'large' }}>
        <Text size="large">{textIdentifier}</Text>{' '}
        <Text size="large" weight="bold">
          {textUnchangeable}
        </Text>
      </Text>
      <Box>
        <Text size="large">
          {textEnsure}
          {': '}
        </Text>
        <Conditions conditions={conditions} username={username} />
      </Box>
      <Text color="gray" size="large" margin={{ top: 'large' }}>
        {textUsername}
      </Text>
      <TextInputIconForm
        inputPlaceholder={textInputPlaceholder}
        elevation="shadow"
        margin={{ left: '0rem', top: 'small' }}
        onChange={handleChange}
        onBlur={handleBlur}
        inputValue={username}
        hasError={!!userNameValidationError}
        errorMsg={userNameValidationError}
        submitting={usernameValidationQuery.isFetching}
        submitted={usernameValidationQuery.isFetched}
        success={usernameValidationQuery.isSuccess}
        inputInvalid={!allowUsernameCheckRequest}
        noDisable
        noArrowRight
      />
      {userNameValidationError && (
        <Text color="status-critical" margin={{ top: 'xxsmall' }}>
          {userNameValidationError}
        </Text>
      )}
      {usernameValidationQuery?.data && (
        <>
          <Text size="large" margin={{ vertical: 'medium' }}>
            {textUsernameAvailable}
          </Text>
          <StyledBox
            align="flex-end"
            justify="center"
            margin={{ top: 'small' }}
            pad={{ top: 'medium' }}
            border={{ side: 'top', color: 'border', size: 'xsmall' }}
          >
            <StyledButton
              icon={
                profileUpdateMutation.isLoading ? (
                  <Icon type="loading" color="white" />
                ) : (
                  <Icon type="arrowRight" color="white" />
                )
              }
              label={buttonLabel}
              onClick={finishSignUp}
              primary
              reverse
            />
          </StyledBox>
        </>
      )}
    </>
  );
};

export { StepFive };
