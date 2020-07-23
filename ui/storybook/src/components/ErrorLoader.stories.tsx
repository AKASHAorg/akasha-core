/* eslint-disable import/first */
import DS from '@akashaproject/design-system';
import { action } from '@storybook/addon-actions';
import { text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import { styled } from '@storybook/theming';
import * as React from 'react';

const { ErrorLoader, Button, Box } = DS;

// wrapper to simulate the application column
const Wrapper = styled.div`
  max-width: 36.313rem;
  margin: 0 auto;
`;

storiesOf('Errors/ErrorLoader', module)
  .add('missing saved items error', () => (
    <Wrapper>
      <ErrorLoader
        type="missing-saved-items"
        title={text('title', 'Save your inspiration')}
        details={text(
          'details',
          'You have not yet added any post to your saved items. Once you add them, they will be displayed here.',
        )}
      />
    </Wrapper>
  ))
  .add('feed customization error', () => (
    <Wrapper>
      <ErrorLoader
        type="missing-feed-customization"
        title={text('title', 'We need some tips to display something cool for you!')}
        details={text('details', 'Please choose topics and profiles you are interested in.')}
      >
        <Button label="Customize my feed" primary={true} />
      </ErrorLoader>
    </Wrapper>
  ))
  .add('no internet connection error', () => (
    <Wrapper>
      <ErrorLoader
        type="no-connection"
        title={text('title', 'No internet connection')}
        details={text(
          'details',
          'Looks like you lost your connection. Please check it and try again.',
        )}
      >
        <Button label="Try again" primary={true} />
      </ErrorLoader>
    </Wrapper>
  ))
  .add('no login error', () => (
    <Wrapper>
      <ErrorLoader
        type="no-login"
        title={text('title', 'No Ethereum address detected')}
        details={text(
          'details',
          'You need to login or allow access to your current Ethereum address in your Web3 Ethereum client like MetaMask, and then reload, please.',
        )}
      >
        <Box direction="row">
          <Button label="Cancel" secondary={true} margin={{ right: '.5em' }} />
          <Button label="Connect Wallet" primary={true} />
        </Box>
      </ErrorLoader>
    </Wrapper>
  ))
  .add('general error', () => (
    <Wrapper>
      <ErrorLoader
        type="script-error"
        title={text('title', 'An error occured')}
        details={text('details', 'There was an error')}
      />
    </Wrapper>
  ));
