import { Page, BrowserContext } from '@playwright/test';
import { expect } from 'playwright-test-coverage';
import path from 'path';
import { BASE_URL, SELECTORS } from './constants';
import { DEFAULT_CONFIG } from '../src/constants';

interface Options {
    pathname?: string;
    retries?: number
    delay?: number
}

export const stubGlobalTestElements = async (
    page: Page,
    context: BrowserContext,
    options?: Options
) => {

    await context.addInitScript({
        path: path.join(__dirname, '..', './node_modules/sinon/pkg/sinon.js'),
    });

    await context.addInitScript(() => {
        window.__onListen = window.sinon.fake();
        window.__onPanelLoad = window.sinon.fake();
        window.__onLovelacePanelLoad = window.sinon.fake();
        window.__onMoreInfoDialogOpen = window.sinon.fake();
        window.__onHistoryAndLogBookDialogOpen = window.sinon.fake();
        window.__onSettingsDialogOpen = window.sinon.fake();
    });

    await page.goto(`${BASE_URL}${options?.pathname ? '/' + options.pathname : ''}`);

    const lovelaceHeader = page.locator(SELECTORS.HEADER);
    const historyHeader = page.locator(SELECTORS.HEADER_HISTORY);

    await expect(lovelaceHeader.or(historyHeader)).toBeVisible();

    await page.waitForFunction(() => !!window.HAQuerySelectorBundle);

    await page.evaluate((options: Options) => {

        const { retries, delay } = options;
        const { HAQuerySelector, HAQuerySelectorEvent } = window.HAQuerySelectorBundle;

        window.__instance = retries || delay
            ? new HAQuerySelector({
                retries: retries || DEFAULT_CONFIG.retries,
                delay: delay || DEFAULT_CONFIG.delay
            })
            : new HAQuerySelector();
        
        window.__instance.addEventListener(
            HAQuerySelectorEvent.ON_LISTEN,
            window.__onListen
        );
        window.__instance.addEventListener(
            HAQuerySelectorEvent.ON_PANEL_LOAD,
            window.__onPanelLoad
        );
        window.__instance.addEventListener(
            HAQuerySelectorEvent.ON_LOVELACE_PANEL_LOAD,
            window.__onLovelacePanelLoad
        );
        window.__instance.addEventListener(
            HAQuerySelectorEvent.ON_MORE_INFO_DIALOG_OPEN,
            window.__onMoreInfoDialogOpen
        );
        window.__instance.addEventListener(
            HAQuerySelectorEvent.ON_HISTORY_AND_LOGBOOK_DIALOG_OPEN,
            window.__onHistoryAndLogBookDialogOpen
        );
        window.__instance.addEventListener(
            HAQuerySelectorEvent.ON_SETTINGS_DIALOG_OPEN,
            window.__onSettingsDialogOpen
        );

        window.__instance.listen();

    }, options || {});
};