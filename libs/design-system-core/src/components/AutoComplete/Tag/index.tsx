import React from 'react';
import Card from '../../Card';
import Stack from '../../Stack';
import Text from '../../Text';
import Button from '../../Button';
import { XIcon } from 'lucide-react';

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
          <XIcon className="h-4 w-4 [&>*]:stroke-secondaryLight dark:[&>*]:stroke-secondaryDark" />
        </Button>
      </Stack>
    </Card>
  );
};

export default Tag;
