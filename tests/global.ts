import sinon, { SinonSpy } from 'sinon';
import { HAQuerySelector, HAQuerySelectorEvent } from '../src';

declare global {
    interface Window {
        HAQuerySelectorBundle: {
            HAQuerySelector: typeof HAQuerySelector;
            HAQuerySelectorEvent: HAQuerySelectorEvent;
        };
        sinon: typeof sinon;
        __onPanelLoad: SinonSpy;
        __onMoreInfoDialogOpen: SinonSpy;
        __onHistoryAndLogBookDialogOpen: SinonSpy;
        __onSettingsDialogOpen: SinonSpy;
        __instance: HAQuerySelector;
    }
  }
  
  export {};