import ReactDOM from 'react-dom';

export const ModalRenderer: React.FC<{ slotId?: string }> = props => {
  const { children, slotId } = props;
  if (!slotId) {
    return null;
  }
  const modalRootEl = document.getElementById(slotId);
  if (modalRootEl) {
    return ReactDOM.createPortal(children, modalRootEl);
  }
  // TODO: we should handle the case when the layout-widget does not define a widget-zone
  //        and rendering this modal is a must
  return null;
};
