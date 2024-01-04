import { test, expect } from 'playwright-test-coverage';
import { stubGlobalTestElements } from './utils';

test.describe('HAQuerySelector for lovelace dashboards', () => {

    test.beforeEach(async ({ page, context }) => {
        return stubGlobalTestElements(
            page,
            context,
            {
                retries: 5,
                delay: 5
            }
        );
	});

    test('Non-existent elements should return null or empty node list', async ({ page }) => {

        const doNotExist = await page.evaluate(async () => {

            const elements = window.__onPanelLoad.firstCall.firstArg.detail;
            const nonExistentElements = [
                await elements.HOME_ASSISTANT.selector.$.query('home-assistant-main').$.query('do-not-exists').element === null,
                (await elements.HOME_ASSISTANT.selector.$.query('home-assistant-main').$.query('do-not-exists').all).length === 0,
                await elements.HOME_ASSISTANT.selector.$.query('home-assistant-main').$.query('do-not-exists').$.element === null
            ];
            return nonExistentElements.every(result => result);
        });
        
        expect(doNotExist).toBe(true);

    });

});