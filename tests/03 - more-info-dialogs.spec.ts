import { test, expect } from 'playwright-test-coverage';
import { SELECTORS } from './constants';
import { stubGlobalTestElements } from './utils';

test.describe('HAQuerySelector for more-info dialogs', () => {

    test.beforeEach(async ({ page }) => {
        await stubGlobalTestElements(page);
    });

    test.afterEach(async ({ page }) => {

        const body = page.locator('body');
        const isOverflow = await body.evaluate((body) => {
            return window.getComputedStyle(body).getPropertyValue('overflow') === 'hidden';
        });
        if (isOverflow) {
            // Restore this after Home Assistant 2025.3.x is released
            //await page.locator(SELECTORS.CLOSE_DIALOG).click();
            await page.locator(SELECTORS.CLOSE_DIALOG)
                .or(page.locator(SELECTORS.CLOSE_DIALOG_OLD))
                .click();
        }
        // Restore this after Home Assistant 2025.3.x is released
        //await expect(page.locator(SELECTORS.CLOSE_DIALOG)).not.toBeVisible();
        await expect(
            page.locator(SELECTORS.CLOSE_DIALOG).or(page.locator(SELECTORS.CLOSE_DIALOG_OLD))
        ).not.toBeVisible();
    });

    test('All the more-info dialog elements should exist', async ({ page }) => {

        expect(await page.evaluate(() => window.__onMoreInfoDialogOpen.calledOnce)).toBe(false);
        expect(await page.evaluate(() => window.__onHistoryAndLogBookDialogOpen.calledOnce)).toBe(false);
        expect(await page.evaluate(() => window.__onSettingsDialogOpen.calledOnce)).toBe(false);

        // Open a more-info dialog
        await page.locator(SELECTORS.ENTITY_CARD).click();

        // Restore this after Home Assistant 2025.3.x is released
        //await expect(page.locator(SELECTORS.CLOSE_DIALOG)).toBeVisible();
        await expect(
            page.locator(SELECTORS.CLOSE_DIALOG).or(page.locator(SELECTORS.CLOSE_DIALOG_OLD))
        ).toBeVisible();

        // Only onMoreInfoDialogOpen should be triggered
        expect(await page.evaluate(() => window.__onMoreInfoDialogOpen.calledOnce)).toBe(true);
        expect(await page.evaluate(() => window.__onHistoryAndLogBookDialogOpen.calledOnce)).toBe(false);
        expect(await page.evaluate(() => window.__onSettingsDialogOpen.calledOnce)).toBe(false);

        // Check the shape of the onMoreInfoDialogOpen
        const onMoreInfoDialogOpenElements = await page.evaluate(() => window.__onMoreInfoDialogOpen.firstCall.firstArg.detail);

        expect(onMoreInfoDialogOpenElements).toMatchObject({
            HA_MORE_INFO_DIALOG: {},
            HA_DIALOG: {},
            HA_DIALOG_CONTENT: {},
            HA_MORE_INFO_DIALOG_INFO: {}
        });

        await page.waitForTimeout(500);

        // Open the history and logbook
        await page.locator(SELECTORS.DIALOG_HISTORY_BUTTON).click();
        await expect(page.locator(SELECTORS.DIALOG_HISTORY_PANEL)).toBeVisible();

        // Only the onHistoryAndLogBookDialogOpen should be triggered
        expect(await page.evaluate(() => window.__onMoreInfoDialogOpen.calledOnce)).toBe(true);
        expect(await page.evaluate(() => window.__onHistoryAndLogBookDialogOpen.calledOnce)).toBe(true);
        expect(await page.evaluate(() => window.__onSettingsDialogOpen.calledOnce)).toBe(false);

        // Check the shape of the onHistoryAndLogBookDialogOpen
        const onHistoryAndLogBookDialogOpenElements = await page.evaluate(() => window.__onHistoryAndLogBookDialogOpen.firstCall.firstArg.detail);

        expect(onHistoryAndLogBookDialogOpenElements).toMatchObject({
            HA_MORE_INFO_DIALOG: {},
            HA_DIALOG: {},
            HA_DIALOG_CONTENT: {},
            HA_DIALOG_MORE_INFO_HISTORY_AND_LOGBOOK: {}
        });

        await page.waitForTimeout(500);

        // Return to the more-info dialog
        await page.locator(SELECTORS.DIALOG_GO_BACK_BUTTON).click();

        // Restore this after Home Assistant 2025.3.x is released
        //await expect(page.locator(SELECTORS.CLOSE_DIALOG)).toBeVisible();

        await expect(
            page.locator(SELECTORS.CLOSE_DIALOG).or(page.locator(SELECTORS.CLOSE_DIALOG_OLD))
        ).toBeVisible();

        // onMoreInfoDialogOpen should be triggered twice
        expect(await page.evaluate(() => window.__onMoreInfoDialogOpen.calledTwice)).toBe(true);
        expect(await page.evaluate(() => window.__onHistoryAndLogBookDialogOpen.calledOnce)).toBe(true);
        expect(await page.evaluate(() => window.__onSettingsDialogOpen.calledOnce)).toBe(false);

        await page.waitForTimeout(500);

        // Open the config
        await page.locator(SELECTORS.DIALOG_CONFIG_BUTTON).click();
        await expect(page.locator(SELECTORS.DIALOG_SETTINGS_PANEL)).toBeVisible();

        // Only onSettingsDialogOpen should be triggered
        expect(await page.evaluate(() => window.__onMoreInfoDialogOpen.calledTwice)).toBe(true);
        expect(await page.evaluate(() => window.__onHistoryAndLogBookDialogOpen.calledOnce)).toBe(true);
        expect(await page.evaluate(() => window.__onSettingsDialogOpen.calledOnce)).toBe(true);

        // Check the shape of the onSettingsDialogOpen
        const onSettingsDialogOpenElements = await page.evaluate(() => window.__onSettingsDialogOpen.firstCall.firstArg.detail);

        expect(onSettingsDialogOpenElements).toMatchObject({
            HA_MORE_INFO_DIALOG: {},
            HA_DIALOG: {},
            HA_DIALOG_CONTENT: {},
            HA_DIALOG_MORE_INFO_SETTINGS: {}
        });

        await page.waitForTimeout(500);

        // Return to the more-info dialog
        await page.locator(SELECTORS.DIALOG_GO_BACK_BUTTON).click();
        
        // Restore this after Home Assistant 2025.3.x is released
        //await expect(page.locator(SELECTORS.CLOSE_DIALOG)).toBeVisible();

        await expect(
            page.locator(SELECTORS.CLOSE_DIALOG).or(page.locator(SELECTORS.CLOSE_DIALOG_OLD))
        ).toBeVisible();

        // onMoreInfoDialogOpen should be triggered thrice
        expect(await page.evaluate(() => window.__onMoreInfoDialogOpen.calledThrice)).toBe(true);
        expect(await page.evaluate(() => window.__onHistoryAndLogBookDialogOpen.calledOnce)).toBe(true);
        expect(await page.evaluate(() => window.__onSettingsDialogOpen.calledOnce)).toBe(true);

    });

    test('All the more-info dialog elements should be Promises', async ({ page }) => {

        // Open a more-info dialog
        await page.locator(SELECTORS.ENTITY_CARD).click();

        // Restore this after Home Assistant 2025.3.x is released
        //await expect(page.locator(SELECTORS.CLOSE_DIALOG)).toBeVisible();

        await expect(
            page.locator(SELECTORS.CLOSE_DIALOG).or(page.locator(SELECTORS.CLOSE_DIALOG_OLD))
        ).toBeVisible();

        // Open the history and logbook
        await page.locator(SELECTORS.DIALOG_HISTORY_BUTTON).click();
        await expect(page.locator(SELECTORS.DIALOG_HISTORY_PANEL)).toBeVisible();

        // Return to the more-info dialog
        await page.locator(SELECTORS.DIALOG_GO_BACK_BUTTON).click();

        // Restore this after Home Assistant 2025.3.x is released
        //await expect(page.locator(SELECTORS.CLOSE_DIALOG)).toBeVisible();

        await expect(
            page.locator(SELECTORS.CLOSE_DIALOG).or(page.locator(SELECTORS.CLOSE_DIALOG_OLD))
        ).toBeVisible();

        // Open the config
        await page.locator(SELECTORS.DIALOG_CONFIG_BUTTON).click();
        await expect(page.locator(SELECTORS.DIALOG_SETTINGS_PANEL)).toBeVisible();

        // Return to the more-info dialog
        await page.locator(SELECTORS.DIALOG_GO_BACK_BUTTON).click();

        // Restore this after Home Assistant 2025.3.x is released
        //await expect(page.locator(SELECTORS.CLOSE_DIALOG)).toBeVisible();

        await expect(
            page.locator(SELECTORS.CLOSE_DIALOG).or(page.locator(SELECTORS.CLOSE_DIALOG_OLD))
        ).toBeVisible();

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
        
        // Restore this after Home Assistant 2025.3.x is released
        //await expect(page.locator(SELECTORS.CLOSE_DIALOG)).toBeVisible();

        await expect(
            page.locator(SELECTORS.CLOSE_DIALOG).or(page.locator(SELECTORS.CLOSE_DIALOG_OLD))
        ).toBeVisible();

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
        
        // Restore this after Home Assistant 2025.3.x is released
        //await expect(page.locator(SELECTORS.CLOSE_DIALOG)).toBeVisible();

        await expect(
            page.locator(SELECTORS.CLOSE_DIALOG).or(page.locator(SELECTORS.CLOSE_DIALOG_OLD))
        ).toBeVisible();

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

        // Restore this after Home Assistant 2025.3.x is released
        //await expect(page.locator(SELECTORS.CLOSE_DIALOG)).toBeVisible();

        await expect(
            page.locator(SELECTORS.CLOSE_DIALOG).or(page.locator(SELECTORS.CLOSE_DIALOG_OLD))
        ).toBeVisible();

    });

});