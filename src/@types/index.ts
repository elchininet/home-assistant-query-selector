import { AsyncSelector, AsyncParams } from 'shadow-dom-selector';

export type HAQuerySelectorConfig = AsyncParams;

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

export interface HAQuerySelectorEventListener<T> {
    (evt: CustomEvent<T>): void;
}
