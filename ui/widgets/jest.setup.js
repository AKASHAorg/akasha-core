import { genAppProps } from '@akashaorg/af-testing';
import * as useRootComponentProps from '@akashaorg/ui-awf-hooks/lib/use-root-props';

jest.mock('@twind/core', () => {
  return {
    tw: () => ({}),
    apply: () => ({}),
  };
});

jest.spyOn(useRootComponentProps, 'useRootComponentProps').mockReturnValue(genAppProps());
