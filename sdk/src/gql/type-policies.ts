import { TypePolicy } from '@apollo/client/cache/inmemory/policies';

const buildTypePolicies = (getCurrentUser: () => Promise<{ id?: string } | null>) => {
  const policyFields: TypePolicy = {
    fields: {
      CeramicAccount: {
        merge: true,
        async read(existing, { variables, storage }) {
          const x = await getCurrentUser();
          if (variables?.id && x && existing && Object.hasOwn(existing, 'isViewer')) {
            if (x.id !== variables.id) {
              return Object.assign({}, existing, { isViewer: true });
            }
          }
          return existing;
        },
      },
    },
  };

  return policyFields;
};

export default buildTypePolicies;
