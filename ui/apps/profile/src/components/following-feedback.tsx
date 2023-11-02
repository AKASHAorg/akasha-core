import React, { useCallback, useEffect, useMemo } from 'react';
import Snackbar from '@akashaorg/design-system-core/lib/components/Snackbar';
import { hasOwn, useMutationListener } from '@akashaorg/ui-awf-hooks';
import {
  useCreateFollowMutation,
  useUpdateFollowMutation,
} from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { AkashaFollowDocument } from '@akashaorg/typings/lib/ui';

type CreateMutationData = { createAkashaFollow: { document: AkashaFollowDocument } };

type UpdateMutationData = { updateAkashaFollow: { document: AkashaFollowDocument } };

const FollowingFeedback = () => {
  const { t } = useTranslation('app-profile');
  const { profileId } = useParams<{ profileId: string }>();
  const { mutation: createFollowState, clear: clearCreateFollowState } = useMutationListener<
    {
      i: { content: Pick<AkashaFollowDocument, 'isFollowing' | 'profileID'> };
    },
    CreateMutationData
  >(useCreateFollowMutation.getKey());
  const { mutation: updateFollowState, clear: updateCreateFollowState } = useMutationListener<
    {
      i: { content: Pick<AkashaFollowDocument, 'isFollowing' | 'profileID'> };
    },
    UpdateMutationData
  >(useUpdateFollowMutation.getKey());

  const clear = createFollowState ? clearCreateFollowState : updateCreateFollowState;

  const followState = createFollowState || updateFollowState;

  const getFollowStateData = useCallback(
    (followStateData: CreateMutationData | UpdateMutationData) => {
      if (followStateData) {
        if (hasOwn(followStateData, 'createAkashaFollow')) {
          return followStateData.createAkashaFollow.document;
        }

        if (hasOwn(followStateData, 'updateAkashaFollow')) {
          return followStateData.updateAkashaFollow.document;
        }
      }
      return null;
    },
    [],
  );

  const followStateData = useMemo(() => {
    if (
      followState &&
      followState.state.status === 'success' &&
      followState.state.variables.i.content.isFollowing
    ) {
      const stateData = getFollowStateData(followState.state.data);
      if (stateData.profile?.did.id === profileId) {
        return stateData;
      }
      return null;
    }
    return null;
  }, [followState, getFollowStateData, profileId]);

  useEffect(() => {
    if (followStateData) setTimeout(clear, 5000);
  }, [followStateData, clear]);

  return (
    followStateData && (
      <Snackbar
        title={t('You are now following {{name}}', {
          name: followStateData.profile?.name || profileId,
        })}
        handleDismiss={clear}
        type="success"
        iconType="CheckCircleIcon"
        customStyle="mb-4"
      />
    )
  );
};

export default FollowingFeedback;
