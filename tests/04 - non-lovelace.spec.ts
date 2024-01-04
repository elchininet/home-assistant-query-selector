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

    test('Lovelace elements should be null', async ({ page }) => {

        const called = await page.evaluate(() => window.__onPanelLoad.calledOnce);
        expect(called).toBe(true);

        const lovelaceElementsAreNull = await page.evaluate(async () => {

            const elements = window.__onPanelLoad.firstCall.firstArg.detail;
            const nullElements = [
                await elements.HA_PANEL_LOVELACE.element,
                await elements.HUI_ROOT.element,
                await elements.HEADER.element
            ];

            return nullElements.every(element => element === null);

        });

        expect(lovelaceElementsAreNull).toBe(true);

    });

});