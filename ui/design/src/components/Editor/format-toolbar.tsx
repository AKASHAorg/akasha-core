import React from 'react';
import { Editor, Range } from 'slate';
import { ReactEditor, useSlate } from 'slate-react';
import styled from 'styled-components';
import { Icon, IconType } from '../Icon/icon';
import { CustomEditor, Portal } from './helpers';

const StyledDiv = styled.div`
  margin: 0 ${props => props.theme.shapes.baseSpacing}px;
`;
export interface IFormatButton {
  format: string;
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

const FormatButton: React.FC<IFormatButton> = ({ format, icon }) => {
  const editor = useSlate();
  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    CustomEditor.toggleFormat(editor, format);
  };
  const isActive = CustomEditor.isFormatActive(editor, format);
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
      Editor.string(editor, selection) === ''
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
        <FormatButton format="bold" icon="bold" />
        <FormatButton format="italic" icon="italic" />
        <FormatButton format="underlined" icon="underline" />
        <FormatButton format="code" icon="code" />
      </StyledToolbar>
    </Portal>
  );
};
