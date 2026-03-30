import { AsyncSelector, AsyncParams } from 'shadow-dom-selector';
import {
    HAQuerySelectorEvent,
    HA_ROOT_ELEMENT,
    HA_LOVELACE_ELEMENT,
    HA_DIALOG_ELEMENT
} from '@constants';

export type HAQuerySelectorConfig = AsyncParams & {
    eventThreshold?: number;
};

export type NodeDescriptorProps = {
    selector: string,
    children?: HomeAssistantNodeDescriptor;
};

export type HomeAssistantNodeDescriptor = {
    [key: string]: NodeDescriptorProps;
};

export type ElementProps = {
    element: Promise<Element | null>;
    children?: HomeAssistantElement;
    selector: AsyncSelector<Element>;
};

export type HomeAssistantElement = {
    [key: string]: ElementProps;
};

export type HAElement = Omit<ElementProps, 'children'>;

interface HAQuerySelectorEventListenerFunction<T> {
    (evt: CustomEvent<T>): void;
}

interface HAQuerySelectorEventListenerObject<T> {
    handleEvent(object: CustomEvent<T>): void;
}

export type HAQuerySelectorEventListener<T> =
    | HAQuerySelectorEventListenerFunction<T>
    | HAQuerySelectorEventListenerObject<T>
    | null;

export type OnListenDetail = Record<
    keyof typeof HA_ROOT_ELEMENT,
    HAElement
>;

export type OnPanelLoadDetail = Record<
    keyof typeof HA_ROOT_ELEMENT,
    HAElement
>;

export type OnLovelacePanelLoadDetail = Record<
    keyof typeof HA_ROOT_ELEMENT |
    keyof typeof HA_LOVELACE_ELEMENT,
    HAElement
>;

export type OnMoreInfoDialogOpenDetail = Record<
    Exclude<
        keyof typeof HA_DIALOG_ELEMENT,
        | 'HA_DIALOG_MORE_INFO_HISTORY_AND_LOGBOOK'
        | 'HA_DIALOG_MORE_INFO_SETTINGS'
    >,
    HAElement
>;

export type OnHistoryAndLogBookDialogOpenDetail = Record<
    Exclude<
        keyof typeof HA_DIALOG_ELEMENT,
        | 'HA_MORE_INFO_DIALOG_INFO'
        | 'HA_DIALOG_MORE_INFO_SETTINGS'
    >,
    HAElement
>;

export type OnSettingsDialogOpenDetail = Record<
    Exclude<
        keyof typeof HA_DIALOG_ELEMENT,
        | 'HA_MORE_INFO_DIALOG_INFO'
        | 'HA_DIALOG_MORE_INFO_HISTORY_AND_LOGBOOK'
    >,
    HAElement
>;

export interface HAQuerySelectorEventListenerEventMap {
    [HAQuerySelectorEvent.ON_LISTEN]: HAQuerySelectorEventListener<OnListenDetail>;
    [HAQuerySelectorEvent.ON_PANEL_LOAD]: HAQuerySelectorEventListener<OnPanelLoadDetail>;
    [HAQuerySelectorEvent.ON_LOVELACE_PANEL_LOAD]: HAQuerySelectorEventListener<OnLovelacePanelLoadDetail>;
    [HAQuerySelectorEvent.ON_MORE_INFO_DIALOG_OPEN]: HAQuerySelectorEventListener<OnMoreInfoDialogOpenDetail>;
    [HAQuerySelectorEvent.ON_HISTORY_AND_LOGBOOK_DIALOG_OPEN]: HAQuerySelectorEventListener<OnHistoryAndLogBookDialogOpenDetail>;
    [HAQuerySelectorEvent.ON_SETTINGS_DIALOG_OPEN]: HAQuerySelectorEventListener<OnSettingsDialogOpenDetail>;
}