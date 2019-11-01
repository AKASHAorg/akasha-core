import styled, { css } from 'styled-components';

const AkashaTabs = styled.div`
  position: relative;
`;

const TabsContainer = styled.div``;

const TabsList = styled.ul<{ center: boolean }>`
  padding-left: 0;
  list-style: none;
  margin: 0;
  padding-top: 2px;
  background: ${props => props.theme.colors.darkBackground};
  font-size: 0.875em;
  display: flex;
  flex-direction: row;
  justify-content: ${props => (props.center ? 'center' : 'flex-start')};
  li:first-of-type,
  li:last-child {
    border-left: 0;
  }
`;

const TabTitleItem = styled.li<{ innerRef: any; key: string; id: string; isActiveTab: boolean }>`
  display: inline-block;
  transition: opacity 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  padding: ${props =>
    `${props.theme.shapes.basePadding * 3}px ${props.theme.shapes.basePadding * 6}px`};
  cursor: pointer;
  opacity: 0.8;
  color: ${props => props.theme.colors.darkGrey};
  border-top: 1px solid ${props => props.theme.colors.border};
  border-right: 1px solid ${props => props.theme.colors.border};
  border-bottom: ${props => (props.isActiveTab ? '0' : `1px solid ${props.theme.colors.border}`)};
  text-transform: uppercase;
  margin-bottom: ${props => (props.isActiveTab ? '0' : '-1px')};
  &:hover {
    opacity: 1;
  }
  ${props => {
    return (
      props.isActiveTab &&
      css`
        transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
        cursor: default;
        opacity: 1;
        background-color: ${themeProps => themeProps.theme.colors.lightBackground};
        color: ${themeProps => themeProps.theme.colors.secondary};
      `
    );
  }}
`;

const TabsContentContainer = styled.div`
  background-color: ${props => props.theme.colors.lightBackground};
  padding: 1em;
  color: ${props => props.theme.colors.secondary};
`;
const TabAnchorItem = styled.div`
  user-select: none;
`;

export { AkashaTabs, TabsContainer, TabsList, TabTitleItem, TabsContentContainer, TabAnchorItem };
