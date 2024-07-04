import { Locator, expect } from '@playwright/test';
import sharp from 'sharp';
import pixelmatch from 'pixelmatch';

export async function assertItemsAreVisible(numOfItems: number, locator: Locator) {
  for (let i = 0; i < numOfItems; i++) {
    await expect(locator.nth(i)).toBeVisible();
  }
}

export async function getDifferentPixelsOfImages(
  image1: Buffer,
  image2: Buffer,
  dimension: {
    width: number;
    height: number;
  },
) {
  const resizedImage1 = await sharp(image1)
    .resize({
      width: dimension.width,
      height: dimension.height,
      fit: 'contain',
      position: 'left top',
    })
    .raw()
    .toBuffer();

  const resizedImage2 = await sharp(image2)
    .resize({
      width: dimension.width,
      height: dimension.height,
      fit: 'contain',
      position: 'left top',
    })
    .raw()
    .toBuffer();

  return pixelmatch(
    resizedImage1,
    resizedImage2,
    null,
    resizedImage1.length / (4 * dimension.height),
    dimension.height,
    {
      threshold: 0.3,
    },
  );
}
