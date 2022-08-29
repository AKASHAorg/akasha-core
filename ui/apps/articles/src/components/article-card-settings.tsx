import React from 'react';
import { useNavigate } from 'react-router-dom';

import DS from '@akashaorg/design-system';

import { IImageSrc } from '@akashaorg/design-system/lib/components/BoxFormCard';
import { IImageCropperProps } from '@akashaorg/design-system/lib/components/ImageCropper';

import { StyledButton, StyledImageInput, StyledInput, StyledTextArea } from './styled';

const { Box, EditorMeter, Icon, Image, ImageCropper, MainAreaCardBox, Select, Text } = DS;

export type CardFormValues = {
  coverImage: IImageSrc | null;
  description: string;
  newTag: string;
  tags: string[];
  license: string;
};

export type KeyPressEvent = {
  key?: string;
  code?: string;
  target: EventTarget & { value?: string };
};

type LicenseDescription = { icon: string; text: string };

export interface IArticleCardSettingsProps extends IImageCropperProps {
  formValues: CardFormValues;
  titleLabel: string;
  addCoverImageLabel: string;
  optionalLabel: string;
  coverImageSubtitleLabel: string;
  coverImageInputRef: React.RefObject<HTMLInputElement>;
  uploadLabel: string;
  coverImagePlaceholder: string;
  showCropper: boolean;
  addDescriptiveTextLabel: string;
  descriptiveTextSubtitleLabel: string;
  descriptiveTextPlaceholder: string;
  charCount: number;
  tagsLabel: string;
  tagsSubtitleLabel: string;
  tagPlaceholder: string;
  licenseLabel: string;
  licenseSubtitleLabel: string;
  licensesArr: string[];
  selectLicensePlaceholder: string;
  selectedLicenseDescriptionArr: LicenseDescription[];
  saveDraftLabel: string;
  confirmLabel: string;
  onUploadClick: () => void;
  onCoverImageUpload: (ev: React.ChangeEvent<HTMLInputElement>) => void;
  onClickEditImage: () => void;
  onDescriptiveTextChange: (value: string) => void;
  onTagInputChange: (value: string) => void;
  onTargetKeyPress: (ev: KeyPressEvent) => void;
  onClickTag: (tag: string) => () => void;
  onSelectLicense: (license: string) => void;
  onClickSaveDraft: () => void;
  onClickConfirm: () => void;
}

const SectionWrapper: React.FC<{ topBorderOnly?: boolean; children: React.ReactNode }> = props => {
  const { topBorderOnly, children } = props;
  return (
    <Box
      pad="medium"
      gap="xsmall"
      border={{ side: topBorderOnly ? 'top' : 'horizontal', color: 'border' }}
    >
      {children}
    </Box>
  );
};

const InputWrapper: React.FC<{ children: React.ReactNode }> = props => {
  const { children } = props;

  return (
    <Box
      fill="horizontal"
      pad="xsmall"
      round="0.25rem"
      color="secondaryText"
      border={{ color: 'border' }}
      margin={{ vertical: 'xsmall' }}
    >
      {children}
    </Box>
  );
};

export const MAX_CHARS = 96;

const ArticleCardSettings: React.FC<IArticleCardSettingsProps> = props => {
  const {
    formValues,
    titleLabel,
    addCoverImageLabel,
    optionalLabel,
    coverImageSubtitleLabel,
    coverImageInputRef,
    uploadLabel,
    coverImagePlaceholder,
    showCropper,
    addDescriptiveTextLabel,
    descriptiveTextSubtitleLabel,
    descriptiveTextPlaceholder,
    charCount,
    tagsLabel,
    tagsSubtitleLabel,
    tagPlaceholder,
    licenseLabel,
    licenseSubtitleLabel,
    licensesArr,
    selectLicensePlaceholder,
    selectedLicenseDescriptionArr,
    saveDraftLabel,
    confirmLabel,
    onUploadClick,
    onCoverImageUpload,
    onClickEditImage,
    onDescriptiveTextChange,
    onTagInputChange,
    onTargetKeyPress,
    onClickTag,
    onSelectLicense,
    onClickSaveDraft,
    onClickConfirm,
  } = props;

  const navigate = useNavigate();

  const handleClickIcon = () => {
    navigate(-1);
  };

  return (
    <MainAreaCardBox>
      <Box direction="row" pad="medium" fill="horizontal">
        <Icon type="chevronLeft" style={{ cursor: 'pointer' }} onClick={handleClickIcon} />
        <Text size="xlarge" weight="bold">
          {titleLabel}
        </Text>
      </Box>
      <SectionWrapper>
        <Box direction="row" align="center" gap="xsmall">
          <Text size="xlarge" weight="bold">
            {addCoverImageLabel}
          </Text>
          <Text size="medium" color="secondaryText">
            {`(${optionalLabel})`}
          </Text>
        </Box>
        <Box direction="row" justify="between" align="center">
          <Text size="large" color="secondaryText">
            {coverImageSubtitleLabel}
          </Text>
          <StyledButton
            size="large"
            height={2.5}
            label={
              <>
                <StyledImageInput
                  onChange={onCoverImageUpload}
                  type="file"
                  accept="image/*"
                  ref={coverImageInputRef}
                />
                <Text size="large">{uploadLabel}</Text>
              </>
            }
            margin={{ left: 'large' }}
            onClick={onUploadClick}
          />
        </Box>
        {!showCropper && (
          <Box
            fill="horizontal"
            height="8.55rem"
            round="0.25rem"
            background="activePanelBackground"
            justify="center"
            align="center"
            margin={{ vertical: 'xsmall' }}
            style={{ position: 'relative' }}
          >
            {!formValues.coverImage.preview && (
              <Text size="large" color="secondaryText">
                {coverImagePlaceholder}
              </Text>
            )}

            {formValues.coverImage.preview && (
              <>
                <Box
                  pad="xxsmall"
                  round="0.15rem"
                  border={{ color: 'accent' }}
                  style={{ position: 'absolute', right: '0.5rem', top: '0.5rem' }}
                  onClick={onClickEditImage}
                >
                  <Icon type="integrationAppCTA" accentColor={true} />
                </Box>
                <Image
                  fill="horizontal"
                  src={formValues.coverImage.preview}
                  fit="cover"
                  style={{ borderRadius: '0.25rem' }}
                />
              </>
            )}
          </Box>
        )}
        {showCropper && (
          <Box margin={{ vertical: 'xsmall' }}>
            <ImageCropper hasPadding={false} isLoading={false} {...props} />
          </Box>
        )}
      </SectionWrapper>
      <SectionWrapper>
        <Box direction="row" align="center" gap="xsmall">
          <Text size="xlarge" weight="bold">
            {addDescriptiveTextLabel}
          </Text>
          <Text size="medium" color="secondaryText">
            {`(${optionalLabel})`}
          </Text>
        </Box>
        <Text size="large" color="secondaryText">
          {descriptiveTextSubtitleLabel}
        </Text>
        <InputWrapper>
          <StyledTextArea
            resize={false}
            size="large"
            rows={2}
            id="article-card-settings-description"
            name="description"
            value={formValues.description}
            onChange={ev => onDescriptiveTextChange(ev.target.value)}
            placeholder={descriptiveTextPlaceholder}
          />
          <Box width="fit-content" alignSelf="end" margin={{ top: 'xsmall' }}>
            <EditorMeter counter={charCount} maxValue={MAX_CHARS} />
          </Box>
        </InputWrapper>
      </SectionWrapper>
      <SectionWrapper>
        <Text size="xlarge" weight="bold">
          {tagsLabel}
        </Text>
        <Text size="large" color="secondaryText">
          {tagsSubtitleLabel}
        </Text>
        <InputWrapper>
          <StyledInput
            id="article-card-settings-tag"
            name="tag"
            value={formValues.newTag}
            onChange={ev => onTagInputChange(ev.target.value)}
            onKeyPress={ev => onTargetKeyPress(ev)}
            placeholder={tagPlaceholder}
          />
        </InputWrapper>
        <Box direction="row" wrap={true} gap="xsmall">
          {formValues.tags.map((tag, idx) => (
            <Box
              key={idx}
              direction="row"
              round="1rem"
              gap="xxsmall"
              margin={{ bottom: 'small' }}
              pad={{
                horizontal: 'xsmall',
                vertical: '1.5px',
              }}
              border={{ color: 'secondaryText' }}
              onClick={onClickTag(tag)}
            >
              <Text color="secondaryText">{tag}</Text>
            </Box>
          ))}
        </Box>
      </SectionWrapper>
      <SectionWrapper topBorderOnly>
        <Text size="xlarge" weight="bold">
          {licenseLabel}
        </Text>
        <Text size="large" color="secondaryText">
          {licenseSubtitleLabel}
        </Text>
        <Select
          options={licensesArr}
          value={formValues.license}
          placeholder={selectLicensePlaceholder}
          onChange={({ option }) => onSelectLicense(option)}
        />
        {selectedLicenseDescriptionArr &&
          selectedLicenseDescriptionArr.map((el, idx) => (
            <Text key={idx} size="medium" color="secondaryText">
              {el.text}
            </Text>
          ))}
      </SectionWrapper>
      <Box direction="row" fill="horizontal" justify="end" align="center" pad="medium" gap="small">
        <StyledButton size="large" height={2.5} label={saveDraftLabel} onClick={onClickSaveDraft} />
        <StyledButton
          size="large"
          height={2.5}
          primary={true}
          label={confirmLabel}
          onClick={onClickConfirm}
        />
      </Box>
    </MainAreaCardBox>
  );
};

export default ArticleCardSettings;
