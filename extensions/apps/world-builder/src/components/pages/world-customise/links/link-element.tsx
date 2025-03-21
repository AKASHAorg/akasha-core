import React from 'react';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { SocialLink } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { Link, Trash2 } from 'lucide-react';
import { Input } from '@akashaorg/ui/lib/akasha-components/input';
import { Github } from '@akashaorg/ui/lib/custom-icons/github';
import { Telegram } from '@akashaorg/ui/lib/custom-icons/telegram';
import { Discord } from '@akashaorg/ui/lib/custom-icons/discord';
import { X } from '@akashaorg/ui/lib/custom-icons/x';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@akashaorg/ui/lib/components/select';

type LinkElementValue = SocialLink & { _id?: number };

export type LinkElementProps = {
  onDelete: () => void;
  onChange: (value: LinkElementValue) => void;
  value: LinkElementValue;
};

export const iconsMap = {
  github: <Github />,
  telegram: <Telegram />,
  discord: <Discord />,
  twitter: <X />,
  other: <Link />,
};

export const LinkElement: React.FC<LinkElementProps> = props => {
  const { onDelete, onChange, value } = props;

  return (
    <Stack
      direction="row"
      justifyContent="between"
      alignItems="center"
      spacing={4}
      className="w-full"
    >
      <Stack direction="row" className="w-full" alignItems="center" spacing={2}>
        <Select
          value={value.name}
          onValueChange={newValue => onChange({ ...value, name: newValue })}
        >
          <SelectTrigger className="w-[68px]">
            <SelectValue defaultValue={'other'} />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(iconsMap).map((iconName, idx) => (
              <SelectItem key={idx} value={iconName}>
                {iconsMap[iconName]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          className="w-full"
          placeholder="e.g. http://www.social.com"
          value={value.href}
          onChange={ev => onChange({ ...value, href: ev.target.value })}
        />
      </Stack>
      <button onClick={onDelete}>
        <Trash2 className="text-destructive" />
      </button>
    </Stack>
  );
};
