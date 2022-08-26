import React from 'react';
import { useTranslation } from 'react-i18next';

import DS from '@akashaorg/design-system';
import { RootComponentProps } from '@akashaorg/typings/ui';
import { CropValue } from '@akashaorg/design-system/lib/components/ImageCropper';

import ArticleCardSettings, {
  CardFormValues,
  KeyPressEvent,
} from '../components/article-card-settings';

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
  const [coverImageSrc, setCoverImageSrc] =
    React.useState<{ url?: string; fallbackUrl?: string }>(null);

  const [formValues, setFormValues] = React.useState<CardFormValues>({
    coverImage: { src: { url: '', fallbackUrl: '' }, prefix: null, isUrl: false },
    description: '',
    newTag: '',
    tags: [],
    license: '',
  });

  const coverImageInputRef: React.RefObject<HTMLInputElement> = React.useRef(null);

  const { t } = useTranslation('app-articles');

  // predefined zoom values
  const minZoom = 1;
  const maxZoom = 3;
  const zoomStep = 0.01;

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

  const handleUploadClick = () => {
    const coverImageInput = coverImageInputRef.current;

    if (coverImageInput) {
      coverImageInput.click();
    }
  };

  const handleCoverImageUpload = (ev: React.ChangeEvent<HTMLInputElement>) => {
    if (!(ev.target.files && ev.target.files[0])) {
      return;
    }
    const file: File = ev.target.files[0];
    handleImageInsert(file as unknown as Record<string, string>, false);
  };

  const handleEditImage = () => {
    setShowCropper(true);
  };

  /* resets all state values required for cropping */
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

  const handleCoverImageCropComplete = React.useCallback((_, croppedAreaPixels) => {
    setCoverImageCroppedAreaPixels(croppedAreaPixels);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const handleZoomInClick = () => {
    // if value of the respective field's zoom is equal to or exceeds the predefined maxZoom value, return
    if (coverImageZoom >= maxZoom) return;
    setCoverImageZoom(prev => prev + zoomStep);
  };

  const handleZoomOutClick = () => {
    // if value of the respective field's zoom is equal to or less than the predefined minZoom value, return
    if (coverImageZoom <= minZoom) return;
    setCoverImageZoom(prev => prev - zoomStep);
  };

  const handleDescriptiveTextChange = (value: string) => {
    setFormValues({ ...formValues, description: value });
  };

  const handleTagInputChange = (value: string) => {
    // using trim() to prevent the addition of tags with just space(s)
    setFormValues({ ...formValues, newTag: value.trim() });
  };

  const handleTargetKeyPress = (ev: KeyPressEvent) => {
    const targetKeys = [' ', 'Enter'];
    const targetCodes = ['Space', 'Enter'];

    // condition: ev key is in targetKeys or ev code is in targetCodes
    if (targetKeys.includes(ev.key) || targetCodes.includes(ev.code)) {
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
    return;
  };

  const handleTagClick = (tag: string) => () => {
    const filtered = formValues.tags.filter(_tag => _tag !== tag);

    setFormValues({ ...formValues, tags: filtered });
  };

  const handleSaveDraft = () => {
    /** do something */
  };

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
      descriptiveTextPlaceholder={t('Describe your article in a few words (max. 100 words)')}
      tagsLabel={t('Tags')}
      tagsSubtitleLabel={t('Add some tags to make your article easy to find and categorized.')}
      tagPlaceholder={t('Your tags go here. Press space or enter key to add')}
      licenseLabel={t('License')}
      licenseSubtitleLabel={t(
        'Based on the license chosen, it will prevent others from copying your article without your permission',
      )}
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
      onTagInputChange={handleTagInputChange}
      onTargetKeyPress={handleTargetKeyPress}
      onClickTag={handleTagClick}
      onClickSaveDraft={handleSaveDraft}
      onClickConfirm={handleConfirm}
    />
  );
};

export default ArticleCardSettingsPage;
