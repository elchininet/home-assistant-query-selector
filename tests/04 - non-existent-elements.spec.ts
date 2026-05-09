import { test, expect } from 'playwright-test-coverage';
import { stubGlobalTestElements } from './utils';

test.describe('HAQuerySelector non-existing elements', () => {

    test.describe('Without throwing errors', () => {

        test.beforeEach(async ({ page }) => {
            await stubGlobalTestElements(
                page,
                {
                    retries: 5,
                    delay: 5
                }
            );
        });

        test('Non-existent elements should return null or empty node list', async ({ page }) => {

            const doNotExist = await page.evaluate(async () => {

                const homeAssistantMainSelector = 'home-assistant-main';
                const doNotExist = '.do-not-exists';
                const elementsOnListen = window.__onListen.firstCall.firstArg.detail;
                const elementsOnPanelLoad = window.__onPanelLoad.firstCall.firstArg.detail;
                const elementsOnLovelacePanelLoad = window.__onLovelacePanelLoad.firstCall.firstArg.detail;
                const nonExistentElements = [
                    await elementsOnListen.HOME_ASSISTANT.selector.$.query(homeAssistantMainSelector).$.query(doNotExist).element === null,
                    (await elementsOnListen.HOME_ASSISTANT.selector.$.query(homeAssistantMainSelector).$.query(doNotExist).all).length === 0,
                    await elementsOnListen.HOME_ASSISTANT.selector.$.query(homeAssistantMainSelector).$.query(doNotExist).$.element === null,
                    await elementsOnPanelLoad.HOME_ASSISTANT_MAIN.selector.$.query(doNotExist).element === null,
                    (await elementsOnPanelLoad.HOME_ASSISTANT_MAIN.selector.$.query(doNotExist).all).length === 0,
                    await elementsOnPanelLoad.HOME_ASSISTANT_MAIN.selector.$.query(doNotExist).$.element === null,
                    await elementsOnLovelacePanelLoad.HA_PANEL_LOVELACE.selector.$.query(doNotExist).element === null,
                    (await elementsOnLovelacePanelLoad.HA_PANEL_LOVELACE.selector.$.query(doNotExist).all).length === 0,
                    await elementsOnLovelacePanelLoad.HA_PANEL_LOVELACE.selector.$.query(doNotExist).$.element === null
                ];
                return nonExistentElements.every(result => result);
            });
            
            expect(doNotExist).toBe(true);

        });

    });

    test.describe('Throwing errors', () => {

        test.beforeEach(async ({ page }) => {
            await stubGlobalTestElements(
                page,
                {
                    retries: 5,
                    delay: 5,
                    shouldReject: true
                }
            );
        });

        test('Non-existent elements should throw errors', async ({ page }) => {

            const errors = await page.evaluate(async () => {

                const errors: string[] = [];
                const homeAssistantMainSelector = 'home-assistant-main';
                const doNotExist = '.do-not-exists';
                const elementsOnListen = window.__onListen.firstCall.firstArg.detail;
                const elementsOnPanelLoad = window.__onPanelLoad.firstCall.firstArg.detail;
                const elementsOnLovelacePanelLoad = window.__onLovelacePanelLoad.firstCall.firstArg.detail;

                try {
                    await elementsOnListen.HOME_ASSISTANT.selector.$.query(homeAssistantMainSelector).$.query(doNotExist).element;
                } catch (error: unknown) {
                    errors.push((error as Error).message);
                }

                try {
                    await elementsOnListen.HOME_ASSISTANT.selector.$.query(homeAssistantMainSelector).$.query(doNotExist).all;
                } catch (error: unknown) {
                    errors.push((error as Error).message);
                }

                try {
                    await elementsOnListen.HOME_ASSISTANT.selector.$.query(homeAssistantMainSelector).$.query(doNotExist).$.element;
                } catch (error: unknown) {
                    errors.push((error as Error).message);
                }

                try {
                    await elementsOnPanelLoad.HOME_ASSISTANT_MAIN.selector.$.query(doNotExist).element;
                } catch (error: unknown) {
                    errors.push((error as Error).message);
                }

                try {
                    await elementsOnPanelLoad.HOME_ASSISTANT_MAIN.selector.$.query(doNotExist).all;
                } catch (error: unknown) {
                    errors.push((error as Error).message);
                }

                try {
                    await elementsOnPanelLoad.HOME_ASSISTANT_MAIN.selector.$.query(doNotExist).$.element;
                } catch (error: unknown) {
                    errors.push((error as Error).message);
                }

                try {
                    await elementsOnLovelacePanelLoad.HA_PANEL_LOVELACE.selector.$.query(doNotExist).element;
                } catch (error: unknown) {
                    errors.push((error as Error).message);
                }

                try {
                    await elementsOnLovelacePanelLoad.HA_PANEL_LOVELACE.selector.$.query(doNotExist).all;
                } catch (error: unknown) {
                    errors.push((error as Error).message);
                }

                try {
                    await elementsOnLovelacePanelLoad.HA_PANEL_LOVELACE.selector.$.query(doNotExist).$.element;
                } catch (error: unknown) {
                    errors.push((error as Error).message);
                }

                return errors;
            });
            
            expect(errors).toMatchObject([
                'The "element" method can only be called from a NodeList with elements.',
                'The "all" method can only be called in a valid element.',
                'The "$" method can only be called in an element with a ShadowRoot.',
                'The "element" method can only be called from a NodeList with elements.',
                'The "all" method can only be called in a valid element.',
                'The "$" method can only be called in an element with a ShadowRoot.',
                'The "element" method can only be called from a NodeList with elements.',
                'The "all" method can only be called in a valid element.',
                'The "$" method can only be called in an element with a ShadowRoot.'
            ]);

        });

    });

});