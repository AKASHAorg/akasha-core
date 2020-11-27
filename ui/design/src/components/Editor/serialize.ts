import { Node, Text } from 'slate';

export const serializeToPlainText = (node: Node) => {
  if (Text.isText(node)) {
    return node.text;
  }
  if (node.type === 'tag' || node.type === 'mention') {
    return node.value;
  }

  const children: any = node.children.map(n => serializeToPlainText(n)).join(' ');

  return children;
};
