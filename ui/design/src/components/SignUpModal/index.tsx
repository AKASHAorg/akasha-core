import * as React from 'react';
import { Box, Button, CheckBoxGroup, Text } from 'grommet';

import { ModalContainer } from '../SignInModal/fullscreen-modal-container';

import LinkInput from '../TextInputIconForm';
import { ModalCard } from '../EntryCard/basic-card-box';
import { StyledDivider, StyledAnchor } from '../TextInputIconForm/styles';

const SignUpModal = (props: {
  onModalClose: () => void;
  inviteToken: string | null;
  submitted?: boolean;
  submitting?: boolean;
  onChange: (ev: React.ChangeEvent<HTMLInputElement>) => void;
  validateTokenFn?: (ev: any) => void;
  headerLabel?: string;
  subtitleLabel?: string;
  inputPlaceholder?: string;
  success?: boolean;
  hasError?: boolean;
  errorMsg?: string;
  acceptedTerms?: boolean;
  checkedTermsValues?: any;
  onCheckedTermsValues?: (ev: any) => void;
  waitForCheckTerms?: boolean;
  onAcceptTerms?: (ev: any) => void;
}) => {
  return (
    <ModalContainer onModalClose={props.onModalClose}>
      <ModalCard>
        <Box width={{ max: '22rem', min: '30ch' }}>
          {!props?.acceptedTerms && (
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
                <LinkInput inputValue={props.inviteToken || ''} {...props} />
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
                        target={'_blank'}
                      />{' '}
                      {'and'}
                      <StyledAnchor
                        size="medium"
                        href={'/legal/privacy-policy'}
                        label={' Privacy Policy. '}
                        target={'_blank'}
                      />
                      {'Please also acknowledge our'}
                      <StyledAnchor
                        size="medium"
                        href={'/legal/code-of-conduct'}
                        label={' Code of Conduct '}
                        target={'_blank'}
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
        </Box>
      </ModalCard>
    </ModalContainer>
  );
};

export default SignUpModal;
