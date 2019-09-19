/* eslint-disable import/first */
import { action } from '@storybook/addon-actions';
import { boolean, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import '@trendmicro/react-popover/dist/react-popover.css';
import { Box } from 'grommet';
import * as icons from 'grommet-icons';
import React, { useState } from 'react';
import styled from 'styled-components';
import { renderItem } from '../List';
import ActionPopover from './ActionPopover';
import BasePopover from './BasePopover';
import ListPopover from './ListPopover';
import SearchPopover from './SearchPopover';

const HelpTip = styled.div`
  display: inline-block;
  border-radius: 50%;
  height: 18px;
  width: 18px;
  line-height: 18px;
  font-size: 11px;
  background: #fafefe;
  border: 1px solid #a3aaaa;
  text-align: center;
  color: #7a7e7e;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.18);
  box-sizing: border-box;
  cursor: default;

  &:hover {
    color: #5a5e5e;
    background: #eaeeee;
    border-color: #9a9999;
  }
`;

const PopoverExample = () => {
  const [show, togglePopover] = useState(false);
  return (
    <Box align="center" pad="large">
      <HelpTip
        className="test"
        onMouseEnter={() => togglePopover(true)}
        onMouseLeave={() => togglePopover(false)}
      >
        ?
      </HelpTip>
      <BasePopover show={show} placement="bottom-right" target={document.querySelector('.test')}>
        <BasePopover.Header>{text('Title', 'Title')}</BasePopover.Header>
        <BasePopover.Body>{text('Content', 'Content')}</BasePopover.Body>
        <BasePopover.Footer>{text('Footer', 'Footer')}</BasePopover.Footer>
      </BasePopover>
    </Box>
  );
};

const iconListDataSource = ['Save highlight', 'Start an entry', 'Comment', 'Share highlight'];

const iconList = [icons.DocumentText, icons.Document, icons.Chat, icons.ShareOption];

const ListPopoverExample = () => {
  const [show, togglePopover] = useState(false);
  return (
    <Box align="center" pad="large">
      <HelpTip
        className="test"
        onMouseEnter={() => togglePopover(true)}
        onClick={() => togglePopover(false)}
      >
        ?
      </HelpTip>
      <ListPopover
        togglePopover={() => togglePopover(false)}
        show={show}
        placement="bottom-right"
        target={document.querySelector('.test')}
        dataSource={iconListDataSource}
        renderItem={(text: string, i?: number) => {
          const IconComponent = iconList[i! % iconList.length];

          return renderItem({
            icon: boolean('With icons', false) ? (
              <IconComponent size="18px" color="dark-1" />
            ) : null,
            text,
            number: boolean('With numbers', false) ? '33' : null,
          });
        }}
      />
    </Box>
  );
};

const SearchPopoverExample = () => {
  const [show, togglePopover] = useState(false);
  const [searchValue, changeSearchValue] = useState('');

  return (
    <Box align="center" pad="large">
      <HelpTip
        className="test"
        onMouseEnter={() => togglePopover(true)}
        onClick={() => togglePopover(false)}
      >
        ?
      </HelpTip>
      <SearchPopover
        show={show}
        placement="bottom-right"
        target={document.querySelector('.test')}
        dataSource={iconListDataSource}
        renderItem={(text: string, i?: number) => {
          const IconComponent = iconList[i! % iconList.length];

          return renderItem({
            icon: boolean('With icons', false) ? (
              <IconComponent size="18px" color="dark-3" />
            ) : null,
            text,
            number: boolean('With numbers', false) ? '33' : null,
          });
        }}
        searchValue={searchValue}
        searchPlaceholder="Search by List..."
        onSearchChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          changeSearchValue(e.target.value)
        }
        onSearchClick={(e: React.ChangeEvent<HTMLInputElement>) =>
          action('Search button click')('Search button clicked')
        }
        onAddClick={(e: React.ChangeEvent<HTMLInputElement>) =>
          action('Add button click')('Add button clicked')
        }
      />
    </Box>
  );
};

const ActionPopoverExample = () => {
  const [show, togglePopover] = useState(false);

  return (
    <Box align="center" pad="large">
      <HelpTip
        className="test"
        onMouseEnter={() => togglePopover(true)}
        onClick={() => togglePopover(false)}
      >
        ?
      </HelpTip>
      <ActionPopover
        show={show}
        placement="bottom-right"
        target={document.querySelector('.test')}
        content={text('Content', 'This is a new tag that wasnt created by anyone before.')}
        createText={text('Ok button text', 'Create')}
        onCancelClick={(e: React.ChangeEvent<HTMLInputElement>) =>
          action('Cancel button click')('Cancel button clicked')
        }
        onOkClick={(e: React.ChangeEvent<HTMLInputElement>) =>
          action('Ok button click')('Ok button clicked')
        }
      />
    </Box>
  );
};

storiesOf('Popover', module)
  .add('default', () => <PopoverExample />)
  .add('list', () => <ListPopoverExample />)
  .add('search', () => <SearchPopoverExample />)
  .add('action', () => <ActionPopoverExample />);
