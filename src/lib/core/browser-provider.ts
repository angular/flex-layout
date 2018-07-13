/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {APP_BOOTSTRAP_LISTENER, PLATFORM_ID, InjectionToken} from '@angular/core';
import {DOCUMENT, isPlatformBrowser} from '@angular/common';

/**
 * Find all of the server-generated stylings, if any, and remove them
 * This will be in the form of inline classes and the style block in the
 * head of the DOM
 */
export function removeStyles(_document: Document, platformId: Object) {
  return () => {
    if (isPlatformBrowser(platformId)) {
      const elements = Array.from(_document.querySelectorAll(`[class*=${CLASS_NAME}]`));

      // RegExp constructor should only be used if passing a variable to the constructor.
      // When using static regular expression it is more performant to use reg exp literal.
      // This is also needed to provide Safari 9 compatibility, please see
      // https://stackoverflow.com/questions/37919802 for more discussion.
      const classRegex = /\bflex-layout-.+?\b/g;
      elements.forEach(el => {
        el.classList.contains(`${CLASS_NAME}ssr`) && el.parentNode ?
          el.parentNode.removeChild(el) : el.className.replace(classRegex, '');
      });
    }
  };
}

/**
 *  Provider to remove SSR styles on the browser
 */
export const BROWSER_PROVIDER = {
  provide: <InjectionToken<(() => void)[]>>APP_BOOTSTRAP_LISTENER,
  useFactory: removeStyles,
  deps: [DOCUMENT, PLATFORM_ID],
  multi: true
};

export const CLASS_NAME = 'flex-layout-';
