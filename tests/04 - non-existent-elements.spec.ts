import { test, expect } from 'playwright-test-coverage';
import { stubGlobalTestElements } from './utils';

test.describe('HAQuerySelector for lovelace dashboards', () => {

    test.beforeEach(async ({ page, context }) => {
        await stubGlobalTestElements(
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