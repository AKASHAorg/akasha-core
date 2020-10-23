import React from 'react';
import { Box, Text, RadioButton, FormField } from 'grommet';

import { MainAreaCardBox } from '../../Cards/common/basic-card-box';
import { ModalWrapper } from '../common/styled-modal';
import { Button } from '../../Buttons';
import { Icon } from '../../Icon';

import { StyledBox, StyledText, HiddenSpan, StyledTextArea } from './styled';
import ReportSuccessModal, { IReportSuccessModalProps } from './report-success-modal';

export interface IReportPostModalProps extends IReportSuccessModalProps {
  titleLabel: string;
  optionsTitleLabel: string;
  option1Label: string;
  option2Label: string;
  option3Label: string;
  option4Label: string;
  option5Label: string;
  option6Label: string;
  descriptionLabel: string;
  descriptionPlaceholder: string;
  footerText1Label: string;
  footerLink1Label: string;
  footerUrl1: string;
  footerText2Label: string;
  footerLink2Label: string;
  footerUrl2: string;
  cancelLabel?: string;
  reportLabel?: string;
}

const ReportPostModal: React.FC<IReportPostModalProps & { closeModal: () => void }> = props => {
  const {
    className,
    titleLabel,
    successTitleLabel,
    successMessageLabel,
    optionsTitleLabel,
    option1Label,
    option2Label,
    option3Label,
    option4Label,
    option5Label,
    option6Label,
    descriptionLabel,
    descriptionPlaceholder,
    footerText1Label,
    footerText2Label,
    footerLink1Label,
    footerLink2Label,
    footerUrl1,
    footerUrl2,
    cancelLabel,
    reportLabel,
    blockLabel,
    closeLabel,
    closeModal,
  } = props;

  const [reason, setReason] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [rows, setRows] = React.useState(0);
  const [success, setSuccess] = React.useState(false);

  const boxRef: React.Ref<HTMLDivElement> = React.useRef(null);
  const hiddenSpanRef: React.Ref<HTMLSpanElement> = React.useRef(null);

  const options: string[] = [
    option1Label,
    option2Label,
    option3Label,
    option4Label,
    option5Label,
    option6Label,
  ];

  const handleSelectReason = (selected: string) => {
    setReason(selected);
  };

  const handleChange = (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = ev.currentTarget.value;
    setDescription(value);
    if (boxRef.current && hiddenSpanRef.current) {
      hiddenSpanRef.current.textContent = value;
      return setRows(
        Math.ceil(hiddenSpanRef.current?.offsetWidth / (boxRef.current?.offsetWidth - 10)),
      );
    }
  };

  const handleCancel = () => {
    setReason('');
    setDescription('');
    return closeModal();
  };

  const handleReport = () => {
    //  @TODO: submit to api
    return setSuccess(true);
  };

  if (success)
    return (
      <ReportSuccessModal
        className={className}
        successTitleLabel={successTitleLabel}
        successMessageLabel={successMessageLabel}
        blockLabel={blockLabel}
        closeLabel={closeLabel}
        closeModal={closeModal}
      />
    );

  return (
    <ModalWrapper width="100%" height="100%">
      <StyledBox>
        <MainAreaCardBox className={className}>
          <Box direction="column" pad="large">
            <Box direction="row" margin={{ top: 'xsmall' }} align="start">
              <Text weight={600} margin={{ bottom: '1rem', horizontal: 'auto' }} size="large">
                {titleLabel}
              </Text>
              <Icon
                type="close"
                color="secondaryText"
                primaryColor={true}
                clickable={true}
                onClick={closeModal}
              />
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
              {options.map(label => (
                <Box key={label} margin={{ top: 'xsmall' }}>
                  <RadioButton
                    name="prop"
                    checked={reason === label}
                    label={label}
                    onChange={() => handleSelectReason(label)}
                  />
                </Box>
              ))}
            </Box>
            {reason.length > 0 && (
              <>
                <StyledText
                  margin={{ top: 'medium' }}
                  weight="normal"
                  color="secondaryText"
                  size="medium"
                >
                  {descriptionLabel}
                </StyledText>
                <FormField name="name" htmlFor="text-input">
                  <Box justify="between" direction="row" pad={{ top: 'small' }}>
                    <Box ref={boxRef} width="100%" justify="start" direction="row" align="center">
                      <HiddenSpan ref={hiddenSpanRef} />
                      <StyledTextArea
                        spellCheck={false}
                        autoFocus={true}
                        id="text-area-input"
                        value={description}
                        rows={rows}
                        onChange={handleChange}
                        placeholder={descriptionPlaceholder}
                      />
                    </Box>
                  </Box>
                </FormField>
              </>
            )}
            <Box margin={{ top: 'medium' }}>
              <Text color="secondaryText" size="medium" margin={{ bottom: 'medium' }}>
                {footerText1Label}
                <Text
                  color="accentText"
                  size="medium"
                  style={{ cursor: 'pointer' }}
                  onClick={() =>
                    window.open(footerUrl1, footerLink1Label, '_blank noopener noreferrer')
                  }
                >
                  {footerLink1Label}
                </Text>
                {footerText2Label}
                <Text
                  color="accentText"
                  size="medium"
                  style={{ cursor: 'pointer' }}
                  onClick={() =>
                    window.open(footerUrl2, footerLink2Label, '_blank noopener noreferrer')
                  }
                >
                  {footerLink2Label}
                </Text>
              </Text>
            </Box>
            <Box direction="row" alignSelf="end">
              <Button margin={{ right: '0.5rem' }} label={cancelLabel} onClick={handleCancel} />
              <Button
                primary={true}
                label={reportLabel}
                onClick={handleReport}
                disabled={reason.length < 1}
              />
            </Box>
          </Box>
        </MainAreaCardBox>
      </StyledBox>
    </ModalWrapper>
  );
};

ReportPostModal.defaultProps = {
  cancelLabel: 'Cancel',
  reportLabel: 'Report',
};

export default ReportPostModal;
