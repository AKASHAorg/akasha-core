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
} from '../ListModal/styled-modal';
import { useViewportSize } from '../Providers/viewport-dimension';

export interface IReportModalProps extends IReportSuccessModalProps {
  titleLabel: string;
  optionsTitleLabel: string;
  optionLabels: string[];
  optionValues: string[];
  descriptionLabel: string;
  descriptionPlaceholder: string;
  footerText1Label: string;
  footerLink1Label: string;
  footerUrl1: string;
  cancelLabel?: string;
  reportLabel?: string;
  user?: string;
  contentType?: string;
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
    cancelLabel,
    reportLabel,
    blockLabel,
    closeLabel,
    user,
    contentId,
    contentType,
    requesting,
    success,
    updateEntry,
    closeModal,
    onReport,
  } = props;

  const [reason, setReason] = React.useState<string>('');
  const [explanation, setExplanation] = React.useState('');
  const [rows, setRows] = React.useState(1);

  const hiddenSpanRef = React.useRef<HTMLSpanElement>(null);
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);

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

  const handleCancel = () => {
    setReason('');
    setExplanation('');
    return closeModal();
  };

  const handleReport = () => {
    // hard check: makes sure contentType is specified
    if (!contentType || contentType?.length < 1) {
      return handleCancel();
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
        updateEntry={updateEntry}
        closeModal={closeModal}
      />
    );
  }

  return (
    <ModalWrapper isMobile={isMobileOnly}>
      <StyledBox width={width > 800 ? '35%' : width > 500 ? '50%' : '100%'}>
        <MainAreaCardBox className={className}>
          <Box direction="column" pad="large">
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
            >
              {optionsTitleLabel}
              <Text color="accentText" margin="0 0 0 0.15rem">
                *
              </Text>
            </StyledText>
            <Box direction="column">
              <RadioButtonGroup
                gap="xxsmall"
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
            <Box margin={{ top: 'medium' }}>
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
              </Text>
            </Box>
            <Box width="100%" direction="row" justify="end">
              <ModalButton
                margin={{ right: '0.5rem' }}
                label={cancelLabel}
                isMobile={isMobileOnly}
                onClick={handleCancel}
              />
              <ModalButton
                primary={true}
                label={reportLabel}
                isMobile={isMobileOnly}
                onClick={handleReport}
                disabled={requesting || !reason.length}
              />
            </Box>
          </Box>
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
