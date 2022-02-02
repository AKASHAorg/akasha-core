import React from 'react';
import { Box } from 'grommet';
import { MarginType } from 'grommet/utils';

export interface iSectionWrapperProps {
  children: React.ReactNode;
  margin?: MarginType;
  noBorder?: boolean;
}

const SectionWrapper: React.FC<iSectionWrapperProps> = props => {
  const { children, margin, noBorder } = props;
  return (
    <Box
      margin={margin || { top: '2rem' }}
      border={
        noBorder ? false : { color: 'border', size: 'xsmall', style: 'solid', side: 'bottom' }
      }
    >
      {children}
    </Box>
  );
};

export default SectionWrapper;
