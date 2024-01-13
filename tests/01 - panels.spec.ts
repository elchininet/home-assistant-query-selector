import { test, expect } from 'playwright-test-coverage';
import { SELECTORS } from './constants';
import { stubGlobalTestElements } from './utils';

test.describe('HAQuerySelector for dashboards', () => {

    test.beforeEach(async ({ page, context }) => {
        return stubGlobalTestElements(page, context);
	});

    test('All the elements should exist', async ({ page }) => {

        const calledListen = await page.evaluate(() => window.__onListen.calledOnce);
        const calledPanelLoad = await page.evaluate(() => window.__onPanelLoad.calledOnce);
        const calledLovelacePanelLoad = await page.evaluate(() => window.__onLovelacePanelLoad.calledOnce);
        expect(calledListen).toBe(true);
        expect(calledPanelLoad).toBe(true);
        expect(calledLovelacePanelLoad).toBe(true);

        const listenElements = await page.evaluate(() => window.__onListen.firstCall.firstArg.detail);
        const panelLoadElements = await page.evaluate(() => window.__onPanelLoad.firstCall.firstArg.detail);
        const lovelacePanelLoadElements = await page.evaluate(() => window.__onLovelacePanelLoad.firstCall.firstArg.detail);
        
        const mainElements = {
            HOME_ASSISTANT: {},
            HOME_ASSISTANT_MAIN: {},
            HA_SIDEBAR: {},
            HA_DRAWER: {},
            PARTIAL_PANEL_RESOLVER: {},
        };

        const lovelaceElements = {
            HA_PANEL_LOVELACE: {},
            HUI_ROOT: {},
            HEADER: {},
            HUI_VIEW: {}
        };

        expect(listenElements).toMatchObject(mainElements);
        expect(panelLoadElements).toMatchObject(mainElements);
        expect(lovelacePanelLoadElements).toMatchObject({
            ...mainElements,
            ...lovelaceElements
        });

    });

    test('All the elements should be Promises', async ({ page }) => {

        const arePromises = await page.evaluate(() => {
            const mainElements = [
                'HOME_ASSISTANT',
                'HOME_ASSISTANT_MAIN',
                'HA_SIDEBAR',
                'HA_DRAWER',
                'PARTIAL_PANEL_RESOLVER',
            ];
            const lovelaceElements = [
                'HA_PANEL_LOVELACE',
                'HUI_ROOT',
                'HEADER',
                'HUI_VIEW'
            ];
            const onListen = mainElements.every((element) => {
                return window.__onListen.firstCall.firstArg.detail[element].element instanceof Promise;
            });
            const onPanelLoad = mainElements.every((element) => {
                return window.__onPanelLoad.firstCall.firstArg.detail[element].element instanceof Promise;
            });
            const onLovelacePanelLoad = [...mainElements, ...lovelaceElements].every((element) => {
                return window.__onLovelacePanelLoad.firstCall.firstArg.detail[element].element instanceof Promise;
            });
            return onListen && onPanelLoad && onLovelacePanelLoad;
        });
        
        expect(arePromises).toBe(true);

    });

    test('The elements\' Promises should resolve in the proper DOM elements', async ({ page }) => {

        const areTheRightElements = await page.evaluate(async () => {

            const HOME_ASSISTANT = document.querySelector('home-assistant');
            const HOME_ASSISTANT_MAIN = HOME_ASSISTANT?.shadowRoot?.querySelector('home-assistant-main');
            const HA_SIDEBAR = HOME_ASSISTANT_MAIN?.shadowRoot?.querySelector('ha-sidebar');
            const HA_DRAWER = HOME_ASSISTANT_MAIN?.shadowRoot?.querySelector('ha-drawer');
            const PARTIAL_PANEL_RESOLVER = HA_DRAWER?.querySelector('partial-panel-resolver');
            const HA_PANEL_LOVELACE = PARTIAL_PANEL_RESOLVER?.querySelector('ha-panel-lovelace');
            const HUI_ROOT = HA_PANEL_LOVELACE?.shadowRoot?.querySelector('hui-root');
            const HEADER = HUI_ROOT?.shadowRoot?.querySelector('.header');
            const HUI_VIEW = HUI_ROOT?.shadowRoot?.querySelector('hui-view');

            const mainElements = {
                'HOME_ASSISTANT': HOME_ASSISTANT,
                'HOME_ASSISTANT_MAIN': HOME_ASSISTANT_MAIN,
                'HA_SIDEBAR': HA_SIDEBAR,
                'HA_DRAWER': HA_DRAWER,
                'PARTIAL_PANEL_RESOLVER': PARTIAL_PANEL_RESOLVER,
            };
            
            const lovelaceElements = {
                'HA_PANEL_LOVELACE': HA_PANEL_LOVELACE,
                'HUI_ROOT': HUI_ROOT,
                'HEADER': HEADER,
                'HUI_VIEW': HUI_VIEW
            };

            const results: boolean[] = [];

            for (const entry of Object.entries(mainElements)) {
                const [key, element] = entry;
                const domElementListen = await window.__onListen.firstCall.firstArg.detail[key].element;
                const domElementPanelLoad = await window.__onPanelLoad.firstCall.firstArg.detail[key].element;
                results.push(
                    !!domElementListen && domElementListen === element,
                    !!domElementPanelLoad && domElementPanelLoad === element
                );
            }

            for (const entry of Object.entries({...mainElements, ...lovelaceElements})) {
                const [key, element] = entry;
                const domElementLovelacePanelLoad = await window.__onLovelacePanelLoad.firstCall.firstArg.detail[key].element;
                results.push(
                    !!domElementLovelacePanelLoad && domElementLovelacePanelLoad === element
                );
            }

            return results.every(result => result);

        });

        expect(areTheRightElements).toBe(true);

    });

    test('The selector should return the proper elements', async ({ page }) => {

        const areTheRightElements = await page.evaluate(async () => {

            const elementsListen = window.__onListen.firstCall.firstArg.detail;
            const elementsPanelLoad = window.__onPanelLoad.firstCall.firstArg.detail;
            const elementsLovelacePanelLoad = window.__onLovelacePanelLoad.firstCall.firstArg.detail;

            const HOME_ASSISTANT = document.querySelector('home-assistant');
            const HOME_ASSISTANT_MAIN = HOME_ASSISTANT?.shadowRoot?.querySelector('home-assistant-main');
            const HA_DRAWER = HOME_ASSISTANT_MAIN?.shadowRoot?.querySelector('ha-drawer');
            const PARTIAL_PANEL_RESOLVER = HA_DRAWER?.querySelector('partial-panel-resolver');
            const HA_PANEL_LOVELACE = PARTIAL_PANEL_RESOLVER?.querySelector('ha-panel-lovelace');
            const HUI_ROOT = HA_PANEL_LOVELACE?.shadowRoot?.querySelector('hui-root');
            const HEADER = HUI_ROOT?.shadowRoot?.querySelector('.header');

            const results: boolean[] = [];


            const compare = [
                [
                    await elementsListen.HOME_ASSISTANT.selector.$.query('home-assistant-main').$.query('ha-drawer').element,
                    await elementsListen.HA_DRAWER.element
                ],
                [
                    await elementsPanelLoad.HOME_ASSISTANT.selector.deepQuery('ha-drawer').element,
                    HA_DRAWER
                ],
                [
                    await elementsPanelLoad.HOME_ASSISTANT_MAIN.selector.$.query('ha-drawer ha-panel-lovelace').$.query('hui-root').$.query('.header .action-items > ha-button-menu').all,
                    HEADER?.querySelectorAll('.action-items > ha-button-menu')
                ],
                [
                    await elementsLovelacePanelLoad.HA_PANEL_LOVELACE.selector.$.query('hui-root').$.element,
                    HUI_ROOT?.shadowRoot
                ]
            ];

            for (const compareEntry of compare) {
                const [query, compare] = compareEntry;
                if (
                    query instanceof NodeList &&
                    compare instanceof NodeList
                ) {
                    results.push((
                        !!query.length &&
                        query.length === compare.length &&
                        Array.from(query).every((element, index) => element === compare[index])
                    ));
                } else {
                    results.push(
                        !!query && query === compare
                    );
                }
                
            }

            return results.every(result => result);

        });

        expect(areTheRightElements).toBe(true);

    });

    test('Events should be triggered accordingly', async ({ page }) => {

        const links = 'paper-listbox > a[role="option"]';

        expect(await page.evaluate(() => window.__onListen.calledOnce)).toBe(true);
        expect(await page.evaluate(() => window.__onPanelLoad.calledOnce)).toBe(true);
        expect(await page.evaluate(() => window.__onLovelacePanelLoad.calledOnce)).toBe(true);

        await page.waitForTimeout(500);

        await page.locator(links, { hasText: 'History' }).click();
        await expect(page.locator(SELECTORS.HEADER_HISTORY)).toBeVisible();

        expect(await page.evaluate(() => window.__onListen.calledOnce)).toBe(true);
        expect(await page.evaluate(() => window.__onPanelLoad.calledTwice)).toBe(true);
        expect(await page.evaluate(() => window.__onLovelacePanelLoad.calledOnce)).toBe(true);

        await page.waitForTimeout(500);

        await page.locator(links, { hasText: 'Overview' }).click();
        await expect(page.locator(SELECTORS.ENTITY_CARD)).toBeVisible();

        expect(await page.evaluate(() => window.__onListen.calledOnce)).toBe(true);
        expect(await page.evaluate(() => window.__onPanelLoad.calledThrice)).toBe(true);
        expect(await page.evaluate(() => window.__onLovelacePanelLoad.calledTwice)).toBe(true);

        await page.waitForTimeout(500);

        await page.evaluate(() => window.__instance.listen());

        expect(await page.evaluate(() => window.__onListen.calledTwice)).toBe(true);
        expect(await page.evaluate(() => window.__onPanelLoad.getCalls().length)).toBe(4);
        expect(await page.evaluate(() => window.__onLovelacePanelLoad.calledThrice)).toBe(true);

    });

    test('Remove events should remove the listeners', async ({ page }) => {

        const links = 'paper-listbox > a[role="option"]';

        expect(await page.evaluate(() => window.__onListen.calledOnce)).toBe(true);
        expect(await page.evaluate(() => window.__onPanelLoad.calledOnce)).toBe(true);
        expect(await page.evaluate(() => window.__onLovelacePanelLoad.calledOnce)).toBe(true);

        await page.evaluate(() => {
            const { HAQuerySelectorEvent } = window.HAQuerySelectorBundle;
            window.__instance.removeEventListener(HAQuerySelectorEvent.ON_LISTEN, window.__onListen);
            window.__instance.removeEventListener(HAQuerySelectorEvent.ON_PANEL_LOAD, window.__onPanelLoad);
            window.__instance.removeEventListener(HAQuerySelectorEvent.ON_LOVELACE_PANEL_LOAD, window.__onLovelacePanelLoad);
        });

        await page.locator(links, { hasText: 'History' }).click();
        await expect(page.locator(SELECTORS.HEADER_HISTORY)).toBeVisible();

        expect(await page.evaluate(() => window.__onListen.calledOnce)).toBe(true);
        expect(await page.evaluate(() => window.__onPanelLoad.calledOnce)).toBe(true);
        expect(await page.evaluate(() => window.__onLovelacePanelLoad.calledOnce)).toBe(true);

        await page.waitForTimeout(500);

        await page.locator(links, { hasText: 'Overview' }).click();
        await expect(page.locator(SELECTORS.ENTITY_CARD)).toBeVisible();

        expect(await page.evaluate(() => window.__onListen.calledOnce)).toBe(true);
        expect(await page.evaluate(() => window.__onPanelLoad.calledOnce)).toBe(true);
        expect(await page.evaluate(() => window.__onLovelacePanelLoad.calledOnce)).toBe(true);

        await page.waitForTimeout(500);

        await page.evaluate(() => window.__instance.listen());

        expect(await page.evaluate(() => window.__onListen.calledOnce)).toBe(true);
        expect(await page.evaluate(() => window.__onPanelLoad.calledOnce)).toBe(true);
        expect(await page.evaluate(() => window.__onLovelacePanelLoad.calledOnce)).toBe(true);

    });

});