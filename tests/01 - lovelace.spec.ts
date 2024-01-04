import { test, expect } from 'playwright-test-coverage';
import { SELECTORS } from './constants';
import { stubGlobalTestElements } from './utils';

test.describe('HAQuerySelector for lovelace dashboards', () => {

    test.beforeEach(async ({ page, context }) => {
        return stubGlobalTestElements(page, context);
	});

    test('All the elements should exist', async ({ page }) => {

        const called = await page.evaluate(() => window.__onPanelLoad.calledOnce);
        expect(called).toBe(true);

        const elements = await page.evaluate(() => window.__onPanelLoad.firstCall.firstArg.detail);
        
        expect(elements).toMatchObject({
            HOME_ASSISTANT: {},
            HOME_ASSISTANT_MAIN: {},
            HA_SIDEBAR: {},
            HA_DRAWER: {},
            PARTIAL_PANEL_RESOLVER: {},
            HA_PANEL_LOVELACE: {},
            HUI_ROOT: {},
            HEADER: {},
            HUI_VIEW: {}
        });

    });

    test('All the elements should be Promises', async ({ page }) => {

        const arePromises = await page.evaluate(() => {
            const elements = [
                'HOME_ASSISTANT',
                'HOME_ASSISTANT_MAIN',
                'HA_SIDEBAR',
                'HA_DRAWER',
                'PARTIAL_PANEL_RESOLVER',
                'HA_PANEL_LOVELACE',
                'HUI_ROOT',
                'HEADER',
                'HUI_VIEW'
            ];
            return elements.every((element) => {
                return window.__onPanelLoad.firstCall.firstArg.detail[element].element instanceof Promise;
            });
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

            const elements = {
                'HOME_ASSISTANT': HOME_ASSISTANT,
                'HOME_ASSISTANT_MAIN': HOME_ASSISTANT_MAIN,
                'HA_SIDEBAR': HA_SIDEBAR,
                'HA_DRAWER': HA_DRAWER,
                'PARTIAL_PANEL_RESOLVER': PARTIAL_PANEL_RESOLVER,
                'HA_PANEL_LOVELACE': HA_PANEL_LOVELACE,
                'HUI_ROOT': HUI_ROOT,
                'HEADER': HEADER,
                'HUI_VIEW': HUI_VIEW
            };

            const results: boolean[] = [];

            for (const entry of Object.entries(elements)) {
                const [key, element] = entry;
                const domElement = await window.__onPanelLoad.firstCall.firstArg.detail[key].element;
                results.push(
                    !!domElement && domElement === element
                );
            }

            return results.every(result => result);

        });

        expect(areTheRightElements).toBe(true);

    });

    test('selector should return the proper elements', async ({ page }) => {

        const areTheRightElements = await page.evaluate(async () => {

            const elements = window.__onPanelLoad.firstCall.firstArg.detail;
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
                    await elements.HOME_ASSISTANT.selector.$.query('home-assistant-main').$.query('ha-drawer').element,
                    await elements.HA_DRAWER.element
                ],
                [
                    await elements.HOME_ASSISTANT.selector.deepQuery('ha-drawer').element,
                    HA_DRAWER
                ],
                [
                    await elements.HOME_ASSISTANT_MAIN.selector.$.query('ha-drawer ha-panel-lovelace').$.query('hui-root').$.query('.header .action-items > ha-button-menu').all,
                    HEADER?.querySelectorAll('.action-items > ha-button-menu')
                ],
                [
                    await elements.HA_PANEL_LOVELACE.selector.$.query('hui-root').$.element,
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

    test('onPanelLoad should be triggered when returning to the dashboard', async ({ page }) => {

        const links = 'paper-listbox > a[role="option"]';

        await page.waitForFunction(() => window.__onPanelLoad.calledOnce);

        await page.locator(links, { hasText: 'History' }).click();

        await expect(page.locator(SELECTORS.HEADER_HISTORY)).toBeVisible();
        
        const calledTwice = await page.evaluate(() => window.__onPanelLoad.calledTwice);

        expect(calledTwice).toBe(false);

        await page.waitForTimeout(500);

        await page.locator(links, { hasText: 'Overview' }).click();

        await expect(page.locator(SELECTORS.ENTITY_CARD)).toBeVisible();

        await page.waitForFunction(() => window.__onPanelLoad.calledTwice);

        await page.waitForTimeout(500);

        const calledThrice = await page.evaluate(async () => {
            window.__instance.listen();
            return window.__onPanelLoad.calledThrice;
        });

        expect(calledThrice).toBe(true);

    });

    test('Remove events should remove the listeners', async ({ page }) => {

        const calledTwice = await page.evaluate(() => {

            const { HAQuerySelectorEvent } = window.HAQuerySelectorBundle;

            window.__instance.removeEventListener(HAQuerySelectorEvent.ON_PANEL_LOAD, window.__onPanelLoad);

            window.__instance.listen();

            return window.__onPanelLoad.calledTwice;

        });

        expect(calledTwice).toBe(false);

    });

});