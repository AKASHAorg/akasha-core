import * as React from 'react';
import {
  StyledList,
  StyledRow,
  StyledRowIcon,
  StyledRowText,
  StyledRowNumber,
} from './styled-list';

export interface Item {
  text: string;
  icon?: any;
  number?: any;
}

const renderItem = (item: Item) => {
  return (
    <>
      {item.icon && <StyledRowIcon>{item.icon}</StyledRowIcon>}
      <StyledRowText>{item.text}</StyledRowText>
      {item.number && <StyledRowNumber>{item.number}</StyledRowNumber>}
    </>
  );
};

export interface ListProps {
  dataSource: any[];
  renderItem?: (item: any, idx?: number) => React.ReactNode;
}

const List: React.FC<ListProps> = ({ dataSource, renderItem }) => {
  return (
    <StyledList>
      {dataSource.map((source, i) => (
        <StyledRow key={i}>{renderItem!(source, i)}</StyledRow>
      ))}
    </StyledList>
  );
};

List.defaultProps = {
  renderItem,
};

export default List;
export { renderItem };
