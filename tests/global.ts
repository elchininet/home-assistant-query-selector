import sinon, { SinonSpy } from 'sinon';
import { HAQuerySelector, HAQuerySelectorEvent } from '../src';

declare global {
    interface Window {
        HAQuerySelectorBundle: {
            HAQuerySelector: typeof HAQuerySelector;
            HAQuerySelectorEvent: HAQuerySelectorEvent;
        };
        sinon: typeof sinon;
        __onListen: SinonSpy;
        __onPanelLoad: SinonSpy;
        __onLovelacePanelLoad: SinonSpy;
        __onMoreInfoDialogOpen: SinonSpy;
        __onHistoryAndLogBookDialogOpen: SinonSpy;
        __onSettingsDialogOpen: SinonSpy;
        __instance: HAQuerySelector;
    }
}
  
export {};