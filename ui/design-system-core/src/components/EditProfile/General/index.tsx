import React from 'react';
import Button from '../../Button';
import Stack from '../../Stack';
import TextField from '../../TextField';
import { Header, HeaderProps } from './Header';

type InputType = { label: string; initialValue: string };

type ButtonType = {
  label: string;
  handleClick: (event: React.SyntheticEvent<Element, Event>) => void;
};

export type GeneralProps = {
  header: HeaderProps;
  name: InputType;
  userName: InputType;
  ens: InputType;
  ensButton: ButtonType;
  cancelButton: ButtonType;
  saveButton: ButtonType;
};
export const General: React.FC<GeneralProps> = ({
  header,
  name,
  userName,
  ens,
  ensButton,
  cancelButton,
  saveButton,
}) => {
  return (
    <Stack direction="column" spacing="gap-y-3.5">
      <Header {...header} />
      <TextField label={name.label} />
      <TextField label={userName.label} value="coffeelover" readOnly={true} />
      <Stack
        align="end"
        justify="between"
        customStyle="hidden sm:flex"
        spacing="sm:gap-x-6"
        fullWidth
      >
        <TextField label={ens.label} customStyle="grow" />
        <Button label={ensButton.label} customStyle="ml-auto" />
      </Stack>
      <TextField label={ens.label} customStyle="flex sm:hidden" />
      <Button
        label={ensButton.label}
        onClick={ensButton.handleClick}
        customStyle="block w-fit ml-auto sm:hidden"
      />
      <TextField label="Bio" type="multiline" />
      <Stack spacing="gap-x-2" customStyle="ml-auto">
        <Button variant="text" label={cancelButton.label} onClick={cancelButton.handleClick} />
        <Button
          variant="primary"
          label={saveButton.label}
          disabled={true}
          onClick={saveButton.handleClick}
        />
      </Stack>
    </Stack>
  );
};
