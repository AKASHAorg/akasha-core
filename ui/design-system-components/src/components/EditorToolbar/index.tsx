import React from 'react';

import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import { ChevronDownIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  BoldAlt,
  Italic,
  ListBulleted,
  ListNumbered,
  Strikethrough,
  TextcaseLower,
  TextcaseSentence,
  TextcaseUpper,
  Underline,
} from '@akashaorg/design-system-core/lib/components/Icon/akasha-icons';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import { useCloseActions } from '@akashaorg/design-system-core/lib/utils';

import IconDrop, { IconEntry } from './icon-drop';

export type EditorToolbarProps = {
  onBoldClick: () => void;
  onItalicClick: () => void;
  onUnderlineClick: () => void;
  onStrikeThroughClick: () => void;
};

const EditorToolbar: React.FC<EditorToolbarProps> = props => {
  const { onBoldClick, onItalicClick, onUnderlineClick, onStrikeThroughClick } = props;

  const caseStyleRef = useCloseActions(() => {
    setDropOpen(null);
  });
  const listStyleRef = useCloseActions(() => {
    setDropOpen(null);
  });
  const alignStyleRef = useCloseActions(() => {
    setDropOpen(null);
  });

  const caseIcons: IconEntry[] = [
    { icon: <TextcaseSentence />, handler: () => handleIconClick('textcaseSentence') },
    { icon: <TextcaseLower />, handler: () => handleIconClick('textcaseLower') },
    { icon: <TextcaseUpper />, handler: () => handleIconClick('textcaseUpper') },
  ];

  const listIcons: IconEntry[] = [
    { icon: <ListBulleted />, handler: () => handleIconClick('listBulleted') },
    { icon: <ListNumbered />, handler: () => handleIconClick('listNumbered') },
  ];

  const alignIcons: IconEntry[] = [
    { icon: <AlignLeft />, handler: () => handleIconClick('alignLeft') },
    { icon: <AlignRight />, handler: () => handleIconClick('alignRight') },
    { icon: <AlignCenter />, handler: () => handleIconClick('alignCenter') },
    { icon: <AlignJustify />, handler: () => handleIconClick('alignJustify') },
  ];

  const [dropOpen, setDropOpen] = React.useState<string | null>(null);
  const [caseStyle, setCaseStyle] = React.useState<string>('textcaseSentence');
  const [listStyle, setListStyle] = React.useState<string>('listBulleted');
  const [alignStyle, setAlignStyle] = React.useState<string>('alignLeft');

  const handleIconClick = (iconType: string) => {
    switch (dropOpen) {
      case 'align':
        setAlignStyle(iconType);
        setDropOpen(null);
        break;
      case 'list':
        setListStyle(iconType);
        setDropOpen(null);
        break;
      case 'case':
        setCaseStyle(iconType);
        setDropOpen(null);
        break;
      default:
        setDropOpen(null);
        break;
    }
  };

  const getIconfromStyle = (type: string) => {
    if (type === 'textcaseSentence') return <TextcaseSentence />;
    if (type === 'textcaseLower') return <TextcaseLower />;
    if (type === 'textcaseUpper') return <TextcaseUpper />;
    if (type === 'textcaseSentence') return <TextcaseSentence />;
    if (type === 'listBulleted') return <ListBulleted />;
    if (type === 'listNumbered') return <ListNumbered />;
    if (type === 'alignLeft') return <AlignLeft />;
    if (type === 'alignRight') return <AlignRight />;
    if (type === 'alignJustify') return <AlignJustify />;
  };

  return (
    <Stack direction="row" justify="center" spacing="gap-2" customStyle="p-2">
      {/* emoji */}

      {/* uncomment this code to enable color-picker. You must install react-color, or react-colorful -
      a light weight alternative (recommended) */}

      <Stack customStyle="relative">
        <button onClick={() => setDropOpen('case')}>
          <Stack customStyle="flex flex-row items-center" ref={caseStyleRef}>
            <Icon icon={getIconfromStyle(caseStyle)} size="sm" />
            <Icon icon={<ChevronDownIcon />} />
          </Stack>
        </button>

        {caseStyleRef.current && dropOpen === 'case' && <IconDrop dropItems={caseIcons} />}
      </Stack>
      <button onClick={onBoldClick}>
        <Icon icon={<BoldAlt />} />
      </button>
      <button onClick={onItalicClick}>
        <Icon icon={<Italic />} />
      </button>
      <button onClick={onUnderlineClick}>
        <Icon icon={<Underline />} />
      </button>
      <button onClick={onStrikeThroughClick}>
        <Icon icon={<Strikethrough />} />
      </button>

      <Stack customStyle="relative">
        <button onClick={() => setDropOpen('list')}>
          <Stack direction="row" align="center" ref={listStyleRef}>
            <Icon icon={getIconfromStyle(listStyle)} size="sm" />
            <Icon icon={<ChevronDownIcon />} />
          </Stack>
        </button>
        {listStyleRef.current && dropOpen === 'list' && <IconDrop dropItems={listIcons} />}
      </Stack>

      <Stack direction="row">
        <button onClick={() => setDropOpen('align')}>
          <Stack direction="row" align="center" ref={alignStyleRef}>
            <Icon icon={getIconfromStyle(alignStyle)} size="sm" />
            <Icon icon={<ChevronDownIcon />} />
          </Stack>
        </button>
        {alignStyleRef.current && dropOpen === 'align' && <IconDrop dropItems={alignIcons} />}
      </Stack>
    </Stack>
  );
};

export default EditorToolbar;
