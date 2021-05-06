import * as React from 'react';
import styled from 'styled-components';

const HorizontalDivider: React.FC = styled.div`
  width: 100%;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

export default HorizontalDivider;
