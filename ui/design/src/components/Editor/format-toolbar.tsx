import React from 'react';
import ReactDOM from 'react-dom';
import { Editor } from 'slate-react';
import styled from 'styled-components';
import Icon, { IconType } from '../Icon/icon';

const StyledDiv = styled.div`
  margin: 0 ${props => props.theme.shapes.baseSpacing * 2}px;
`;
export interface IMarkButton {
  editor: Editor;
  type: string;
  icon: IconType;
}

const StyledToolbar = styled.div`
  padding: ${props => props.theme.shapes.baseSpacing}px;
  position: absolute;
  z-index: 100;
  top: -10000px;
  left: -10000px;
  margin-top: -6px;
  opacity: 1;
  background-color: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.shapes.baseSpacing}px;
  transition: opacity 0.75s;
  display: inline-flex;
  align-items: center;
`;

const MarkButton: React.FC<IMarkButton> = props => {
  const { editor, type, icon } = props;
  const { value } = editor;
  const isActive = value.activeMarks.some(mark => {
    if (mark) {
      return mark.type === type;
    }
    return false;
  });

  let color = '#aaa';
  if (isActive) {
    color = 'white';
  }
  const handleClick: (event: React.MouseEvent) => any = event => {
    event.preventDefault();
    editor.toggleMark(type);
  };
  return (
    <StyledDiv onMouseDown={handleClick}>
      <Icon type={icon} clickable={true} color={color} />
    </StyledDiv>
  );
};

export const FormatToolbar = React.forwardRef((props: any, ref: any): any => {
  const { editor } = props;
  const root = window.document.getElementById('root');
  if (root) {
    return ReactDOM.createPortal(
      <StyledToolbar ref={ref}>
        <MarkButton editor={editor} type="bold" icon="bold" />
        <MarkButton editor={editor} type="italic" icon="italic" />
        <MarkButton editor={editor} type="underline" icon="underline" />
        <MarkButton editor={editor} type="code" icon="code" />
      </StyledToolbar>,
      root,
    );
  }
  return;
});
