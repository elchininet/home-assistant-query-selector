import { test, expect } from 'playwright-test-coverage';
import { stubGlobalTestElements } from './utils';

test.describe('HAQuerySelector for non-lovelace dashboards', () => {

    test.beforeEach(async ({ page, context }) => {
        return stubGlobalTestElements(
            page,
            context,
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
    });

});