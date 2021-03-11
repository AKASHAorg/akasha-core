import React from 'react';
import { useToasts } from 'react-toast-notifications';
import { Box, Text, FormField, RadioButtonGroup } from 'grommet';

import { MainAreaCardBox } from '../../Cards';
import { Button } from '../../Buttons';
import { Icon } from '../../Icon';

import { ModalWrapper } from '../common/styled-modal';

import { HiddenSpan, StyledBox, StyledText, StyledTextArea } from '../styled';
import { useViewportSize } from '../../Providers/viewport-dimension';

export interface IModerateModalProps {
  className?: string;
  titleLabel: string;
  altTitleLabel: string;
  contentType: string;

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
  contentId?: string;
  baseUrl: string;
  isReview?: boolean;
  // fetch pending items on modalClose
  onModalClose: () => void;
  closeModal: () => void;
  signData: (data: object | string) => any;
}

const ModerateModal: React.FC<IModerateModalProps> = props => {
  const {
    className,
    titleLabel,
    altTitleLabel,
    contentType,
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
    contentId,
    baseUrl,
    isReview,
    onModalClose,
    closeModal,
    signData,
  } = props;

  const [explanation, setExplanation] = React.useState('');
  const [requesting, setRequesting] = React.useState(false);
  const [action, setAction] = React.useState('Delist');
  const [rows, setRows] = React.useState(1);

  const hiddenSpanRef = React.useRef<HTMLSpanElement>(null);
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);

  const { addToast } = useToasts();

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
    setAction('');
    setExplanation('');
    return closeModal();
  };

  const postData = async (url = '', data = {}) => {
    const rheaders = new Headers();
    rheaders.append('Content-Type', 'application/json');

    // sign payload first before posting
    signData(data).subscribe(async (resp: any) => {
      const signedData = {
        ...resp.data,
        serializedData: btoa(String.fromCharCode.apply(null, resp.data.serializedData)),
        signature: btoa(String.fromCharCode.apply(null, resp.data.signature)),
      };

      const { status } = await fetch(url, {
        method: 'POST',
        headers: rheaders,
        body: JSON.stringify({ ...data, ...signedData }),
      });

      try {
        if (status === 400) {
          throw new Error('Bad request. Please try again later');
        } else if (status === 403) {
          throw new Error('You are not authorized to perform this operation');
        } else if (status === 409) {
          throw new Error('This content has already been moderated by you');
        } else if (status === 500) {
          throw new Error('Unable to process your request right now. Please try again later');
        }

        addToast('Content successfully moderated', {
          appearance: 'success',
        });
        return onModalClose();
      } catch (error) {
        setRequesting(false);
        return addToast(error.message, {
          appearance: 'error',
        });
      }
    });
  };

  const handleModerate = (isDelisted: boolean = true) => () => {
    const dataToPost = {
      contentId,
      contentType,
      moderator: user,
      delisted: isDelisted,
      explanation: explanation.trim(),
    };

    setRequesting(true);

    // @TODO: connect with moderation endpoint
    return postData(baseUrl, dataToPost);
  };

  return (
    <ModalWrapper>
      <StyledBox width={width > 800 ? '35%' : width > 500 ? '50%' : '100%'}>
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
                {isReview ? altTitleLabel : titleLabel}
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
                {size !== 'small' && (
                  <Button margin={{ right: '0.5rem' }} label={cancelLabel} onClick={handleCancel} />
                )}
                <Button
                  primary={true}
                  label={action}
                  fill={size === 'small' ? true : false}
                  onClick={
                    optionValues[optionLabels.indexOf(action)] === 'Delist'
                      ? handleModerate()
                      : handleModerate(false)
                  }
                  disabled={requesting || !explanation.length || !action.length}
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
