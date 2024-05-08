import { Text, Element } from 'slate';

export const serializeToPlainText = (node: any) => {
  if (Text.isText(node)) {
    return node.text;
  }
  if (Element.isElement(node) && node.type === 'tag') {
    return `#${node.name}`;
  }

  if (Element.isElement(node) && node.type === 'mention') {
    return `@${node.name || node.id}`;
  }

  const children: any = node.children.map((n: any) => serializeToPlainText(n)).join(' ');

  return children;
};
