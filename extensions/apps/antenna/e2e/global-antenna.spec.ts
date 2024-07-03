import { test, expect } from '@playwright/test';
import {
  REQUIRED_VISIBLE_ITEMS,
  SCREENSHOT_WIDTH,
  SCREENSHOT_HEIGHT,
  BEAM_FEED_TEST_ID,
  BEAM_CARD_TEST_ID,
  MAX_DIFF_PIXELS,
  AVATAR_IMAGE_TEST_ID,
  MAX_VIRTUAL_LIST_ITEMS,
  DATA_OFFSET_ATTRIBUTE,
  DATA_INDEX_ATTRIBUTE,
} from './constants';
import { assertItemsAreVisible, getDifferentPixelsOfImages } from './helpers';

test('scroll restoration', async ({ page }) => {
  //navigate to global antenna
  await page.goto('@akashaorg/app-antenna/antenna');

  const beamFeedLocator = page.getByTestId(BEAM_FEED_TEST_ID);

  //assert beam feed is visible
  await expect(beamFeedLocator).toBeVisible();

  //assert profile avatars inside beam feed are visible
  await assertItemsAreVisible(
    REQUIRED_VISIBLE_ITEMS,
    beamFeedLocator.getByTestId(AVATAR_IMAGE_TEST_ID),
  );

  const nthBeamCardLocator = page.getByTestId(BEAM_CARD_TEST_ID).nth(REQUIRED_VISIBLE_ITEMS - 1);

  //assert nth beam card is visible
  await expect(nthBeamCardLocator).toBeVisible();

  //scroll into view nth beam card
  await nthBeamCardLocator.scrollIntoViewIfNeeded();

  //add some delay to ensure the page is ready for a screenshot
  await page.waitForTimeout(1000);

  //screenshot some of the area in view
  const firstScreenshot = await page.screenshot({
    clip: { x: 0, y: 0, width: SCREENSHOT_WIDTH, height: SCREENSHOT_HEIGHT },
  });

  //click nth item scrolled into view to go to the full beam page
  await nthBeamCardLocator.click();

  await page.goBack();

  //assert beam feed is visible
  await expect(beamFeedLocator).toBeVisible();

  //assert profile avatars inside beam feed are visible
  await assertItemsAreVisible(
    REQUIRED_VISIBLE_ITEMS,
    beamFeedLocator.getByTestId(AVATAR_IMAGE_TEST_ID),
  );

  const secondScreenShot = await page.screenshot({
    clip: { x: 0, y: 0, width: SCREENSHOT_WIDTH, height: SCREENSHOT_HEIGHT },
  });

  //assert if previous and current screenshots are matching to check if scroll restoration succeeded
  await expect(
    await getDifferentPixelsOfImages(firstScreenshot, secondScreenShot, {
      height: SCREENSHOT_HEIGHT,
      width: SCREENSHOT_WIDTH,
    }),
  ).toBeLessThanOrEqual(MAX_DIFF_PIXELS);
});

test('virtual list', async ({ page }) => {
  //navigate to global antenna
  await page.goto('@akashaorg/app-antenna/antenna');

  const beamFeedLocator = page.getByTestId(BEAM_FEED_TEST_ID);

  //assert beam feed is visible
  await expect(beamFeedLocator).toBeVisible();

  //assert profile avatars inside beam feed are visible
  await assertItemsAreVisible(
    REQUIRED_VISIBLE_ITEMS,
    beamFeedLocator.getByTestId(AVATAR_IMAGE_TEST_ID),
  );

  const vListWrapperLocator = beamFeedLocator.locator(`[${DATA_OFFSET_ATTRIBUTE}]`);

  //assert virtual list wrapper is visible
  await expect(vListWrapperLocator).toBeVisible();

  //assert upto a maximum virtual list items are visible
  await expect(
    await vListWrapperLocator.locator(`[${DATA_INDEX_ATTRIBUTE}]`).count(),
  ).toBeLessThanOrEqual(MAX_VIRTUAL_LIST_ITEMS);

  //scroll into view nth beam card
  await vListWrapperLocator
    .locator(`[${DATA_INDEX_ATTRIBUTE}="${REQUIRED_VISIBLE_ITEMS - 1}"]`)
    .scrollIntoViewIfNeeded();

  //assert virtual list wrapper is visible
  await expect(vListWrapperLocator).toBeVisible();

  //assert upto a maximum virtual list items are visible
  await expect(
    await vListWrapperLocator.locator(`[${DATA_INDEX_ATTRIBUTE}]`).count(),
  ).toBeLessThanOrEqual(MAX_VIRTUAL_LIST_ITEMS);
});
