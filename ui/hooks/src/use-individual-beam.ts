import { useGetBeamByIdQuery } from './generated/apollo';

export type UseIndividualBeamOptions = {
  beamId: string;
};

export const useIndividualBeam = ({ beamId }: UseIndividualBeamOptions) => {
  const {
    data: beamData,
    loading,
    error,
  } = useGetBeamByIdQuery({
    variables: {
      id: beamId,
    },
    skip: !beamId,
  });

  return {
    beam: beamData?.node,
    isLoading: loading,
    errors: () => error.message,
  };
};
