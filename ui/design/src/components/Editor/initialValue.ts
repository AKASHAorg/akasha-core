import { Value } from 'slate';

export const initialValue = Value.fromJSON({
  document: {
    nodes: [
      {
        object: 'block',
        type: 'paragraph',
        nodes: [
          {
            object: 'text',
            text: '',
          },
        ],
      },
    ],
  },
});

export const schema = {
  blocks: {
    image: {
      isVoid: true,
    },
  },
};
