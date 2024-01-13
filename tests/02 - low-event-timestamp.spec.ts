import { test, expect } from 'playwright-test-coverage';
import { stubGlobalTestElements } from './utils';

test.describe('HAQuerySelector events with low timestamp', () => {

    test.beforeEach(async ({ page, context }) => {
        return stubGlobalTestElements(
            page,
            context,
            {
                eventThreshold: 1000
            }
        );
	});

    test('Do not fire events below eventThreshold', async ({ page }) => {

        const links = 'paper-listbox > a[role="option"]';

        expect(await page.evaluate(() => window.__onPanelLoad.calledOnce)).toBe(true);
        expect(await page.evaluate(() => window.__onLovelacePanelLoad.calledOnce)).toBe(true);

        await page.locator(links, { hasText: 'History' }).click();

        expect(await page.evaluate(() => window.__onPanelLoad.calledTwice)).toBe(false);
        expect(await page.evaluate(() => window.__onLovelacePanelLoad.calledTwice)).toBe(false);

        await page.locator(links, { hasText: 'Overview' }).click();

        expect(await page.evaluate(() => window.__onPanelLoad.calledThrice)).toBe(false);
        expect(await page.evaluate(() => window.__onLovelacePanelLoad.calledTwice)).toBe(false);

        await page.waitForTimeout(1500);

        await page.locator(links, { hasText: 'History' }).click();

        expect(await page.evaluate(() => window.__onPanelLoad.calledTwice)).toBe(true);
        expect(await page.evaluate(() => window.__onLovelacePanelLoad.calledTwice)).toBe(false);

        await page.waitForTimeout(1500);

        await page.locator(links, { hasText: 'Overview' }).click();

        expect(await page.evaluate(() => window.__onPanelLoad.calledThrice)).toBe(true);
        expect(await page.evaluate(() => window.__onLovelacePanelLoad.calledTwice)).toBe(true);

    });

});