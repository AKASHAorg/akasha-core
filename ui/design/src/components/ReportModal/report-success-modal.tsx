import React from 'react';
import { Anchor, Box, Text } from 'grommet';

import Icon from '../Icon';
import { MainAreaCardBox } from '../EntryCard/basic-card-box';
import { StyledBox, ModalWrapper } from '../ListModal/styled-modal';

export interface IReportSuccessModalProps {
  className?: string;
  successTitleLabel: string;
  successMessageLabel: string;
  reason: string;
  reasonPrefix: string;
  contentId: string;
  footerLabel: string;
  footerCTAUrl: string;
  footerCTALabel: string;
  // screen size passed by viewport provider
  size?: string;
  closeModal: () => void;
}

const ReportSuccessModal: React.FC<IReportSuccessModalProps> = props => {
  const {
    className,
    successTitleLabel,
    successMessageLabel,
    reason,
    reasonPrefix,
    contentId,
    footerLabel,
    footerCTAUrl,
    footerCTALabel,
    size,
    closeModal,
  } = props;

  const handleModalClose =
    (blockUser = false) =>
    () => {
      if (blockUser) {
        /* @todo: replace with handler to block account */
      }
      closeModal();
    };

  const handleCopy = (value: string) => () => {
    navigator.clipboard.writeText(value);
  };

  return (
    <ModalWrapper isTransparent={true} justify="center" align="center">
      <StyledBox width={size === 'small' ? '90%' : '33%'}>
        <MainAreaCardBox className={className} style={{ position: 'relative' }}>
          <Icon
            type="close"
            onClick={handleModalClose(false)}
            style={{ position: 'absolute', right: '0.75rem', top: '0.75rem', cursor: 'pointer' }}
          />
          <Box direction="column" pad="large" gap="xlarge" align="center">
            <Box margin={{ top: 'small' }}>
              <Text weight={600} size="large" textAlign="center">
                {successTitleLabel}
              </Text>
              <Text weight="normal" color="secondaryText" size="large" textAlign="center">
                {successMessageLabel}
              </Text>
            </Box>

            <Box width="fit-content" align="center">
              <Box round="0.125rem" background="hoverBackground">
                <Text as="span" color="accentText" size="large" weight={600}>
                  {reason}
                </Text>
              </Box>

              <Box direction="row" gap="xsmall">
                <Text size="large">{`${reasonPrefix}-${contentId}`}</Text>
                <Icon
                  type="copy"
                  color="secondaryText"
                  style={{ cursor: 'pointer' }}
                  onClick={handleCopy(contentId)}
                />
              </Box>
            </Box>

            <Box align="center">
              <Text size="medium">{footerLabel}</Text>
              <Box direction="row" align="center" gap="xxsmall">
                <Icon size="xs" type="discord" />
                <Anchor
                  href={footerCTAUrl}
                  size="medium"
                  weight="normal"
                  target="_blank"
                  color="accentText"
                  style={{ textDecoration: 'none' }}
                >
                  {footerCTALabel}
                </Anchor>
              </Box>
            </Box>
          </Box>
        </MainAreaCardBox>
      </StyledBox>
    </ModalWrapper>
  );
};

export default ReportSuccessModal;
