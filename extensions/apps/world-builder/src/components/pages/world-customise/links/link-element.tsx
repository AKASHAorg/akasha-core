import React from 'react';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { SocialLink } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { FieldError } from 'react-hook-form';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
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

export type LinkElementProps = {
  onDelete: () => void;
  onChange: (...event: any[]) => void;
  value: SocialLink & { _id?: number };
  error?: { href?: FieldError; label?: FieldError };
  inputRef?: React.LegacyRef<HTMLInputElement> & React.LegacyRef<HTMLTextAreaElement>;
};

export const LinkElement: React.FC<LinkElementProps> = props => {
  const { onDelete, onChange, value, error, inputRef } = props;

  const iconsMap = {
    github: <Github />,
    telegram: <Telegram />,
    discord: <Discord />,
    x: <X />,
    other: <Link />,
  };

  return (
    <Stack direction="column" spacing={2} className="w-full">
      <Stack
        direction="row"
        justifyContent="between"
        alignItems="center"
        spacing={4}
        className="w-full"
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Select
            value={value.name || 'github'}
            onValueChange={newValue => onChange({ ...value, name: newValue })}
          >
            <SelectTrigger className="w-[68px]">
              <SelectValue />
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
            className=""
            placeholder="e.g. http://www.dadada.com"
            value={value.href}
            onChange={ev => onChange({ ...value, href: ev.target.value })}
          />
        </Stack>
        <Button variant="ghost" size="sm" onClick={onDelete}>
          <Trash2 color="warning" />
        </Button>
      </Stack>
    </Stack>
  );
};
