import { Node, Text } from 'slate';

export const serializeToPlainText = (node: Node) => {
  if (Text.isText(node)) {
    return node.text;
  }
  if (node.type === 'tag') {
    return `#${node.name}`;
  }

  if (node.type === 'mention') {
    return `@${node.userName || node.name || node.ethAddress}`;
  }

  const children: any = node.children.map(n => serializeToPlainText(n)).join(' ');

  return children;
};
