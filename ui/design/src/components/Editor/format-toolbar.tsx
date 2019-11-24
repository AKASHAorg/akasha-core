import React from 'react';
import ReactDOM from 'react-dom';
import { Editor as SlateEditor } from 'slate';
import { Editor, EditorProps, RenderMarkProps } from 'slate-react';
import styled from 'styled-components';
import Icon, { IconType } from '../Icon/icon';
import { initialValue } from './initialValue';

const StyledButton = styled.button<{ active: boolean }>`
  cursor: pointer;
  color: ${props => (props.active ? 'white' : '#aaa')};
`;
interface IMarkButton {
  editor: Editor;
  type: string;
  icon: IconType;
}

const StyledToolbar = styled.div`
  padding: 8px 7px 6px;
  position: absolute;
  z-index: 100;
  top: -10000px;
  left: -10000px;
  margin-top: -6px;
  opacity: 0;
  background-color: #222;
  border-radius: 4px;
  transition: opacity 0.75s;
`;

const MarkButton: React.FC<IMarkButton> = props => {
  const { editor, type, icon } = props;
  const { value } = editor;
  const isActive = value.activeMarks.some(mark => mark!.type === type);
  const handleClick: (event: React.MouseEvent) => any = event => {
    event.preventDefault();
    editor.toggleMark(type);
  };
  return (
    <StyledButton active={isActive} onMouseDown={handleClick}>
      <Icon type={icon} />
    </StyledButton>
  );
};

const FormatToolbar = React.forwardRef((props: any, ref: any): any => {
  const { editor } = props;
  const root = window.document.getElementById('root');
  if (root) {
    return ReactDOM.createPortal(
      <StyledToolbar ref={ref}>
        <MarkButton editor={editor} type="bold" icon="app" />
        <MarkButton editor={editor} type="italic" icon="app" />
        <MarkButton editor={editor} type="underlined" icon="app" />
        <MarkButton editor={editor} type="code" icon="code" />
      </StyledToolbar>,
      root,
    );
  }
  return;
});

/**
 * The hovering menu example.
 *
 * @type {Component}
 */

class HoveringMenu extends React.Component {
  /**
   * Deserialize the raw initial value.
   *
   * @type {Object}
   */

  state = {
    value: initialValue,
  };

  menuRef = React.createRef();

  /**
   * On update, update the menu.
   */

  componentDidMount = () => {
    this.updateMenu();
  };

  componentDidUpdate = () => {
    this.updateMenu();
  };

  /**
   * Update the menu's absolute position.
   */

  updateMenu = () => {
    const menu: any = this.menuRef.current;
    if (!menu) return;

    const { value } = this.state;
    const { fragment, selection } = value;

    if (selection.isBlurred || selection.isCollapsed || fragment.text === '') {
      menu.removeAttribute('style');
      return;
    }

    const native = window.getSelection();
    const range = native!.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    menu.style.opacity = 1;
    menu.style.top = `${rect.top + window.pageYOffset - menu.offsetHeight}px`;

    menu.style.left = `${rect.left + window.pageXOffset - menu.offsetWidth / 2 + rect.width / 2}px`;
  };

  /**
   * Render.
   *
   * @return {Element}
   */

  render() {
    return (
      <div>
        <Editor
          placeholder="Enter some text..."
          value={this.state.value}
          onChange={this.onChange}
          renderEditor={this.renderEditor}
          renderMark={this.renderMark}
        />
      </div>
    );
  }

  /**
   * Render the editor.
   *
   * @param {Object} props
   * @param {Function} next
   * @return {Element}
   */

  renderEditor = (_props: EditorProps, editor: SlateEditor, next: () => any) => {
    const children = next();
    return (
      <React.Fragment>
        {children}
        <FormatToolbar ref={this.menuRef} editor={editor} />
      </React.Fragment>
    );
  };

  /**
   * Render a Slate mark.
   *
   * @param {Object} props
   * @param {Editor} editor
   * @param {Function} next
   * @return {Element}
   */

  renderMark = (props: RenderMarkProps, _editor: SlateEditor, next: () => any) => {
    const { children, mark, attributes } = props;

    switch (mark.type) {
      case 'bold':
        return <strong {...attributes}>{children}</strong>;
      case 'code':
        return <code {...attributes}>{children}</code>;
      case 'italic':
        return <em {...attributes}>{children}</em>;
      case 'underlined':
        return <u {...attributes}>{children}</u>;
      default:
        return next();
    }
  };

  /**
   * On change.
   *
   * @param {Editor} editor
   */

  onChange = ({ value }: any) => {
    this.setState({ value });
  };
}

/**
 * Export.
 */

export default HoveringMenu;
