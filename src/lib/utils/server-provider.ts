/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {
  APP_BOOTSTRAP_LISTENER,
  PLATFORM_ID,
  RendererFactory2,
  RendererType2,
  InjectionToken,    // tslint:disable-line:no-unused-variable
  ComponentRef,      // tslint:disable-line:no-unused-variable
  ViewEncapsulation,
  Renderer2,
} from '@angular/core';
import {DOCUMENT, isPlatformBrowser} from '@angular/common';
import {ServerStylesheet} from './server-stylesheet';
import {BREAKPOINTS} from '../media-query/breakpoints/break-points-token';
import {BreakPoint} from '../media-query/breakpoints/break-point';
import {MatchMedia} from '../media-query/match-media';

const CLASS_NAME = 'flex-layout-';
let UNIQUE_CLASS = 0;

/**
 * create @media queries based on a virtual stylesheet
 * * Adds a unique class to each element and stores it
 *   in a shared classMap for later reuse
 */
function formatStyle(stylesheet: Map<HTMLElement, Map<string, string>>,
                     renderer: Renderer2,
                     mediaQuery: string,
                     classMap: Map<HTMLElement, string>) {
  let styleText = `
        @media ${mediaQuery} {`;
  stylesheet.forEach((styles, el) => {
    let className = classMap.get(el);
    if (!className) {
      className = `${CLASS_NAME}${UNIQUE_CLASS++}`;
      classMap.set(el, className);
    }
    renderer.addClass(el, className);
    styleText += `
          .${className} {`;
    styles.forEach((v, k) => {
      if (v) {
        styleText += `
              ${k}: ${v};`;
      }
    });
    styleText += `
          }`;
  });
  styleText += `
        }\n`;

  return styleText;
}

/**
 * format the static @media queries for all breakpoints
 * to be used on the server and append them to the <head>
 */
function serverStyles(renderer: Renderer2,
                      serverSheet: ServerStylesheet,
                      breakpoints: BreakPoint[],
                      matchMedia: MatchMedia,
                      _document: any) {
  const styleTag = renderer.createElement('style');
  const classMap = new Map<HTMLElement, string>();
  const defaultStyles = new Map(serverSheet.stylesheet);
  let styleText = formatStyle(defaultStyles, renderer, 'all', classMap);

  breakpoints.reverse();
  breakpoints.forEach((bp, i) => {
    serverSheet.clearStyles();

    if (i > 0) {
      matchMedia.deactivateBreakpoint(breakpoints[i - 1]);
    }

    matchMedia.activateBreakpoint(bp);
    const stylesheet = new Map(serverSheet.stylesheet);
    if (stylesheet.size > 0) {
      styleText += formatStyle(stylesheet, renderer, bp.mediaQuery, classMap);
    }
  });

  renderer.addClass(styleTag, `${CLASS_NAME}ssr`);
  renderer.setValue(styleTag, styleText);
  renderer.appendChild(_document.head, styleTag);
}

/**
 * Add or remove static styles depending on the current
 * platform
 */
export function addStyles(serverSheet: ServerStylesheet,
                          matchMedia: MatchMedia,
                          _document: Document,
                          rendererFactory: RendererFactory2,
                          platformId: Object,
                          breakpoints: BreakPoint[]) {
  // necessary because of angular/angular/issues/14485
  const res = () => {
    const renderType: RendererType2 = {
      id: '-1',
      encapsulation: ViewEncapsulation.None,
      styles: [],
      data: {}
    };
    const renderer = rendererFactory.createRenderer(_document, renderType);
    if (!isPlatformBrowser(platformId)) {
      serverStyles(renderer, serverSheet, breakpoints, matchMedia, _document);
    } else {
      const elements = Array.from(_document.querySelectorAll(`[class*=${CLASS_NAME}]`));
      const classRegex = new RegExp(/\bflex-layout-.+?\b/, 'g');
      elements.forEach(el => {
        el.classList.contains(`${CLASS_NAME}ssr`) ?
          el.remove() : el.className.replace(classRegex, '');
      });
    }
  };

  return res;
}

/**
 *  Provider to set static styles on the server and remove
 *  them on the browser
 */
export const SERVER_PROVIDER = {
  provide: APP_BOOTSTRAP_LISTENER,
  useFactory: addStyles,
  deps: [
    ServerStylesheet,
    MatchMedia,
    DOCUMENT,
    RendererFactory2,
    PLATFORM_ID,
    BREAKPOINTS,
  ],
  multi: true
};
