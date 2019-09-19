import React from 'react';
import styled from 'styled-components';

export interface BalanceProps {
  balance?: number | string;
  short?: boolean;
  type: string;
}

const BalanceWrapper = styled.div`
  height: 100%;
  font-weight: 500;
`;

const BalanceValue = styled.div`
  flex: 1 1 auto;
  margin-right: 4px;
`;

const BalanceSymbol = styled.div`
  flex: 0 0 auto;
  text-transform: uppercase;
`;

const Balance: React.FC<BalanceProps> = ({ balance, short, type }) => {
  return (
    <BalanceWrapper>
      <BalanceValue>{balance}</BalanceValue>
      <BalanceSymbol>{type}</BalanceSymbol>
    </BalanceWrapper>
  );
};

Balance.defaultProps = {
  balance: 0,
};

export default Balance;
