import ReactDOM from 'react-dom';

interface IPortal {
  children: React.ReactNode;
  targetNode?: HTMLElement;
}

export const Portal: React.FC<IPortal> = ({ children, targetNode }) => {
  if (targetNode) {
    return ReactDOM.createPortal(children, targetNode);
  }
  return ReactDOM.createPortal(children, document.body);
};
