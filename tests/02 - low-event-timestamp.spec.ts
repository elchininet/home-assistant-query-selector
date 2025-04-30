import { test, expect } from 'playwright-test-coverage';
import { SELECTORS } from './constants';
import { stubGlobalTestElements } from './utils';

test.describe('HAQuerySelector events with low timestamp', () => {

    test.beforeEach(async ({ page }) => {
        await stubGlobalTestElements(
            page,
            {
                eventThreshold: 800
            }
        );
    });

    test('Do not fire events below eventThreshold', async ({ page }) => {

        // In Home Assistant 2025.05.x is ha-md-list > ha-md-list-item
        const links = ':is(paper-listbox, ha-md-list) > :is(a[role="option"], ha-md-list-item)';

        expect(await page.evaluate(() => window.__onPanelLoad.calledOnce)).toBe(true);
        expect(await page.evaluate(() => window.__onLovelacePanelLoad.calledOnce)).toBe(true);

        await page.locator(links, { hasText: 'History' }).click();
        await expect(page.locator(SELECTORS.HEADER_HISTORY)).toBeVisible();

        expect(await page.evaluate(() => window.__onPanelLoad.calledTwice)).toBe(false);
        expect(await page.evaluate(() => window.__onLovelacePanelLoad.calledTwice)).toBe(false);

        await page.locator(links, { hasText: 'Overview' }).click();
        await expect(page.locator(SELECTORS.ENTITY_CARD)).toBeVisible();

        expect(await page.evaluate(() => window.__onPanelLoad.calledThrice)).toBe(false);
        expect(await page.evaluate(() => window.__onLovelacePanelLoad.calledTwice)).toBe(false);

        await page.waitForTimeout(1500);

        await page.locator(links, { hasText: 'History' }).click();
        await expect(page.locator(SELECTORS.HEADER_HISTORY)).toBeVisible();

        expect(await page.evaluate(() => window.__onPanelLoad.calledTwice)).toBe(true);
        expect(await page.evaluate(() => window.__onLovelacePanelLoad.calledTwice)).toBe(false);

        await page.waitForTimeout(1500);

        await page.locator(links, { hasText: 'Overview' }).click();
        await expect(page.locator(SELECTORS.ENTITY_CARD)).toBeVisible();

        expect(await page.evaluate(() => window.__onPanelLoad.calledThrice)).toBe(true);
        expect(await page.evaluate(() => window.__onLovelacePanelLoad.calledTwice)).toBe(true);

    });

});