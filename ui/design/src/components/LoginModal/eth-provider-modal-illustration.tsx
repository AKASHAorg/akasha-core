import * as React from 'react';
import { Box } from 'grommet';
import styled from 'styled-components';

import Icon from '../Icon';

const IconCircleBg = styled.div`
  border-radius: 50%;
  background: ${props => props.theme.colors.border};
  width: 64px;
  height: 64px;
  padding: 14px 12px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const HorizontalDashedLine = styled.div`
  border-bottom: 2px dashed ${props => props.theme.colors.border};
  height: 2px;
  flex: 1;
  margin: 0 0.5rem;
`;

export interface IEthProviderIllustrationProps {
  providerIcon: React.ReactElement;
}

const EthProviderModalIllustration: React.FC<IEthProviderIllustrationProps> = props => (
  <Box
    direction="row"
    align="center"
    justify="center"
    margin="1.5em 0"
    width={{ max: '80vw', min: '10rem' }}
  >
    <Box
      alignContent="between"
      justify="between"
      style={{ width: '100%', alignItems: 'center' }}
      direction="row"
    >
      <IconCircleBg>{props.providerIcon}</IconCircleBg>
      <HorizontalDashedLine />
      <IconCircleBg>
        <Icon type="ethereumWorldLogo" size="lg" />
      </IconCircleBg>
    </Box>
  </Box>
);

export default EthProviderModalIllustration;
