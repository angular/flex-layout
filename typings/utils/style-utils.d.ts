import { Renderer2 } from '@angular/core';
export declare type StyleDefinition = string | {
    [property: string]: string | number;
};
export declare function applyStyleToElement(renderer: Renderer2, element: any, style: StyleDefinition, value?: string | number): void;
export declare function applyStyleToElements(renderer: Renderer2, style: StyleDefinition, elements: HTMLElement[]): void;
export declare function applyMultiValueStyleToElement(styles: {}, element: any, renderer: Renderer2): void;
export declare function lookupInlineStyle(element: HTMLElement, styleName: string): string;
export declare function lookupStyle(element: HTMLElement, styleName: string, inlineOnly?: boolean): string;
