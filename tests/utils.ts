import { Page } from '@playwright/test';
import { expect } from 'playwright-test-coverage';
import path from 'path';
import { BASE_URL, SELECTORS } from './constants';

interface Options {
    pathname?: string;
    retries?: number;
    delay?: number;
    eventThreshold?: number;
    nonLovelace?: boolean;
}

export const stubGlobalTestElements = async (
    page: Page,
    options?: Options
) => {

    await page.addInitScript({
        path: path.join(__dirname, '..', './node_modules/sinon/pkg/sinon.js'),
    });

    await page.goto(`${BASE_URL}${options?.pathname ? '/' + options.pathname : ''}`);

    const huiViewContainer = page.locator(SELECTORS.HU_VIEW_CONTAIER);
    const historyHeader = page.locator(SELECTORS.HEADER_HISTORY);

    await expect(huiViewContainer.or(historyHeader)).toBeVisible();

    await page.waitForFunction(() => !!window.HAQuerySelectorBundle);

    await page.evaluate((options: Options) => {

        const { retries, delay, eventThreshold } = options;
        const { HAQuerySelector, HAQuerySelectorEvent } = window.HAQuerySelectorBundle;

        window.__onListen = window.sinon.fake();
        window.__onPanelLoad = window.sinon.fake();
        window.__onLovelacePanelLoad = window.sinon.fake();
        window.__onMoreInfoDialogOpen = window.sinon.fake();
        window.__onHistoryAndLogBookDialogOpen = window.sinon.fake();
        window.__onSettingsDialogOpen = window.sinon.fake();

        window.__instance = retries || delay || eventThreshold
            ? new HAQuerySelector({
                retries: retries || 100,
                delay: delay || 50,
                eventThreshold: eventThreshold || 450
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
    // Timeout to allow the events to be triggered
    await page.waitForTimeout(500);
    await page.waitForFunction(() => window.__onListen.calledOnce);
    await page.waitForFunction(() => window.__onPanelLoad.calledOnce);
    if (options?.nonLovelace !== true) {
        await page.waitForFunction(() => window.__onLovelacePanelLoad.calledOnce);
    }
};