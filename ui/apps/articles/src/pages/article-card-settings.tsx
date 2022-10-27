import React from 'react';
import { useTranslation } from 'react-i18next';

import DS from '@akashaorg/design-system';
import { useTagSearch } from '@akashaorg/ui-awf-hooks';
import { RootComponentProps } from '@akashaorg/typings/ui';
import { CropValue } from '@akashaorg/design-system/lib/components/ImageCropper';

import ArticleCardSettings, {
  CardFormValues,
  KeyPressEvent,
  MAX_CHARS,
} from '../components/article-card-settings';

import { licences } from '../utils/licenses';

const { getCroppedImage } = DS;

const ArticleCardSettingsPage: React.FC<RootComponentProps> = () => {
  // state values to handle image cropping
  const [coverImageCrop, setCoverImageCrop] = React.useState<CropValue>({
    x: 0,
    y: 0,
  });
  const [coverImageZoom, setCoverImageZoom] = React.useState<number>(1);
  const [showCropper, setShowCropper] = React.useState<boolean>(false);
  const [coverImageRotation /* setCoverImageRotation */] = React.useState<number>(0);
  const [coverImageCroppedAreaPixels, setCoverImageCroppedAreaPixels] = React.useState(null);
  const [coverImageSrc, setCoverImageSrc] = React.useState<{ url?: string; fallbackUrl?: string }>(
    null,
  );

  const [charCount, setCharCount] = React.useState<number>(0);
  const [formValues, setFormValues] = React.useState<CardFormValues>({
    coverImage: { src: { url: '', fallbackUrl: '' }, prefix: null, isUrl: false },
    description: '',
    newTag: '',
    tags: [],
    license: '',
  });

  const tagSearch = useTagSearch(formValues.newTag);

  const coverImageInputRef: React.RefObject<HTMLInputElement> = React.useRef(null);

  const { t } = useTranslation('app-articles');

  // extract and translate licenses
  const licensesArr = licences.map(license =>
    t('{{licenseLabel}}', { licenseLabel: license.label }),
  );

  // predefined zoom values
  const minZoom = 1;
  const maxZoom = 3;
  const zoomStep = 0.01;

  // target event keys, codes and keyCodes
  const evKeyCodes = [188, 186, 32, 13];
  const evKeys = [',', ';', ' ', 'Enter'];
  const evCodes = ['Comma', 'Semicolon', 'Space', 'Enter'];

  /**
   * Saves the image url or blob object to the defined state. It also checks if coverImageSrc state (which stores the original image and allows for repeated cropping) has been set.
   * @param src - Object
   * @param isUrl - boolean
   */
  const handleImageInsert = (src: Record<string, string>, isUrl: boolean) => {
    if (isUrl && src.hasOwnProperty('url')) {
      // set blob source to state if not already defined
      if (!coverImageSrc) {
        setCoverImageSrc(src as { url?: string; fallbackUrl?: string });
      }

      setFormValues({
        ...formValues,
        coverImage: { ...formValues.coverImage, src, isUrl, preview: src.url },
      });
    } else if (src instanceof Blob) {
      // set blob source to state if not already defined
      if (!coverImageSrc) {
        setCoverImageSrc({ url: URL.createObjectURL(src) });
      }

      setFormValues({
        ...formValues,
        coverImage: {
          ...formValues.coverImage,
          src: { url: src.url },
          isUrl,
          type: src.type,
          preview: URL.createObjectURL(src),
        },
      });
    }
  };

  /**
   * Triggers the hidden file upload input when the upload button is clicked.
   */
  const handleUploadClick = () => {
    const coverImageInput = coverImageInputRef.current;

    if (coverImageInput) {
      coverImageInput.click();
    }
  };

  /**
   * Calls the required function to save image to state only if there is an uploaded file.
   * @param ev - ChangeEvent
   */
  const handleCoverImageUpload = (ev: React.ChangeEvent<HTMLInputElement>) => {
    if (!(ev.target.files && ev.target.files[0])) {
      return;
    }
    const file: File = ev.target.files[0];
    handleImageInsert(file as unknown as Record<string, string>, false);
  };

  /**
   * Toggles the showCropper state value to true.
   */
  const handleEditImage = () => {
    setShowCropper(true);
  };

  /**
   * Resets all state values required for cropping.
   */
  const resetCropperFields = () => {
    // reset crop values
    setCoverImageCrop({ x: 0, y: 0 });
    // reset zoom values
    setCoverImageZoom(1);
    // reset cropped area values
    setCoverImageCroppedAreaPixels(null);

    // close cropper
    setShowCropper(false);
  };

  /**
   * Sets the croppedAreaPixels state value when any of the crop actions (drag, pan, zoom) is stopped, before the crop is saved.
   */
  const handleCoverImageCropComplete = React.useCallback((_, croppedAreaPixels) => {
    setCoverImageCroppedAreaPixels(croppedAreaPixels);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Calls the utility function that does the actual image cropping, given the right parameters. Then it saves the returned cropped image to state and resets the cropper fields.
   */
  const handleCropCoverImage = React.useCallback(async () => {
    try {
      const [cropped] = await getCroppedImage(
        coverImageSrc.url || coverImageSrc.fallbackUrl,
        coverImageCroppedAreaPixels,
        coverImageRotation,
        formValues.coverImage.type,
      );

      handleImageInsert(cropped as unknown as Record<string, string>, false);

      resetCropperFields();
    } catch (e) {
      console.error(e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coverImageCroppedAreaPixels, coverImageRotation]);

  /**
   * Handles zoom in action.
   * @returns
   */
  const handleZoomInClick = () => {
    // if value of the respective field's zoom is equal to or exceeds the predefined maxZoom value, return
    if (coverImageZoom >= maxZoom) return;
    setCoverImageZoom(prev => prev + zoomStep);
  };

  /**
   * Handles zoom out action.
   * @returns
   */
  const handleZoomOutClick = () => {
    // if value of the respective field's zoom is equal to or less than the predefined minZoom value, return
    if (coverImageZoom <= minZoom) return;
    setCoverImageZoom(prev => prev - zoomStep);
  };

  /**
   * Handles user input on the descriptive text field.
   * @param value -  string
   * @returns
   */
  const handleDescriptiveTextChange = (value: string) => {
    // get number of typed characters
    const _charCount = value.split('').length;

    if (_charCount <= MAX_CHARS) {
      setFormValues({ ...formValues, description: value });
      setCharCount(_charCount);
    }
    return;
  };

  /**
   * Inserts a new tag to the slice of state, if value is not empty, then resets the input value.
   * @param tag -  string
   * @returns
   */
  const handleAddTag = (tag: string) => {
    setFormValues({
      ...formValues,
      // prevents the addition of empty string tag or an already added tag
      tags:
        tag.length > 0 && !formValues.tags.includes(tag)
          ? [...formValues.tags, tag]
          : [...formValues.tags],
      // reset newTag slice of state
      newTag: '',
    });
  };

  /**
   * Handles tag input change.
   * @param value - string
   */
  const handleTagInputChange = (value: string) => {
    // save value, if not one of the target keys for adding a new tag
    if (!evKeys.includes(value)) {
      setFormValues({ ...formValues, newTag: value });
    }
  };

  /**
   * Handles key down event on tag input. if input is not empty, it inserts a new tag on Comma, Semicolon, Space or Enter key presses. if the input is empty, it deletes the most recent tag on Backspace or Delete key presses.
   * @param ev - KeyPressEvent
   */
  const handleTargetKeyDown = (ev: KeyPressEvent) => {
    if (ev.code === 'Backspace' || ev.key === 'Backspace' || ev.keyCode === 8) {
      // on backspace, if input is empty, remove most recently added tag
      if (formValues.newTag.length === 0) {
        setFormValues({
          ...formValues,
          tags: formValues.tags.slice(0, formValues.tags.length - 1),
        });
      }
    }

    // if condition is met and input is not empty, insert new tag
    if (evKeys.includes(ev.key) || evCodes.includes(ev.code) || evKeyCodes.includes(ev.keyCode)) {
      setFormValues({
        ...formValues,
        // prevents the addition of empty string tag or an already added tag
        tags:
          ev.target.value.length > 0 && !formValues.tags.includes(ev.target.value)
            ? [...formValues.tags, ev.target.value]
            : [...formValues.tags],
        // reset newTag slice of state
        newTag: '',
      });
    }
  };

  /**
   * Removes tag from state when clicked.
   * @param tag - string
   */
  const handleTagClick = (tag: string) => () => {
    const filtered = formValues.tags.filter(_tag => _tag !== tag);

    setFormValues({ ...formValues, tags: filtered });
  };

  /**
   * Saves selected license value to state.
   */
  const handleSelectLicense = (license: string) => {
    setFormValues({ ...formValues, license });
  };

  /**
   * Saves a draft of the form values.
   */
  const handleSaveDraft = () => {
    /** do something */
  };
  /**
   * Updates settings for the specified article id.
   */
  const handleConfirm = () => {
    /** do something */
  };

  return (
    <ArticleCardSettings
      subtitleLabel={t('Drag the image to reposition')}
      cancelCroppingLabel={t('Cancel')}
      saveCropLabel={t('Save')}
      imgSrc={coverImageSrc}
      imgCrop={coverImageCrop}
      imgZoom={coverImageZoom}
      minZoom={minZoom}
      maxZoom={maxZoom}
      zoomStep={zoomStep}
      isLoading={false}
      setImgCrop={setCoverImageCrop}
      setImgZoom={setCoverImageZoom}
      showCropper={showCropper}
      formValues={formValues}
      titleLabel={t('Article Settings')}
      addCoverImageLabel={t('Add a cover image')}
      optionalLabel={t('optional')}
      coverImageSubtitleLabel={t(
        'In case of no image uploaded the first image in the article will be used as a cover',
      )}
      coverImageInputRef={coverImageInputRef}
      uploadLabel={t('Upload')}
      coverImagePlaceholder={t('Your cover image will appear here')}
      addDescriptiveTextLabel={t('Add descriptive text')}
      descriptiveTextSubtitleLabel={t('The preview text of the article')}
      descriptiveTextPlaceholder={t('Describe your article in a few words (max. 96 chars)')}
      charCount={charCount}
      tagsLabel={t('Tags')}
      tagsSubtitleLabel={t('Add some tags to make your article easy to find and categorized.')}
      tagPlaceholder={t('Your tags go here. Press comma, semi-colon, space or enter key to add')}
      tagSuggestions={tagSearch.data?.map(tag => t('{{tagName}}', { tagName: tag.name }))}
      licenseLabel={t('License')}
      licenseSubtitleLabel={t(
        'Based on the license chosen, it will prevent others from copying your article without your permission',
      )}
      licensesArr={licensesArr}
      selectLicensePlaceholder={t('Select your license type')}
      selectedLicense={licences.find(el => el.label === formValues.license)}
      saveDraftLabel={t('Save Draft')}
      confirmLabel={t('Confirm')}
      onUploadClick={handleUploadClick}
      onCoverImageUpload={handleCoverImageUpload}
      onClickEditImage={handleEditImage}
      onCropComplete={handleCoverImageCropComplete}
      onZoomInClick={handleZoomInClick}
      onZoomOutClick={handleZoomOutClick}
      onSaveCrop={handleCropCoverImage}
      onRevertCropping={resetCropperFields}
      onDescriptiveTextChange={handleDescriptiveTextChange}
      onAddTag={handleAddTag}
      onTagInputChange={handleTagInputChange}
      onTargetKeyDown={handleTargetKeyDown}
      onClickTag={handleTagClick}
      onSelectLicense={handleSelectLicense}
      onClickSaveDraft={handleSaveDraft}
      onClickConfirm={handleConfirm}
    />
  );
};

export default ArticleCardSettingsPage;
