import React from 'react';
import { useNavigate } from 'react-router-dom';

import InputTags from './input-tags';

import { License } from '../utils/licenses';

import { Profile } from '@akashaorg/typings/ui';

import EditorMeter from '@akashaorg/design-system-core/lib/components/EditorMeter';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Image from '@akashaorg/design-system-core/lib/components/Image';
import ImageCropper, {
  ImageCropperProps,
} from '@akashaorg/design-system-core/lib/components/ImageCropper';

export interface ImageSrc {
  src: { url?: string; fallbackUrl?: string } | null;
  type?: string;
  prefix: string | null;
  preview?: string;
  isUrl: boolean;
}

export type CardFormValues = {
  coverImage: ImageSrc | null;
  description: string;
  newTag: string;
  tags: string[];
  license: string;
};

export type KeyPressEvent = {
  key?: string;
  code?: string;
  keyCode?: number;
  target: EventTarget & { value?: string };
};

export interface IArticleCardSettingsProps extends ImageCropperProps {
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
  tagSuggestions: string[];
  licenseLabel: string;
  licenseSubtitleLabel: string;
  licensesArr: string[];
  selectLicensePlaceholder: string;
  selectedLicense: License;
  saveDraftLabel: string;
  confirmLabel: string;
  onUploadClick: () => void;
  onCoverImageUpload: (ev: React.ChangeEvent<HTMLInputElement>) => void;
  onClickEditImage: () => void;
  onDescriptiveTextChange: (value: string) => void;
  onAddTag: (tag: string) => void;
  onTagInputChange: (value: string) => void;
  onTargetKeyDown: (ev: KeyPressEvent) => void;
  onClickTag: (tag: string) => () => void;
  onSelectLicense: (license: string) => void;
  onClickSaveDraft: () => void;
  onClickConfirm: () => void;
}

const SectionWrapper: React.FC<{ topBorderOnly?: boolean; children: React.ReactNode }> = props => {
  const { topBorderOnly, children } = props;
  return (
    <Box customStyle={`flex p-4 gap-1 border(${topBorderOnly ? 't' : 'y'} grey8 dark:grey3)`}>
      {children}
    </Box>
  );
};

const InputWrapper: React.FC<{ children: React.ReactNode; accentBorder?: boolean }> = props => {
  const { children, accentBorder } = props;

  return (
    <Box
      customStyle={`flex my-1 w-full p-1 rounded-sm border(${
        accentBorder ? 'secondaryLight dark: secondaryDark' : 'grey8 dark:grey3'
      })`}
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
    tagSuggestions = [],
    licenseLabel,
    licenseSubtitleLabel,
    licensesArr,
    selectLicensePlaceholder,
    selectedLicense,
    saveDraftLabel,
    confirmLabel,
    onUploadClick,
    onCoverImageUpload,
    onClickEditImage,
    onDescriptiveTextChange,
    onAddTag,
    onTagInputChange,
    onTargetKeyDown,
    onClickTag,
    onSelectLicense,
    onClickSaveDraft,
    onClickConfirm,
  } = props;

  const tagBoxRef = React.useRef();

  const navigate = useNavigate();

  const handleClickIcon = () => {
    navigate(-1);
  };

  return (
    <Card>
      <Box customStyle="flex flex-row p-4 w-full">
        <button onClick={handleClickIcon}>
          <Icon type="ChevronLeftIcon" />
        </button>
        <Text variant="h2">{titleLabel}</Text>
      </Box>
      <SectionWrapper>
        <Box customStyle="flex flex-row items-center gap-1">
          <Text variant="h2">{addCoverImageLabel}</Text>
          <Text variant="subtitle1">{`(${optionalLabel})`}</Text>
        </Box>
        <Box customStyle="flex flex-row items-center justify-between">
          <Text variant="subtitle1">{coverImageSubtitleLabel}</Text>
          <Button size="lg" label={uploadLabel} customStyle="ml-6" onClick={onUploadClick} />
          <input
            style={{ display: 'none' }}
            onChange={onCoverImageUpload}
            type="file"
            accept="image/*"
            ref={coverImageInputRef}
          />
        </Box>
        {!showCropper && (
          <Box customStyle="flex w-full h-[8.55rem] rounded-sm justify-center items-center mx-1 relative bg(secondaryLight/20 dark:secondaryDark/20)">
            {!formValues.coverImage && <Text variant="subtitle2">{coverImagePlaceholder}</Text>}

            {formValues.coverImage && (
              <>
                <Box
                  customStyle="flex p-0.5 rounded-sm border(secondaryLight dark:secondaryDark) absolute top-2 right-2"
                  onClick={onClickEditImage}
                >
                  <Icon type="integrationAppCTA" accentColor={true} />
                </Box>
                <Image
                  customStyle="w-full object-cover rounded-sm"
                  src={formValues.coverImage?.src.url}
                />
              </>
            )}
          </Box>
        )}
        {showCropper && (
          <Box customStyle="flex my-1">
            <ImageCropper {...props} />
          </Box>
        )}
      </SectionWrapper>
      <SectionWrapper>
        <Box customStyle="flex flex-row items-center gap-1">
          <Text variant="h2">{addDescriptiveTextLabel}</Text>
          <Text variant="subtitle1">{`(${optionalLabel})`}</Text>
        </Box>
        <Text variant="subtitle1">{descriptiveTextSubtitleLabel}</Text>
        <InputWrapper>
          <textarea
            rows={2}
            id="article-card-settings-description"
            name="description"
            value={formValues.description}
            onChange={ev => onDescriptiveTextChange(ev.target.value)}
            placeholder={descriptiveTextPlaceholder}
          />
          <Box customStyle="flex w-fit self-end mt-1">
            <EditorMeter value={charCount} max={MAX_CHARS} />
          </Box>
        </InputWrapper>
      </SectionWrapper>
      <SectionWrapper>
        <Text variant="h2">{tagsLabel}</Text>
        <Text variant="subtitle1">{tagsSubtitleLabel}</Text>
        <InputWrapper accentBorder={formValues.tags.length > 0}>
          <Box customStyle="flex flex-row items-center flex-wrap" ref={tagBoxRef}>
            <InputTags values={formValues.tags} onClickTag={onClickTag} />
            <Box customStyle="flex m-1 min-w-[150px]">
              {/* TODO: search input with suggestions dropdown */}
              {/* <StyledTextInput
                type="search"
                plain
                dropTarget={tagBoxRef.current}
                placeholder={formValues.tags.length > 0 ? '' : tagPlaceholder}
                suggestions={tagSuggestions}
                onKeyDown={onTargetKeyDown}
                onChange={(ev: { target: { value: string } }) => onTagInputChange(ev.target.value)}
                value={formValues.newTag}
                onSuggestionSelect={(event: { suggestion: string }) => onAddTag(event.suggestion)}
              /> */}
            </Box>
          </Box>
        </InputWrapper>
      </SectionWrapper>
      <SectionWrapper topBorderOnly>
        <Text variant="h2">{licenseLabel}</Text>
        <Text variant="subtitle1">{licenseSubtitleLabel}</Text>
        {/* TODO select core component */}
        {/* <Select
          options={licensesArr}
          value={formValues.license}
          placeholder={selectLicensePlaceholder}
          onChange={({ option }) => onSelectLicense(option)}
        /> */}
        {selectedLicense && (
          <Box customStyle="flex flex-row items-center mt-2 px-1">
            <Icon type={selectedLicense.icon} size="lg" accentColor={true} />
            <Box customStyle="flex gap-1">
              {selectedLicense.description.map((el, idx) => (
                <Box key={idx} customStyle="flex flex-row gap-2">
                  {el.icon && <Icon type={el.icon} size="sm" accentColor={true} />}
                  <Text variant="subtitle2">{el.text}</Text>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </SectionWrapper>
      <Box customStyle="flex flex-row w-full justify-end items-center p-4 gap-2">
        <Button size="lg" label={saveDraftLabel} onClick={onClickSaveDraft} />
        <Button size="lg" variant="primary" label={confirmLabel} onClick={onClickConfirm} />
      </Box>
    </Card>
  );
};

export default ArticleCardSettings;
