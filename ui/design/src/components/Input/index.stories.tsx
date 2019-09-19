/* eslint-disable import/first */
import { boolean, text, object, color } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import { Search } from 'grommet-icons';
import * as React from 'react';
import styled from 'styled-components';
import Input from './';

const Container = styled.div`
  width: 600px;
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  &:not(:last-child) {
    margin-bottom: 10px;
  }
`;

const Column = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: left;

  &:first-of-type {
    width: 200px;
  }
`;

const InputComponent = () => {
  const [value, setValue] = React.useState('');

  return (
    <Container>
      <Row>
        <Column>Basic input:</Column>
        <Column>
          <Input
            value={value}
            placeholder={text('Placeholder', 'Text')}
            disabled={boolean('Disabled', false)}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setValue(event.target.value)}
            margin={object('Margin', { margin: '0px' })}
            backgroundColor={color('Background Color', '')}
          />
        </Column>
      </Row>
    </Container>
  );
};

const InputIconComponent = () => {
  const [value, setValue] = React.useState('');

  return (
    <Container>
      <Row>
        <Column>Input without button:</Column>
        <Column>
          <Input
            value={value}
            placeholder={text('Placeholder', 'Text')}
            disabled={boolean('Disabled', false)}
            icon={<Search size="18px" color="dark-3" />}
            leftSideButton={boolean('Button on left side', false)}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setValue(event.target.value)}
          />
        </Column>
      </Row>
      <Row>
        <Column>Input with button:</Column>
        <Column>
          <Input
            value={value}
            placeholder={text('Placeholder', 'Text')}
            disabled={boolean('Disabled', false)}
            icon={<Search size="18px" color="light-1" />}
            withButton
            leftSideButton={boolean('Button on left side', false)}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setValue(event.target.value)}
            onButtonClick={() => action('Button click')('Button has been clicked')}
          />
        </Column>
      </Row>
    </Container>
  );
};

const InputButtonComponent = () => {
  const [value, setValue] = React.useState('');

  return (
    <Container>
      <Row>
        <Column>Input without button:</Column>
        <Column>
          <Input
            value={value}
            placeholder={text('Placeholder', 'Text')}
            disabled={boolean('Disabled', false)}
            icon="Search"
            leftSideButton={boolean('Button on left side', false)}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setValue(event.target.value)}
          />
        </Column>
      </Row>
      <Row>
        <Column>Input with button:</Column>
        <Column>
          <Input
            value={value}
            placeholder={text('Placeholder', 'Text')}
            disabled={boolean('Disabled', false)}
            icon="Search"
            withButton
            leftSideButton={boolean('Button on left side', false)}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setValue(event.target.value)}
            onButtonClick={() => action('Button click')('Button has been clicked')}
          />
        </Column>
      </Row>
    </Container>
  );
};

storiesOf('Input', module)
  .add('default', () => <InputComponent />)
  .add('with icon', () => <InputIconComponent />)
  .add('with text button', () => <InputButtonComponent />);
