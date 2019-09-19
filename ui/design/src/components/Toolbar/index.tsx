import classnames from 'classnames';
import React, { useState } from 'react';
import styled from 'styled-components';
import Avatar from '../Avatar';

export interface IToolbarSidebarContent {
  title: string;
  links: string[];
}

export interface IToolBarProps {
  mainIcon?: any;
  topIcons: React.ReactElement[];
  bottomIcons: React.ReactElement[];
  avatarIcon?: any;
  topIconsDisable?: boolean;
  bottomIconsDisable?: boolean;
  avatar?: boolean;
  sidebarContentMap: IToolbarSidebarContent[];
}

const ToolBarBlock = styled.div`
  height: 500px;
  display: flex;
  position: relative;
  font-size: 14px;
  .sidebar {
    height: 100%;
    border-bottom: 1px solid #eeeeee;
    width: 64px;
    max-width: 64px;
    background-color: #efeff1;
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 3;
    .sidebar__top-icons {
      flex-grow: 4;
      padding: 16px;
      .sidebar-icon__wrapper {
        width: 32px;
        height: 32px;
        margin: 16px 0px;
        border-radius: 4px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        transition: background-color 0.25s;
      }
      .sidebar-icon__wrapper:hover,
      .sidebar-icon__wrapper.active {
        background-color: #fff;
      }
      .sidebar-icon__wrapper.disable,
      .sidebar-icon__wrapper.disable:hover {
        background-color: transparent;
        cursor: default;
        svg {
          stroke: #c7c3c3;
        }
      }
    }
    .sidebar__new-entry {
      position: relative;
      text-align: center;
    }
    .sidebar__avatar {
      width: 32px;
      height: 32px;
      background-color: #0598ff;
      border-radius: 4px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      svg {
        stroke: #fff;
      }
      .avatar {
        width: 40px;
        border-radius: 6px;
      }
    }
    .sidebar__bottom-icons {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding-bottom: 14px;
      .sidebar-icon__wrapper {
        width: 32px;
        height: 32px;
        border-radius: 4px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 10px;
        transition: background-color 0.25s;
        cursor: pointer;
      }
      .sidebar-icon__wrapper:hover,
      .sidebar-icon__wrapper.active {
        background-color: #fff;
      }
      .sidebar-icon__wrapper.disable,
      .sidebar-icon__wrapper.disable:hover {
        background-color: transparent;
        cursor: default;
        svg {
          stroke: #c7c3c3;
        }
      }
      .sidebar__avatar {
        font-variant: tabular-nums;
        line-height: 1.5;
        color: #778390;
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        list-style: none;
        display: inline-block;
        text-align: center;
        background: #4d5d69;
        color: #fff;
        white-space: nowrap;
        position: relative;
        overflow: hidden;
        vertical-align: middle;
        width: 32px;
        height: 32px;
        line-height: 32px;
        display: flex;
        justify-content: center;
        align-items: center;
        svg {
          stroke: #fff;
          width: 16px;
          height: 16px;
        }
      }
    }
  }
  .sidebar_open {
    padding: 10px 10px 0px;
    position: absolute;
    left: -264px;
    top: 0;
    bottom: 0;
    width: 200px;
    overflow-y: auto;
    overflow-x: hidden;
    border-right: 1px #eee solid;
    transition: left 0.218s ease-in-out;
    background-color: #fff;
    .menu {
      .unstyled-link {
        border-radius: 5px;
        padding: 10px;
        cursor: pointer;
        display: block;
        text-decoration: none;
        color: #444444;
      }
    }
  }
  .sidebar_open.active {
    left: 64px;
  }
`;

const ToolBar: React.FC<IToolBarProps> = props => {
  const [show, setShow] = useState<number | null>(null);

  return (
    <ToolBarBlock>
      <div className="sidebar">
        <div className="sidebar__top-icons">
          {props.avatar && (
            <div className="sidebar__avatar">
              <Avatar src="https://placebeard.it/360x360" size="sm" />
            </div>
          )}
          {props.topIcons.map((e, i) => (
            <div
              key={i}
              onClick={() => setShow(props.topIconsDisable || i === show ? null : i)}
              className={classnames('sidebar-icon__wrapper', {
                active: show === i,
                disable: props.topIconsDisable,
              })}
            >
              {e}
            </div>
          ))}
        </div>
        <div className="sidebar__bottom-icons">
          {props.bottomIcons.map((e, i) => (
            <div
              key={i}
              className={classnames('sidebar-icon__wrapper', {
                disable: props.bottomIconsDisable,
              })}
            >
              {e}
            </div>
          ))}
          <div className="sidebar__avatar">{props.avatarIcon}</div>
        </div>
      </div>

      {props.sidebarContentMap.map((sidebarContent, i) => (
        <div
          key={`sidebar-${i}`}
          className={classnames('sidebar_open', {
            active: show === i,
          })}
        >
          <div className="title">{sidebarContent.title}</div>
          <div className="menu">
            {sidebarContent.links.map((link, j) => (
              <div key={`sidebar-${i}-link-${j}`} className="unstyled-link">
                {link}
              </div>
            ))}
          </div>
        </div>
      ))}
    </ToolBarBlock>
  );
};

// ToolBar.defaultProps = {};

export default ToolBar;
