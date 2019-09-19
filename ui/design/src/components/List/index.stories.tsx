/* eslint-disable import/first */
import { array } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import * as icons from 'grommet-icons';
import React from 'react';
import styled from 'styled-components';
import List, { renderItem } from './';

const ListContainer = styled.div`
  border: ${props => props.theme.spacing.components.popover.borderWidth} solid
    ${props => props.theme.colors.grey};
  border-radius: ${props => props.theme.shapes.borderRadius};
  width: 400px;
`;

const regularListDataSource = ['Edit draft', 'Share preview', 'Delete draft'];

const iconListDataSource = ['Save highlight', 'Start an entry', 'Comment', 'Share highlight'];

const iconList = [icons.DocumentText, icons.Document, icons.Chat, icons.ShareOption];

const ListExample = () => {
  return (
    <ListContainer>
      <List
        dataSource={array('Data source', regularListDataSource)}
        renderItem={(text: string) => renderItem({ text })}
      />
    </ListContainer>
  );
};

const ListWithIconsExample = () => {
  return (
    <ListContainer>
      <List
        dataSource={array('Data source', iconListDataSource)}
        renderItem={(text: string, i?: number) => {
          const IconComponent = iconList[i! % iconList.length];

          return renderItem({
            icon: <IconComponent size="18px" color="dark-1" />,
            text,
          });
        }}
      />
    </ListContainer>
  );
};

const ListWithNumbersExample = () => {
  return (
    <ListContainer>
      <List
        dataSource={array('Data source', iconListDataSource)}
        renderItem={(text: string, i?: number) => {
          const IconComponent = iconList[i! % iconList.length];

          return renderItem({
            icon: <IconComponent size="18px" color="dark-1" />,
            text,
            number: 33,
          });
        }}
      />
    </ListContainer>
  );
};

storiesOf('List', module)
  .add('default', () => <ListExample />)
  .add('with icons', () => <ListWithIconsExample />)
  .add('with numbers', () => <ListWithNumbersExample />);
