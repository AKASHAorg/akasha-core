import React from 'react';
import { isMobileOnly } from 'react-device-detect';
import { Box, Text, FormField, RadioButtonGroup } from 'grommet';

import ReportSuccessModal, { IReportSuccessModalProps } from './report-success-modal';

import Icon from '../Icon';
import { MainAreaCardBox } from '../EntryCard/basic-card-box';
import {
  StyledBox,
  StyledText,
  HiddenSpan,
  ModalButton,
  ModalWrapper,
  StyledTextArea,
  StyledReportModalBox,
} from '../ListModal/styled-modal';
import { useViewportSize } from '../Providers/viewport-dimension';
import useBodyScrollLock from '../../utils/use-body-scroll-lock';

export interface IReportModalProps extends IReportSuccessModalProps {
  titleLabel: string;
  optionsTitleLabel: string;
  optionLabels: string[];
  optionValues: string[];
  descriptionLabel: string;
  descriptionPlaceholder: string;

  // footer labels and links
  footerText1Label: string;
  footerLink1Label: string;
  footerUrl1: string;
  footerText2Label: string;
  footerLink2Label: string;
  footerUrl2: string;

  cancelLabel?: string;
  reportLabel?: string;
  errorText?: string;
  user?: string;
  itemType?: string;
  requesting: boolean;
  success: boolean;
  onReport: (data: Record<string, unknown>) => void;
}

const ReportModal: React.FC<IReportModalProps> = props => {
  const {
    className,
    titleLabel,
    successTitleLabel,
    successMessageLabel,
    optionsTitleLabel,
    optionLabels,
    optionValues,
    descriptionLabel,
    descriptionPlaceholder,
    footerText1Label,
    footerLink1Label,
    footerUrl1,
    footerText2Label,
    footerLink2Label,
    footerUrl2,
    cancelLabel,
    reportLabel,
    blockLabel,
    closeLabel,
    errorText,
    user,
    contentId,
    itemType,
    requesting,
    success,
    closeModal,
    onReport,
  } = props;

  const [reason, setReason] = React.useState<string>('');
  const [explanation, setExplanation] = React.useState('');
  const [rows, setRows] = React.useState(1);

  const hiddenSpanRef = React.useRef<HTMLSpanElement>(null);
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);

  useBodyScrollLock();

  const {
    size,
    dimensions: { width },
  } = useViewportSize();

  const handleChange = (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (textAreaRef.current && hiddenSpanRef.current) {
      hiddenSpanRef.current.textContent = ev.currentTarget.value.replace(/  +/g, ' ');
      // calculate the number of rows adding offset value
      const calcRows = Math.floor(
        (hiddenSpanRef.current.offsetWidth + 30) / textAreaRef.current.offsetWidth,
      );
      // check if text area is empty or not and set rows accordingly
      setRows(prevRows => (calcRows === 0 ? prevRows / prevRows : calcRows + 1));
    }
    setExplanation(ev.currentTarget.value.replace(/  +/g, ' '));
  };

  const handleReport = () => {
    // hard check: makes sure itemType is specified
    if (!itemType || itemType?.length < 1) {
      return closeModal();
    }

    // sign payload first before posting
    const dataToSign = {
      user,
      explanation: explanation.trim(),
      reason: optionValues[optionLabels.indexOf(reason)],
    };

    onReport(dataToSign);
  };

  if (success) {
    return (
      <ReportSuccessModal
        className={className}
        successTitleLabel={successTitleLabel}
        successMessageLabel={successMessageLabel}
        contentId={contentId}
        blockLabel={blockLabel}
        closeLabel={closeLabel}
        size={size}
        closeModal={closeModal}
      />
    );
  }

  return (
    <ModalWrapper isTransparent={true} isMobile={isMobileOnly} justify="center" align="center">
      <StyledBox width={width > 800 ? '35%' : width > 500 ? '50%' : '100%'}>
        <MainAreaCardBox className={className}>
          <StyledReportModalBox pad="large">
            <Box direction="row" margin={{ top: 'xsmall' }} align="start">
              {isMobileOnly && (
                <Icon
                  type="arrowLeft"
                  color="secondaryText"
                  primaryColor={true}
                  clickable={true}
                  onClick={closeModal}
                />
              )}
              <Text weight={600} margin={{ bottom: '1rem', horizontal: 'auto' }} size="large">
                {titleLabel}
              </Text>
              {!isMobileOnly && (
                <Icon
                  type="close"
                  color="secondaryText"
                  primaryColor={true}
                  clickable={true}
                  onClick={closeModal}
                />
              )}
            </Box>
            <StyledText
              margin={{ top: 'medium' }}
              weight="normal"
              color="secondaryText"
              size="medium"
              style={{ display: 'block' }}
            >
              {optionsTitleLabel}
              <Text color="accentText" margin="0 0 0 0.15rem">
                *
              </Text>
            </StyledText>
            <Box direction={optionLabels.length < 1 ? 'row' : 'column'}>
              {optionLabels.length < 1 && (
                <>
                  <Icon type="loading" accentColor={true} />
                  <Text size="large" margin={{ left: 'small' }}>
                    Fetching reasons...
                  </Text>
                </>
              )}
              <RadioButtonGroup
                gap={isMobileOnly ? 'medium' : 'xxsmall'}
                name="reasons"
                options={optionLabels}
                value={reason}
                onChange={(event: any) => setReason(event.target.value)}
              />
            </Box>
            <StyledText
              margin={{ top: 'medium' }}
              weight="normal"
              color="secondaryText"
              size="medium"
              style={{ display: 'block' }}
            >
              {descriptionLabel}
            </StyledText>
            <FormField name="name" htmlFor="text-input">
              <Box justify="between" direction="row" pad={{ top: 'xxsmall' }}>
                <HiddenSpan ref={hiddenSpanRef} />
                <StyledTextArea
                  ref={textAreaRef}
                  spellCheck={false}
                  autoFocus={true}
                  id="text-area-input"
                  value={explanation}
                  rows={rows}
                  maxLength={3000}
                  onChange={handleChange}
                  placeholder={descriptionPlaceholder}
                />
              </Box>
            </FormField>
            {/* display error message, if any */}
            {errorText?.length > 0 && <Text color="errorText">{errorText}</Text>}
            <Box margin={{ top: 'large' }}>
              <Text color="secondaryText" size="medium" margin={{ bottom: 'medium' }}>
                {footerText1Label}{' '}
                <Text
                  color="accentText"
                  size="medium"
                  style={{ cursor: 'pointer' }}
                  onClick={() =>
                    window.open(footerUrl1, footerLink1Label, '_blank noopener noreferrer')
                  }
                >
                  {footerLink1Label}{' '}
                </Text>
                {footerText2Label}{' '}
                <Text
                  color="accentText"
                  size="medium"
                  style={{ cursor: 'pointer' }}
                  onClick={() =>
                    window.open(footerUrl2, footerLink2Label, '_blank noopener noreferrer')
                  }
                >
                  {footerLink2Label}{' '}
                </Text>
              </Text>
            </Box>
            <Box width="100%" direction="row" justify="end">
              <ModalButton
                margin={{ right: '0.5rem' }}
                label={cancelLabel}
                isMobile={isMobileOnly}
                onClick={closeModal}
              />
              <ModalButton
                primary={true}
                label={reportLabel}
                isMobile={isMobileOnly}
                onClick={handleReport}
                disabled={requesting || !reason.length}
              />
            </Box>
          </StyledReportModalBox>
        </MainAreaCardBox>
      </StyledBox>
    </ModalWrapper>
  );
};

ReportModal.defaultProps = {
  cancelLabel: 'Cancel',
  reportLabel: 'Report',
};

export default ReportModal;
