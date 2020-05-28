import * as React from 'react';
import styled from 'styled-components';

export const HorizontalDivider: React.FC = styled.div`
  width: 100%;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;
