import { test, expect } from 'playwright-test-coverage';
import { stubGlobalTestElements } from './utils';

test.describe('HAQuerySelector for non-lovelace dashboards', () => {

    test.beforeEach(async ({ page }) => {
        await stubGlobalTestElements(
            page,
            {
                pathname: 'history',
                retries: 5,
                delay: 5
            }
        );
	});

    test('onLovelacePanelLoad should not be callled', async ({ page }) => {

        expect(await page.evaluate(() => window.__onListen.calledOnce)).toBe(true);
        expect(await page.evaluate(() => window.__onPanelLoad.calledOnce)).toBe(true);
        expect(await page.evaluate(() => window.__onLovelacePanelLoad.notCalled)).toBe(true);

        // We need to wait until the lovelace panel is not found and then check that the function has not been called
        await page.waitForTimeout(1000);

        expect(await page.evaluate(() => window.__onLovelacePanelLoad.notCalled)).toBe(true);

    });

});