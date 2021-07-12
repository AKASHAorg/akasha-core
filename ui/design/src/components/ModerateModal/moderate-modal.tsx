import React from 'react';
import { isMobileOnly } from 'react-device-detect';
import { Box, Text, FormField, RadioButtonGroup } from 'grommet';

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

export interface IModerateModalProps {
  className?: string;
  titleLabel: string;
  altTitleLabel: string;

  decisionLabel: string;
  optionLabels: string[];
  optionValues: string[];

  descriptionLabel: string;
  descriptionPlaceholder: string;
  footerText1Label: string;
  footerLink1Label: string;
  footerUrl1: string;
  cancelLabel?: string;
  user: string | null;
  requesting: boolean;
  // indicates if making a fresh or reviewing an existing decision
  isReview?: boolean;
  closeModal: () => void;
  onModerate: (data: Record<string, unknown>) => void;
}

const ModerateModal: React.FC<IModerateModalProps> = props => {
  const {
    className,
    titleLabel,
    altTitleLabel,
    decisionLabel,
    optionLabels,
    optionValues,
    descriptionLabel,
    descriptionPlaceholder,
    footerText1Label,
    footerLink1Label,
    footerUrl1,
    cancelLabel,
    user,
    requesting,
    isReview,
    closeModal,
    onModerate,
  } = props;

  const [explanation, setExplanation] = React.useState('');
  const [action, setAction] = React.useState('Delist');
  const [rows, setRows] = React.useState(1);

  const hiddenSpanRef = React.useRef<HTMLSpanElement>(null);
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);

  const {
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
    setAction('');
    setExplanation('');
    return closeModal();
  };

  const handleModerate = (isDelisted = true) => () => {
    // sign payload first before posting
    const dataToSign = {
      moderator: user,
      explanation: explanation.trim(),
      delisted: isDelisted,
    };

    onModerate(dataToSign);
  };

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
                {isReview ? altTitleLabel : titleLabel}
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
              margin={{ vertical: 'xsmall' }}
              weight="normal"
              color="secondaryText"
              size="medium"
            >
              {decisionLabel}
              <Text color="accentText" margin={{ left: '0.15rem' }}>
                *
              </Text>
            </StyledText>
            <Box direction="column">
              <RadioButtonGroup
                gap="xxsmall"
                name="action"
                options={optionLabels}
                value={action}
                onChange={(event: any) => setAction(event.target.value)}
              />
            </Box>
            <StyledText
              margin={{ top: 'medium' }}
              weight="normal"
              color="secondaryText"
              size="medium"
            >
              {descriptionLabel}
              <Text color="accentText" margin={{ left: '0.15rem' }}>
                *
              </Text>
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
            {!!action.length && (
              <Box width="100%" direction="row" justify="end">
                <ModalButton
                  margin={{ right: '0.5rem' }}
                  label={cancelLabel}
                  isMobile={isMobileOnly}
                  onClick={handleCancel}
                />
                <ModalButton
                  primary={true}
                  label={action}
                  isMobile={isMobileOnly}
                  onClick={
                    optionValues[optionLabels.indexOf(action)] === 'Delist'
                      ? handleModerate()
                      : handleModerate(false)
                  }
                  disabled={requesting || !explanation.trim().length || !action.length}
                />
              </Box>
            )}
          </Box>
        </MainAreaCardBox>
      </StyledBox>
    </ModalWrapper>
  );
};

ModerateModal.defaultProps = {
  cancelLabel: 'Cancel',
};

export default ModerateModal;
