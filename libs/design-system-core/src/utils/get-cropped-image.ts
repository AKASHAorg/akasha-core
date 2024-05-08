/**
 * Computes radian angle equivalence of a given degree value
 * @param degree - number
 */
const computeRadian = (degree: number) => {
  return (degree * Math.PI) / 180;
};

/**
 * Returns the new bounding area of a rotated rectangle.
 * @param width - number
 * @param height - number
 * @param rotation - number
 */
const rotateSize = (width: number, height: number, rotation: number) => {
  const rotRad = computeRadian(rotation);
  return {
    width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
};

/**
 * Creates an image from a given url
 * @param url - string
 */
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', error => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

/**
 * Creates a blob from canvas of cropped area
 * @param imageSrc - string
 * @param pixelCrop - object
 * @param rotation - number
 * @param ImageSrcType - string
 * @param flip - object
 */
export async function getCroppedImage(
  imageSrc: string,
  pixelCrop: Record<string, number>,
  rotation = 0,
  imageSrcType = 'image/jpeg', // defaults to image/jpeg if undefined
  flip = { horizontal: false, vertical: false },
): Promise<[Blob, string]> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return null;
  }

  const rotRad = computeRadian(rotation);

  // calculate bounding box of the rotated image
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(image.width, image.height, rotation);

  // set canvas size to match the bounding box
  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  // translate canvas context to a central location to allow rotating and flipping around the center
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
  ctx.translate(-image.width / 2, -image.height / 2);

  // draw rotated image
  ctx.drawImage(image, 0, 0);

  // croppedAreaPixels values are bounding box relative
  // extract the cropped image using these values
  const data = ctx.getImageData(pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height);

  // set canvas width to final desired crop size - this will clear existing context
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // paste generated rotate image at the top left corner
  ctx.putImageData(data, 0, 0);

  // return Blob and its associated url
  return new Promise(resolve => {
    canvas.toBlob(
      file => {
        resolve([file, URL.createObjectURL(file)]);
      },
      imageSrcType,
      1,
    );
  });
}
