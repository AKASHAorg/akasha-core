import React from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import ReflectionCard from '@akashaorg/ui-lib-feed/lib/components/cards/reflection-card';
import { Profile } from '@akashaorg/typings/lib/ui';
import { useMutationsListener } from '@akashaorg/ui-awf-hooks';
import { useCreateReflectMutation } from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';
import { AkashaReflect } from '@akashaorg/typings/lib/sdk/graphql-types-new';

export type PendingReflectProps = {
  beamId: string;
  loggedProfileData: Profile;
};

export function PendingReflect(props: PendingReflectProps) {
  const { beamId, loggedProfileData } = props;
  const { mutations: pendingReflectStates } = useMutationsListener<
    {
      i: { content: AkashaReflect };
    },
    { createAkashaReflect: { document: AkashaReflect } }
  >(useCreateReflectMutation.getKey());

  return (
    <>
      {pendingReflectStates?.map(
        pendingReflectState =>
          pendingReflectState &&
          pendingReflectState.state.status === 'loading' &&
          pendingReflectState.state.variables.i.content.beamID === beamId && (
            <Stack
              customStyle={`px-4 border border(grey8 dark:grey3) bg-secondaryLight/30`}
              data-testid="pending-entry"
              key={pendingReflectState.mutationId}
            >
              <ReflectionCard
                entryData={{
                  ...pendingReflectState.state.variables.i.content,
                  author: {
                    id: loggedProfileData.did.id,
                    isViewer: loggedProfileData.did.isViewer,
                  },
                }}
                contentClickable={false}
                hidePublishTime={true}
                disableActions={true}
              />
            </Stack>
          ),
      )}
    </>
  );
}
