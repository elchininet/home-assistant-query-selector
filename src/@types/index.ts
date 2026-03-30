import { AsyncSelector, AsyncParams } from 'shadow-dom-selector';

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

interface HAQuerySelectorEventListenerObject<T> {
    handleEvent(object: CustomEvent<T>): void;
}

interface HAQuerySelectorEventListener<T> {
    (evt: CustomEvent<T>): void;
}

export type HAQuerySelectorEventListenerOrEventListenerObject<T> =
    | HAQuerySelectorEventListener<T>
    | HAQuerySelectorEventListenerObject<T>
    | null;
