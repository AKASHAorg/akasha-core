import React, { PropsWithChildren } from 'react';

import BasicCardBox from '@akashaorg/design-system-core/lib/components/BasicCardBox';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export interface IBaseLayout {
  title: string;
}

const BaseLayout: React.FC<PropsWithChildren<IBaseLayout>> = props => {
  const { title, children } = props;
  return (
    <BasicCardBox pad="p-0">
      <React.Fragment>
        <Box customStyle="p-4 border(b-1 solid grey8)">
          <Text variant="h5" align="center">
            {title}
          </Text>
        </Box>
        {children}
      </React.Fragment>
    </BasicCardBox>
  );
};

export default BaseLayout;
