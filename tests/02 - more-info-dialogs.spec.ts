import { test, expect } from 'playwright-test-coverage';
import { SELECTORS } from './constants';
import { stubGlobalTestElements } from './utils';

test.describe('HAQuerySelector for more-info dialogs', () => {

    test.beforeEach(async ({ page, context }) => {
        return stubGlobalTestElements(page, context);
	});

    test.afterEach(async ({ page }) => {

        const body = page.locator('body');
        const isOverflow = await body.evaluate((body) => {
            return window.getComputedStyle(body).getPropertyValue('overflow') === 'hidden';
        });
        if (isOverflow) {
            await page.locator(SELECTORS.CLOSE_DIALOG).click();
        }
        await expect(page.locator(SELECTORS.CLOSE_DIALOG)).not.toBeVisible();
    });

    test('All the more-info dialog elements should exist', async ({ page }) => {

        let onMoreInfoDialogOpenCalled = await page.evaluate(() => {
            return window.__onMoreInfoDialogOpen.calledOnce;
        });

        let onHistoryAndLogBookDialogOpenCalled = await page.evaluate(() => {
            return window.__onHistoryAndLogBookDialogOpen.calledOnce;
        });

        let onSettingsDialogOpenCalled = await page.evaluate(() => {
            return window.__onSettingsDialogOpen.calledOnce;
        });

        expect(onMoreInfoDialogOpenCalled).toBe(false);
        expect(onHistoryAndLogBookDialogOpenCalled).toBe(false);
        expect(onSettingsDialogOpenCalled).toBe(false);

        // Open a more-info dialog
        await page.locator(SELECTORS.ENTITY_CARD).click();

        await expect(page.locator(SELECTORS.CLOSE_DIALOG)).toBeVisible();

        // Only onMoreInfoDialogOpen should be triggered
        onMoreInfoDialogOpenCalled = await page.evaluate(() => {
            return window.__onMoreInfoDialogOpen.calledOnce;
        });

        onHistoryAndLogBookDialogOpenCalled = await page.evaluate(() => {
            return window.__onHistoryAndLogBookDialogOpen.calledOnce;
        });

        onSettingsDialogOpenCalled = await page.evaluate(() => {
            return window.__onSettingsDialogOpen.calledOnce;
        });

        expect(onMoreInfoDialogOpenCalled).toBe(true);
        expect(onHistoryAndLogBookDialogOpenCalled).toBe(false);
        expect(onSettingsDialogOpenCalled).toBe(false);

        // Check the shape of the onMoreInfoDialogOpen
        const onMoreInfoDialogOpenElements = await page.evaluate(() => window.__onMoreInfoDialogOpen.firstCall.firstArg.detail);

        expect(onMoreInfoDialogOpenElements).toMatchObject({
            HA_MORE_INFO_DIALOG: {},
            HA_DIALOG: {},
            HA_DIALOG_CONTENT: {},
            HA_MORE_INFO_DIALOG_INFO: {}
        });

        // Open the history and logbook
        await page.locator(SELECTORS.DIALOG_HISTORY_BUTTON).click();
        await expect(page.locator(SELECTORS.DIALOG_HISTORY_PANEL)).toBeVisible();

        // Only the onHistoryAndLogBookDialogOpen should be triggered
        onMoreInfoDialogOpenCalled = await page.evaluate(() => {
            return window.__onMoreInfoDialogOpen.calledOnce;
        });

        onHistoryAndLogBookDialogOpenCalled = await page.evaluate(() => {
            return window.__onHistoryAndLogBookDialogOpen.calledOnce;
        });

        onSettingsDialogOpenCalled = await page.evaluate(() => {
            return window.__onSettingsDialogOpen.calledOnce;
        });

        expect(onMoreInfoDialogOpenCalled).toBe(true);
        expect(onHistoryAndLogBookDialogOpenCalled).toBe(true);
        expect(onSettingsDialogOpenCalled).toBe(false);

        // Check the shape of the onHistoryAndLogBookDialogOpen
        const onHistoryAndLogBookDialogOpenElements = await page.evaluate(() => window.__onHistoryAndLogBookDialogOpen.firstCall.firstArg.detail);

        expect(onHistoryAndLogBookDialogOpenElements).toMatchObject({
            HA_MORE_INFO_DIALOG: {},
            HA_DIALOG: {},
            HA_DIALOG_CONTENT: {},
            HA_DIALOG_MORE_INFO_HISTORY_AND_LOGBOOK: {}
        });

        // Return to the more-info dialog
        await page.locator(SELECTORS.DIALOG_GO_BACK_BUTTON).click();
        await expect(page.locator(SELECTORS.CLOSE_DIALOG)).toBeVisible();

        // onMoreInfoDialogOpen should be triggered twice
        onMoreInfoDialogOpenCalled = await page.evaluate(() => {
            return window.__onMoreInfoDialogOpen.calledTwice;
        });

        onHistoryAndLogBookDialogOpenCalled = await page.evaluate(() => {
            return window.__onHistoryAndLogBookDialogOpen.calledOnce;
        });

        onSettingsDialogOpenCalled = await page.evaluate(() => {
            return window.__onSettingsDialogOpen.calledOnce;
        });

        expect(onMoreInfoDialogOpenCalled).toBe(true);
        expect(onHistoryAndLogBookDialogOpenCalled).toBe(true);
        expect(onSettingsDialogOpenCalled).toBe(false);

        // Open the config
        await page.locator(SELECTORS.DIALOG_CONFIG_BUTTON).click();
        await expect(page.locator(SELECTORS.DIALOG_SETTINGS_PANEL)).toBeVisible();

        // Only onSettingsDialogOpen should be triggered
        onMoreInfoDialogOpenCalled = await page.evaluate(() => {
            return window.__onMoreInfoDialogOpen.calledTwice;
        });

        onHistoryAndLogBookDialogOpenCalled = await page.evaluate(() => {
            return window.__onHistoryAndLogBookDialogOpen.calledOnce;
        });

        onSettingsDialogOpenCalled = await page.evaluate(() => {
            return window.__onSettingsDialogOpen.calledOnce;
        });

        expect(onMoreInfoDialogOpenCalled).toBe(true);
        expect(onHistoryAndLogBookDialogOpenCalled).toBe(true);
        expect(onSettingsDialogOpenCalled).toBe(true);

        // Check the shape of the onSettingsDialogOpen
        const onSettingsDialogOpenElements = await page.evaluate(() => window.__onSettingsDialogOpen.firstCall.firstArg.detail);

        expect(onSettingsDialogOpenElements).toMatchObject({
            HA_MORE_INFO_DIALOG: {},
            HA_DIALOG: {},
            HA_DIALOG_CONTENT: {},
            HA_DIALOG_MORE_INFO_SETTINGS: {}
        });

        // Return to the more-info dialog
        await page.locator(SELECTORS.DIALOG_GO_BACK_BUTTON).click();
        await expect(page.locator(SELECTORS.CLOSE_DIALOG)).toBeVisible();

        // onMoreInfoDialogOpen should be triggered thrice
        onMoreInfoDialogOpenCalled = await page.evaluate(() => {
            return window.__onMoreInfoDialogOpen.calledThrice;
        });

        onHistoryAndLogBookDialogOpenCalled = await page.evaluate(() => {
            return window.__onHistoryAndLogBookDialogOpen.calledOnce;
        });

        onSettingsDialogOpenCalled = await page.evaluate(() => {
            return window.__onSettingsDialogOpen.calledOnce;
        });

        expect(onMoreInfoDialogOpenCalled).toBe(true);
        expect(onHistoryAndLogBookDialogOpenCalled).toBe(true);
        expect(onSettingsDialogOpenCalled).toBe(true);

    });

    test('All the more-info dialog elements should be Promises', async ({ page }) => {

        // Open a more-info dialog
        await page.locator(SELECTORS.ENTITY_CARD).click();
        await expect(page.locator(SELECTORS.CLOSE_DIALOG)).toBeVisible();

        // Open the history and logbook
        await page.locator(SELECTORS.DIALOG_HISTORY_BUTTON).click();
        await expect(page.locator(SELECTORS.DIALOG_HISTORY_PANEL)).toBeVisible();

        // Return to the more-info dialog
        await page.locator(SELECTORS.DIALOG_GO_BACK_BUTTON).click();
        await expect(page.locator(SELECTORS.CLOSE_DIALOG)).toBeVisible();

        // Open the config
        await page.locator(SELECTORS.DIALOG_CONFIG_BUTTON).click();
        await expect(page.locator(SELECTORS.DIALOG_SETTINGS_PANEL)).toBeVisible();

        // Return to the more-info dialog
        await page.locator(SELECTORS.DIALOG_GO_BACK_BUTTON).click();
        await expect(page.locator(SELECTORS.CLOSE_DIALOG)).toBeVisible();

        const onMoreInfoDialogOpenArePromises = await page.evaluate(() => {
            const elements = [
                'HA_MORE_INFO_DIALOG',
                'HA_DIALOG',
                'HA_DIALOG_CONTENT',
                'HA_MORE_INFO_DIALOG_INFO'
            ];
            return elements.every((element) => {
                return window.__onMoreInfoDialogOpen.firstCall.firstArg.detail[element].element instanceof Promise;
            });
        });

        expect(onMoreInfoDialogOpenArePromises).toBe(true);

        const onHistoryAndLogBookDialogOpenArePromises = await page.evaluate(() => {
            const elements = [
                'HA_MORE_INFO_DIALOG',
                'HA_DIALOG',
                'HA_DIALOG_CONTENT',
                'HA_DIALOG_MORE_INFO_HISTORY_AND_LOGBOOK'
            ];
            return elements.every((element) => {
                return window.__onHistoryAndLogBookDialogOpen.firstCall.firstArg.detail[element].element instanceof Promise;
            });
        });

        expect(onHistoryAndLogBookDialogOpenArePromises).toBe(true);

        const onSettingsDialogOpenArePromises = await page.evaluate(() => {
            const elements = [
                'HA_MORE_INFO_DIALOG',
                'HA_DIALOG',
                'HA_DIALOG_CONTENT',
                'HA_DIALOG_MORE_INFO_SETTINGS'
            ];
            return elements.every((element) => {
                return window.__onSettingsDialogOpen.firstCall.firstArg.detail[element].element instanceof Promise;
            });
        });

        expect(onSettingsDialogOpenArePromises).toBe(true);

    });

    test('The more-info dialog elements\' Promises should resolve in the proper DOM elements', async ({ page }) => {

        // Open a more-info dialog
        await page.locator(SELECTORS.ENTITY_CARD).click();
        await expect(page.locator(SELECTORS.CLOSE_DIALOG)).toBeVisible();

        const areOnMoreInfoDialogOpenTheRightElements = await page.evaluate(async () => {

            const HOME_ASSISTANT = document.querySelector('home-assistant');
            const HA_MORE_INFO_DIALOG = HOME_ASSISTANT?.shadowRoot?.querySelector('ha-more-info-dialog');
            const HA_DIALOG = HA_MORE_INFO_DIALOG?.shadowRoot?.querySelector('ha-dialog');
            const HA_DIALOG_CONTENT = HA_DIALOG?.querySelector('.content');
            const HA_MORE_INFO_DIALOG_INFO = HA_DIALOG_CONTENT?.querySelector('ha-more-info-info');

            const elements = {
                'HA_MORE_INFO_DIALOG': HA_MORE_INFO_DIALOG,
                'HA_DIALOG': HA_DIALOG,
                'HA_DIALOG_CONTENT': HA_DIALOG_CONTENT,
                'HA_MORE_INFO_DIALOG_INFO': HA_MORE_INFO_DIALOG_INFO
            };

            const results: boolean[] = [];

            for (const entry of Object.entries(elements)) {
                const [key, element] = entry;
                const domElement = await window.__onMoreInfoDialogOpen.firstCall.firstArg.detail[key].element;
                results.push(
                    !!domElement && domElement === element
                );
            }

            return results.every(result => result);

        });

        expect(areOnMoreInfoDialogOpenTheRightElements).toBe(true);

        // Open the history and logbook
        await page.locator(SELECTORS.DIALOG_HISTORY_BUTTON).click();
        await expect(page.locator(SELECTORS.DIALOG_HISTORY_PANEL)).toBeVisible();

        const areOnHistoryAndLogBookDialogOpenTheRightElements = await page.evaluate(async () => {

            const HOME_ASSISTANT = document.querySelector('home-assistant');
            const HA_MORE_INFO_DIALOG = HOME_ASSISTANT?.shadowRoot?.querySelector('ha-more-info-dialog');
            const HA_DIALOG = HA_MORE_INFO_DIALOG?.shadowRoot?.querySelector('ha-dialog');
            const HA_DIALOG_CONTENT = HA_DIALOG?.querySelector('.content');
            const HA_DIALOG_MORE_INFO_HISTORY_AND_LOGBOOK = HA_DIALOG_CONTENT?.querySelector('ha-more-info-history-and-logbook');

            const elements = {
                'HA_MORE_INFO_DIALOG': HA_MORE_INFO_DIALOG,
                'HA_DIALOG': HA_DIALOG,
                'HA_DIALOG_CONTENT': HA_DIALOG_CONTENT,
                'HA_DIALOG_MORE_INFO_HISTORY_AND_LOGBOOK': HA_DIALOG_MORE_INFO_HISTORY_AND_LOGBOOK
            };

            const results: boolean[] = [];

            for (const entry of Object.entries(elements)) {
                const [key, element] = entry;
                const domElement = await window.__onHistoryAndLogBookDialogOpen.firstCall.firstArg.detail[key].element;
                results.push(
                    !!domElement && domElement === element
                );
            }

            return results.every(result => result);

        });

        expect(areOnHistoryAndLogBookDialogOpenTheRightElements).toBe(true);

        // Return to the more-info dialog
        await page.locator(SELECTORS.DIALOG_GO_BACK_BUTTON).click();
        await expect(page.locator(SELECTORS.CLOSE_DIALOG)).toBeVisible();

        // Open the config
        await page.locator(SELECTORS.DIALOG_CONFIG_BUTTON).click();
        await expect(page.locator(SELECTORS.DIALOG_SETTINGS_PANEL)).toBeVisible();

        const areOnSettingsDialogOpenTheRightElements = await page.evaluate(async () => {

            const HOME_ASSISTANT = document.querySelector('home-assistant');
            const HA_MORE_INFO_DIALOG = HOME_ASSISTANT?.shadowRoot?.querySelector('ha-more-info-dialog');
            const HA_DIALOG = HA_MORE_INFO_DIALOG?.shadowRoot?.querySelector('ha-dialog');
            const HA_DIALOG_CONTENT = HA_DIALOG?.querySelector('.content');
            const HA_DIALOG_MORE_INFO_SETTINGS = HA_DIALOG_CONTENT?.querySelector('ha-more-info-settings');

            const elements = {
                'HA_MORE_INFO_DIALOG': HA_MORE_INFO_DIALOG,
                'HA_DIALOG': HA_DIALOG,
                'HA_DIALOG_CONTENT': HA_DIALOG_CONTENT,
                'HA_DIALOG_MORE_INFO_SETTINGS': HA_DIALOG_MORE_INFO_SETTINGS
            };

            const results: boolean[] = [];

            for (const entry of Object.entries(elements)) {
                const [key, element] = entry;
                const domElement = await window.__onSettingsDialogOpen.firstCall.firstArg.detail[key].element;
                results.push(
                    !!domElement && domElement === element
                );
            }

            return results.every(result => result);

        });

        expect(areOnSettingsDialogOpenTheRightElements).toBe(true);

        // Return to the more-info dialog
        await page.locator(SELECTORS.DIALOG_GO_BACK_BUTTON).click();
        await expect(page.locator(SELECTORS.CLOSE_DIALOG)).toBeVisible();

    });

});