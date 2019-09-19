/* eslint-disable import/first */
import { action } from '@storybook/addon-actions';
import { boolean, number, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React, { useState } from 'react';
import Modal from './';

const CustomModalExample = () => {
  const [isOpen, toggleOpen] = useState(false);
  const onClick = () => {
    toggleOpen(!isOpen);
  };
  return (
    <>
      <button onClick={onClick}>Open</button>
      <Modal
        title={text('Title', 'Create a new tag')}
        isOpen={isOpen}
        closable={boolean('closable', true)}
        closeTimeoutMS={number('closeTimeout', 50)}
        ariaHideApp={boolean('ariaHideApp', false)}
        shouldFocusAfterRender={boolean('shouldFocusAfterRender', false)}
        shouldCloseOnOverlayClick={boolean('shouldCloseOnOverlayClick', true)}
        shouldCloseOnEsc={boolean('shouldCloseOnEsc', true)}
        shouldReturnFocusAfterClose={boolean('shouldReturnFocusAfterClose', false)}
        onClose={() => {
          onClick();
          action('onClose')();
        }}
        okText={text('okText', 'Confirm')}
        onOk={() => {
          onClick();
          action('onOK')();
        }}
        onCancel={() => {
          onClick();
          action('okCancel')();
        }}
      >
        {text(
          'Content',
          'To create and use this tag will carry an additional fee to create it of 0.000X AETH.',
        )}
      </Modal>
    </>
  );
};

storiesOf('Modal', module).add('default', () => <CustomModalExample />);
