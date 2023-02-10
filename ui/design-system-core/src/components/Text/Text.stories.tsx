import React from 'react';

import Text from './index';

export default {
  title: 'Text/Text',
  component: Text,
};

const Template = () => (
  <>
    <Text variant="h1">h1. Almost before…</Text>
    <Text variant="h2">h2. Almost before…</Text>
    <Text variant="h3">h3. Almost before…</Text>
    <Text variant="h4">h4. Almost before…</Text>
    <Text variant="h5">h5. Almost before…</Text>
    <Text variant="h6">h6. Almost before…</Text>
    <Text variant="subtitle1">Almost before we knew it, we had left the ground.</Text>
    <Text variant="subtitle2">Almost before we knew it, we had left the ground.</Text>
    <Text variant="body1">Almost before we knew it, we had left the ground.</Text>
    <Text variant="body2">Almost before we knew it, we had left the ground.</Text>
    <Text variant="label">Almost before we knew it, we had left the ground.</Text>
    <Text variant="footnotes1">Almost before we knew it, we had left the ground.</Text>
    <Text variant="footnotes2">Almost before we knew it, we had left the ground.</Text>
    <Text variant="button-lg">Button Text Large</Text>
    <Text variant="button-md">Button Text Large</Text>
    <Text variant="button-sm">Button Text Large</Text>
  </>
);

export const Typography = Template.bind({});
Typography.args = {};
