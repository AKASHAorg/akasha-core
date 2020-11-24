import React from 'react';
import { useToasts } from 'react-toast-notifications';
import { Box, Text, RadioButton, FormField } from 'grommet';

import { MainAreaCardBox } from '../../Cards/common/basic-card-box';
import { ModalWrapper } from '../common/styled-modal';
import { Button } from '../../Buttons';
import { Icon } from '../../Icon';

import { HiddenSpan, StyledBox, StyledText, StyledTextArea } from '../styled';

export interface IModerateModalProps {
  className?: string;
  titleLabel: string;
  contentType: string;
  optionsTitleLabel: string;
  optionLabels: string[];
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
  user?: string;
  contentId?: string;
  // screen size passed by viewport provider
  size?: string;
  closeModal: () => void;
}

const ModerateModal: React.FC<IModerateModalProps> = props => {
  const {
    className,
    titleLabel,
    contentType,
    optionsTitleLabel,
    optionLabels,
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
    user,
    contentId,
    size,
    closeModal,
  } = props;

  const [reasons, setReasons] = React.useState<string[]>([]);
  const [explanation, setExplanation] = React.useState('');
  const [requesting, setRequesting] = React.useState(false);
  const [rows, setRows] = React.useState(1);

  const hiddenSpanRef = React.useRef<HTMLSpanElement>(null);
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);

  const { addToast } = useToasts();

  const handleSelectReason = (selected: string) => {
    if (!reasons.includes(selected)) {
      setReasons(reasons.concat(selected));
    }
  };

  const handleClickReason = (clicked: string) => {
    if (reasons.includes(clicked)) {
      setReasons(reasons.filter(reasn => reasn !== clicked));
    }
  };

  const handleChange = (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (textAreaRef.current && hiddenSpanRef.current) {
      hiddenSpanRef.current.textContent = ev.currentTarget.value;
      // calculate the number of rows adding offset value
      const calcRows = Math.floor(
        (hiddenSpanRef.current.offsetWidth + 30) / textAreaRef.current.offsetWidth,
      );
      // check if text area is empty or not and set rows accordingly
      setRows(prevRows => (calcRows === 0 ? prevRows / prevRows : calcRows + 1));
    }
    setExplanation(ev.currentTarget.value);
  };

  const handleCancel = () => {
    setReasons([]);
    setExplanation('');
    return closeModal();
  };

  const postData = async (url = '', data = {}) => {
    const rheaders = new Headers();
    rheaders.append('Content-Type', 'application/json');

    const response = await fetch(url, {
      method: 'POST',
      headers: rheaders,
      body: JSON.stringify(data),
    });
    return response.status;
  };

  const handleModerate = () => {
    const dataToPost = {
      user,
      contentId,
      reasons,
      explanation,
    };

    setRequesting(true);

    // @TODO: connect with moderation endpoint
    postData('https://akasha-mod.herokuapp.com/', dataToPost)
      .then(status => {
        setRequesting(false);
        if (status === 409) {
          throw new Error('This content has already been flagged by you');
        } else if (status === 500) {
          throw new Error('Unable to process your request right now. Please try again later');
        }
      })
      .catch(error => {
        setRequesting(false);
        return addToast(error.message, {
          appearance: 'error',
        });
      });
  };

  return (
    <ModalWrapper>
      <StyledBox width={size === 'small' ? '100%' : '33%'}>
        <MainAreaCardBox className={className}>
          <Box direction="column" pad="large">
            <Box direction="row" margin={{ top: 'xsmall' }} align="start">
              {size === 'small' && (
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
              {size !== 'small' && (
                <Icon
                  type="close"
                  color="secondaryText"
                  primaryColor={true}
                  clickable={true}
                  onClick={closeModal}
                />
              )}
            </Box>
            <MainAreaCardBox>
              {contentType === 'post' ? (
                <Box height="25rem">Insert Post EntryBox here ...</Box>
              ) : contentType === 'profile' ? (
                <Box height="25rem">Insert ProfileCard here ...</Box>
              ) : null}
            </MainAreaCardBox>
            {reportLabel === 'Delist' && (
              <>
                <StyledText
                  margin={{ top: 'medium' }}
                  weight="normal"
                  color="secondaryText"
                  size="medium"
                >
                  {optionsTitleLabel}
                  <Text color="accentText" margin={{ left: '0.15rem' }}>
                    *
                  </Text>
                </StyledText>
                <Box direction="column">
                  {optionLabels.map(label => (
                    <Box key={label} margin={{ top: 'xsmall' }}>
                      <RadioButton
                        name="prop"
                        checked={reasons.some(el => el === label)}
                        label={label}
                        onChange={() => handleSelectReason(label)}
                        onClick={() => handleClickReason(label)}
                      />
                    </Box>
                  ))}
                </Box>
              </>
            )}
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
                {footerText2Label}{' '}
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
            <Box width="100%" direction="row" justify="end">
              {size !== 'small' && (
                <Button margin={{ right: '0.5rem' }} label={cancelLabel} onClick={handleCancel} />
              )}
              <Button
                primary={true}
                label={reportLabel}
                fill={size === 'small' ? true : false}
                onClick={handleModerate}
                disabled={
                  requesting || !explanation.length
                    ? true
                    : reportLabel === 'Delist' && reasons.every(rsn => !rsn)
                    ? true
                    : false
                }
              />
            </Box>
          </Box>
        </MainAreaCardBox>
      </StyledBox>
    </ModalWrapper>
  );
};

ModerateModal.defaultProps = {
  cancelLabel: 'Cancel',
  reportLabel: 'Delist',
};

export default ModerateModal;
