// tslint:disable-next-line: no-var-requires
const React = require('react');
// tslint:disable-next-line: no-var-requires
import * as reactI18next from 'react-i18next';

const hasChildren = (node: { children: any; props: { children: any } }) =>
  node && (node.children || (node.props && node.props.children));

const getChildren = (node: { children: any; props: { children: any } }) =>
  node && node.children ? node.children : node.props && node.props.children;

const renderNodes: any = (reactNodes: { [x: string]: any }) => {
  if (typeof reactNodes === 'string') {
    return reactNodes;
  }

  return Object.keys(reactNodes).map((key, i) => {
    const child = reactNodes[key];
    const isElement = React.isValidElement(child);

    if (typeof child === 'string') {
      return child;
    }
    if (hasChildren(child)) {
      const inner = renderNodes(getChildren(child));
      return React.cloneElement(child, { ...child.props, key: i }, inner);
    }
    if (typeof child === 'object' && !isElement) {
      return Object.keys(child).reduce((str, childKey) => `${str}${child[childKey]}`, '');
    }

    return child;
  });
};

const useMock = [(k: string) => k, {}];

module.exports = {
  // this mock makes sure any components using the translate HoC receive the t function as a prop
  Trans: ({ children }: { children: any }) => renderNodes(children),
  Translation: ({ children }: { children: any }) => children((k: any) => k, { i18n: {} }),
  useTranslation: () => useMock,
  withTranslation: () => (Component: React.ElementType) => (props: any) => (
    <Component t={(k: any) => k} {...props} />
  ),

  // mock if needed
  I18nextProvider: reactI18next.I18nextProvider,
  getDefaults: reactI18next.getDefaults,
  getI18n: reactI18next.getI18n,
  initReactI18next: reactI18next.initReactI18next,
  setDefaults: reactI18next.setDefaults,
  setI18n: reactI18next.setI18n,
};
