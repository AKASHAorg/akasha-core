import React, { Fragment, PropsWithChildren } from 'react';
import { tw } from '@twind/core';
import { Dialog, Transition } from '@headlessui/react';

import Button from '../Button';
import { ButtonProps } from '../Button/types';
import Card from '../Card';
import Divider from '../Divider';
import Icon from '../Icon';
import { XMarkIcon } from '../Icon/hero-icons-outline';
import Stack from '../Stack';
import Text, { TextProps } from '../Text';

export type ActionsAlign = 'center' | 'end';

export type ModalProps = {
  show: boolean;
  actions: ButtonProps[];
  title?: { label: string } & TextProps;
  showDivider?: boolean;
  actionsAlign?: ActionsAlign;
  customStyle?: string;
  onClose?: () => void;
};

const Modal: React.FC<PropsWithChildren<ModalProps>> = ({
  show,
  actions,
  title,
  showDivider = false,
  actionsAlign,
  customStyle = '',
  children,
  onClose,
}) => {
  return (
    <Transition show={show} as={Fragment}>
      <Dialog as="div" onClose={onClose} className={tw('relative z-[11]')}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/75" />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Stack align="center" justify="center" customStyle="fixed inset-0">
            <Stack customStyle="w-fit -ml(md:6)">
              <Dialog.Panel>
                <Card radius={20} padding={'py-4'} customStyle={`${customStyle} relative`}>
                  <Stack direction="column" spacing="gap-y-4">
                    {title && (
                      <Dialog.Title className={tw('px-4')}>
                        <Stack align="center" justify="center">
                          <Text align="center" variant="h5" {...title}>
                            {title.label}
                          </Text>
                          <Button onClick={onClose} plain customStyle="absolute top-4 right-4">
                            <Icon
                              icon={<XMarkIcon />}
                              size="md"
                              color={{ light: 'grey4', dark: 'grey7' }}
                            />
                          </Button>
                        </Stack>
                      </Dialog.Title>
                    )}

                    {showDivider && <Divider />}

                    <Stack
                      align="center"
                      justify="center"
                      direction="column"
                      spacing="gap-y-4"
                      customStyle="px-4"
                    >
                      {children}
                      <Stack
                        direction="row"
                        spacing="gap-x-4"
                        justify={actionsAlign}
                        customStyle="mt-auto"
                      >
                        {actions.map((action, index) => (
                          <Button key={index} size="md" {...action} />
                        ))}
                      </Stack>
                    </Stack>
                  </Stack>
                </Card>
              </Dialog.Panel>
            </Stack>
          </Stack>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};

export default Modal;
