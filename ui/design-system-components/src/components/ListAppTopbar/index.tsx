import React from 'react';
import { tw } from '@twind/core';
import { useTranslation } from 'react-i18next';
import DropDown from '@akashaorg/design-system-core/lib/components/Dropdown';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Card from '@akashaorg/design-system-core/lib/components/Card';

export type ListAppTopbarProps = {
  resetLabel?: string;
};

const ListAppTopbar: React.FC<ListAppTopbarProps> = ({ resetLabel = 'Reset' }) => {
  const { t } = useTranslation('app-list');

  const [filterByCategory, setfilterCategory] = React.useState(null);
  const categoryFilterPlaceholderLabel = t('All Categories');

  return (
    <div className={tw('flex justify-between items-center')}>
      <div className={tw('w-2/6 mt-6')}>
        <DropDown
          name="filterByCategory"
          placeholderLabel={categoryFilterPlaceholderLabel}
          selected={filterByCategory}
          menuItems={[
            { id: '1', title: t('Beams') },
            { id: '2', title: t('Reflections') },
          ]}
          setSelected={setfilterCategory}
        />
      </div>
      <Button variant="secondary" icon="PlusIcon" plain={true}>
        {resetLabel}
      </Button>
    </div>
  );
};

export default ListAppTopbar;
