import React from 'react';
import Card from '../../Card';
import Stack from '../../Stack';
import Text from '../../Text';
import Button from '../../Button';
import Icon from '../../Icon';
import { XMarkIcon } from '../../Icon/hero-icons-outline';

type TagProps = {
  tag: string;
  onRemove: () => void;
};

//@TODO: Combine this component with pill component and use the latter for tags
const Tag: React.FC<TagProps> = props => {
  const { tag, onRemove } = props;
  return (
    <Card key={tag} radius={24} padding={'px-2 py-1'} customStyle="w-fit" accentBorder>
      <Stack direction="row" align="center" spacing="gap-x-1">
        <Text variant="body2" weight="light" truncate>
          {tag}
        </Text>
        <Button onClick={onRemove} plain>
          <Icon icon={<XMarkIcon />} size="sm" accentColor />
        </Button>
      </Stack>
    </Card>
  );
};

export default Tag;
