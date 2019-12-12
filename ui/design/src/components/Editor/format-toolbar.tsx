import React from 'react';
import ReactDOM from 'react-dom';
import { Editor, Range } from 'slate';
import { ReactEditor, useSlate } from 'slate-react';
import styled from 'styled-components';
import Icon, { IconType } from '../Icon/icon';

const StyledDiv = styled.div`
  margin: 0 ${props => props.theme.shapes.baseSpacing}px;
`;
export interface IMarkButton {
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
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: ${props => props.theme.colors.shadow};
  transition: opacity 0.75s;
  display: inline-flex;
  align-items: center;
`;

export const Portal = ({ children }: any) => {
  return ReactDOM.createPortal(children, document.body);
};

const MarkButton: React.FC<IMarkButton> = ({ type, icon }) => {
  const editor = useSlate();
  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    editor.exec({ type: 'toggle_mark', mark: { type } });
  };
  const isActive = isMarkActive(editor, type);
  let color = '#132540';
  if (isActive) {
    color = '#4E71FF';
  }

  return (
    <StyledDiv onMouseDown={handleClick}>
      <Icon type={icon} clickable={true} color={color} />
    </StyledDiv>
  );
};

const isMarkActive = (editor: Editor, type: string) => {
  const [mark] = Editor.marks(editor, { match: { type }, mode: 'universal' });
  return !!mark;
};

export const FormatToolbar = () => {
  const ref: React.RefObject<HTMLDivElement> = React.useRef(null);
  const editor = useSlate();

  React.useEffect(() => {
    const el = ref.current;
    const { selection } = editor;

    if (!el) {
      return;
    }

    if (
      !selection ||
      !ReactEditor.isFocused(editor) ||
      Range.isCollapsed(selection) ||
      Editor.text(editor, selection) === ''
    ) {
      el.removeAttribute('style');
      return;
    }

    const domSelection = window.getSelection();
    if (domSelection) {
      const domRange = domSelection.getRangeAt(0);
      const rect = domRange.getBoundingClientRect();
      el.style.opacity = '1';
      el.style.top = `${rect.top + window.pageYOffset - el.offsetHeight}px`;

      el.style.left = `${rect.left + window.pageXOffset - el.offsetWidth / 2 + rect.width / 2}px`;
    }
  });

  return (
    <Portal>
      <StyledToolbar ref={ref}>
        <MarkButton type="bold" icon="bold" />
        <MarkButton type="italic" icon="italic" />
        <MarkButton type="underline" icon="underline" />
        <MarkButton type="code" icon="code" />
      </StyledToolbar>
    </Portal>
  );
};
