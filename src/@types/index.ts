export type HAQuerySelectorConfig = {
    retries?: number;
    delay?: number;
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
    querySelector: <E extends Element = Element>(selector: string, asyncProps?: HAQuerySelectorConfig) => Promise<E | null>;
    querySelectorAll: <E extends Element = Element>(selector: string, asyncProps?: HAQuerySelectorConfig) => Promise<NodeListOf<E>>;
    shadowRootQuerySelector: (selector: string, asyncProps?: HAQuerySelectorConfig) => Promise<ShadowRoot | null>;
};

export type HomeAssistantElement = {
    [key: string]: ElementProps;
};

export type HAElement = Omit<ElementProps, 'children'>;
