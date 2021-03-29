import * as React from 'react';
import { ModalContainer } from '../common/fullscreen-modal-container';
import { Box, Button, CheckBoxGroup, Text } from 'grommet';
import { ModalCard } from '../../Cards';
import styled from 'styled-components';
import { Icon } from '../../Icon';
import LinkInput from '../../Input/text-input-icon-form';
import { StyledDivider, StyledAnchor } from '../../Input/text-input-icon-form/styles';

const WalletProviderButton = styled(Box)`
  flex: 1;
  cursor: pointer;
  user-select: none;
`;

export interface IProviderInfo {
  id: string;
  logo: React.ReactElement | string;
  title: string;
  description: string;
}
const ProvidersListModal = (props: {
  onModalClose: () => void;
  onProviderClick: (providerId: string) => void;
  providers: IProviderInfo[];
  showSignUp?: {
    inviteToken: string | null;
    status: boolean;
  };
  titleLabel: string;
  headerLabel?: string;
  subtitleLabel?: string;
  inputPlaceholder?: string;
  submitted?: boolean;
  submitting?: boolean;
  success?: boolean;
  hasError?: boolean;
  errorMsg?: string;
  acceptedTerms?: boolean;
  onChange?: (ev: React.ChangeEvent<HTMLInputElement>) => void;
  validateTokenFn?: (ev: any) => void;
  checkedTermsValues?: any;
  onCheckedTermsValues?: (ev: any) => void;
  waitForCheckTerms?: boolean;
  onAcceptTerms?: (ev: any) => void;
}) => {
  return (
    <ModalContainer onModalClose={props.onModalClose}>
      <ModalCard>
        <Box width={{ max: '22rem', min: '30ch' }}>
          {props?.showSignUp?.status && !props?.acceptedTerms && (
            <>
              <Box align="center" justify="center" pad="small">
                <Text weight="bold" textAlign={'center'} size="xlarge">
                  {props.headerLabel}
                </Text>
              </Box>
              <Box align="center" justify="center" pad="small">
                <Text textAlign={'center'} size="large" color={'secondaryText'}>
                  {props.subtitleLabel}
                </Text>
                <LinkInput inputValue={props?.showSignUp?.inviteToken || ''} {...props} />
                {props.errorMsg && props.hasError && (
                  <Text color={'status-critical'}>{props.errorMsg}</Text>
                )}
              </Box>
              {/*@Todo: extract this up and add legal document links */}
              {props?.success && (
                <>
                  <Box align="center" justify="center" pad="small">
                    <StyledDivider
                      pad="small"
                      height={{ max: '0' }}
                      border={{ style: 'solid', side: 'top' }}
                    />
                  </Box>
                  <Box align="center" justify="center" pad="small">
                    <Text textAlign={'start'} size="medium" color={'secondaryText'}>
                      {'Please confirm below that you have read and agree to our'}
                      <StyledAnchor
                        size="medium"
                        href={'/legal/terms-of-service'}
                        label={' Terms of Service '}
                      />{' '}
                      {'and'}
                      <StyledAnchor
                        size="medium"
                        href={'/legal/privacy-policy'}
                        label={' Privacy Policy. '}
                      />
                      {'Please also acknowledge our'}
                      <StyledAnchor
                        size="medium"
                        href={'/legal/code-of-conduct'}
                        label={' Code of Conduct '}
                      />
                      {
                        'as the basis for respectful interactions with each other on Ethereum World.'
                      }
                    </Text>
                  </Box>
                  <Box align="start" justify="start" pad="small">
                    <CheckBoxGroup
                      value={props.checkedTermsValues}
                      labelKey="label"
                      valueKey="key"
                      options={[
                        { label: 'I accept the Terms of Service', key: 'terms' },
                        { label: 'I accept the Privacy Policy', key: 'privacy' },
                      ]}
                      onChange={props.onCheckedTermsValues}
                      style={{ fontSize: '13px' }}
                    />
                  </Box>
                  <Box align="center" justify="center" pad="small">
                    <Button
                      primary={true}
                      label={'Accept'}
                      style={{ borderRadius: '3px', color: '#fff' }}
                      disabled={props.waitForCheckTerms}
                      onClick={props.onAcceptTerms}
                    />
                  </Box>
                </>
              )}
            </>
          )}
          {(!props?.showSignUp?.status || (props?.success && props?.acceptedTerms)) && (
            <>
              <Box align="center" justify="center" pad="small">
                <Text weight="bold" size="xlarge">
                  {props.titleLabel}
                </Text>
              </Box>
              <Box direction="column">
                {props.providers.map(provider => (
                  <WalletProviderButton
                    direction="row"
                    gap="small"
                    align="center"
                    justify="between"
                    pad="small"
                    margin="small"
                    onClick={() => props.onProviderClick(provider.id)}
                    key={provider.id}
                    border={{ color: 'accent', side: 'all' }}
                    round="xxsmall"
                  >
                    <Box>{provider.logo}</Box>
                    <Box>
                      <Text color="accentColor">{provider.description}</Text>
                    </Box>
                    <Icon type="arrowRight" size="xs" />
                  </WalletProviderButton>
                ))}
              </Box>
            </>
          )}
        </Box>
      </ModalCard>
    </ModalContainer>
  );
};

export default ProvidersListModal;
