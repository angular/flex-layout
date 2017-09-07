import { Renderer2, RendererStyleFlags2 } from '@angular/core';
export declare class RendererAdapter {
    private _renderer;
    constructor(_renderer: Renderer2);
    setElementClass(el: any, className: string, isAdd: boolean): void;
    setElementStyle(el: any, styleName: string, styleValue: string): void;
    addClass(el: any, name: string): void;
    removeClass(el: any, name: string): void;
    setStyle(el: any, style: string, value: any, flags?: RendererStyleFlags2): void;
    removeStyle(el: any, style: string, flags?: RendererStyleFlags2): void;
    animate(): any;
    attachViewAfter(): void;
    detachView(): void;
    destroyView(): void;
    createElement(): any;
    createViewRoot(): any;
    createTemplateAnchor(): any;
    createText(): any;
    invokeElementMethod(): void;
    projectNodes(): void;
    selectRootElement(): any;
    setBindingDebugInfo(): void;
    setElementProperty(): void;
    setElementAttribute(): void;
    setText(): void;
    listen(): Function;
    listenGlobal(): Function;
}
