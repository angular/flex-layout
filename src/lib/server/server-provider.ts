/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {InjectionToken} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {BEFORE_APP_SERIALIZED} from '@angular/platform-server';
import css from 'beautify';

import {
  BreakPoint,
  BREAKPOINTS,
  CLASS_NAME,
  MatchMedia,
  ServerStylesheet,
  SERVER_TOKEN,
  ServerMatchMedia
} from '@angular/flex-layout';

let nextId = 0;
const IS_DEBUG_MODE = false;

/**
 * create @media queries based on a virtual stylesheet
 * * Adds a unique class to each element and stores it
 *   in a shared classMap for later reuse
 * @param stylesheet the virtual stylesheet that stores styles for each
 *        element
 * @param mediaQuery the given @media CSS selector for the current breakpoint
 * @param classMap the map of HTML elements to class names to avoid duplications
 */
function generateCss(stylesheet: Map<HTMLElement, Map<string, string|number>>,
                     mediaQuery: string,
                     classMap: Map<HTMLElement, string>) {
  let styleText = `@media ${mediaQuery}{`;
  stylesheet.forEach((styles, el) => {
    let className = classMap.get(el);
    if (!className) {
      className = `${CLASS_NAME}${nextId++}`;
      classMap.set(el, className);
    }
    el.classList.add(className);
    styleText += `.${className}{`;
    styles.forEach((v, k) => {
      if (v) {
        styleText += `${k}:${v};`;
      }
    });
    styleText += '}';
  });
  styleText += '}';

  return IS_DEBUG_MODE ? css(styleText, {format: 'css'}) : styleText;
}

/**
 * Activate all of the registered breakpoints in sequence, and then
 * retrieve the associated stylings from the virtual stylesheet
 * @param serverSheet the virtual stylesheet that stores styles for each
 *        element
 * @param matchMedia the service to activate/deactive breakpoints
 * @param breakpoints the registered breakpoints to activate/deactivate
 */
export function generateStaticFlexLayoutStyles(serverSheet: ServerStylesheet,
                                               matchMedia: MatchMedia,
                                               breakpoints: BreakPoint[]) {
  // Store the custom classes in the following map, that way only
  // one class gets allocated per HTMLElement, and each class can
  // be referenced in the static media queries
  const classMap = new Map<HTMLElement, string>();

  // Get the initial stylings for all of the directives, and initialize
  // the fallback block of stylings, then reverse the breakpoints list
  // to traverse in the proper order
  const defaultStyles = new Map(serverSheet.stylesheet);
  let styleText = generateCss(defaultStyles, 'all', classMap);

  breakpoints.reverse();
  breakpoints.forEach((bp, i) => {
    serverSheet.clearStyles();
    (matchMedia as ServerMatchMedia).activateBreakpoint(bp);
    const stylesheet = new Map(serverSheet.stylesheet);
    if (stylesheet.size > 0) {
      styleText += generateCss(stylesheet, bp.mediaQuery, classMap);
    }
    (matchMedia as ServerMatchMedia).deactivateBreakpoint(breakpoints[i]);
  });

  return styleText;
}

/**
 * Create a style tag populated with the dynamic stylings from Flex
 * components and attach it to the head of the DOM
 */
export function FLEX_SSR_SERIALIZER_FACTORY(serverSheet: ServerStylesheet,
                                            matchMedia: MatchMedia,
                                            _document: Document,
                                            breakpoints: BreakPoint[]) {
  return () => {
    // This is the style tag that gets inserted into the head of the DOM,
    // populated with the manual media queries
    const styleTag = _document.createElement('style');
    const styleText = generateStaticFlexLayoutStyles(serverSheet, matchMedia, breakpoints);
    styleTag.classList.add(`${CLASS_NAME}ssr`);
    styleTag.textContent = styleText;
    _document.head.appendChild(styleTag);
  };
}

/**
 *  Provider to set static styles on the server
 */
export const SERVER_PROVIDERS = [
  {
    provide: <InjectionToken<() => void>>BEFORE_APP_SERIALIZED,
    useFactory: FLEX_SSR_SERIALIZER_FACTORY,
    deps: [
      ServerStylesheet,
      MatchMedia,
      DOCUMENT,
      BREAKPOINTS,
    ],
    multi: true
  },
  {
    provide: SERVER_TOKEN,
    useValue: true
  },
  {
    provide: MatchMedia,
    useClass: ServerMatchMedia
  }
];
