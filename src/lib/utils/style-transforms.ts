/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

export type NgStyleRawList = string[];
export type NgStyleMap = {[klass: string]: string};
// NgStyle selectors accept NgStyleType values
export type NgStyleType = string | Set<string> | NgStyleRawList | NgStyleMap;

/**
 * Callback function for SecurityContext.STYLE sanitization
 */
export type NgStyleSanitizer = (val: any) => string;

/**
 * NgStyle allowed inputs
 */
export class NgStyleKeyValue {
  constructor(public key: string, public value: string, noQuotes = true) {
    this.key = noQuotes ? key.replace(/['"]/g, '').trim() : key.trim();

    this.value = noQuotes ? value.replace(/['"]/g, '').trim() : value.trim();
    this.value = this.value.replace(/;/, '');
  }
}

/**
 * Transform Operators for @angular/flex-layout NgStyle Directive
 */
export const ngStyleUtils = {
  getType,
  buildRawList,
  buildMapFromList,
  buildMapFromSet
};

function getType(target: any): string {
  let what = typeof target;
  if (what === 'object') {
    return (target.constructor === Array) ? 'array' :
        (target.constructor === Set ) ? 'set' : 'object';
  }
  return what;
}

/**
 * Split string of key:value pairs into Array of k-v pairs
 * e.g.  'key:value; key:value; key:value;' -> ['key:value',...]
 */
function buildRawList(source: any, delimiter = ';'): NgStyleRawList {
  return String(source)
      .trim()
      .split(delimiter)
      .map((val: string) => val.trim())
      .filter(val => val !== '');
}

/**
 * Convert array of key:value strings to a iterable map object
 */
function buildMapFromList(styles: NgStyleRawList, sanitize?: NgStyleSanitizer): NgStyleMap {
  let sanitizeValue = (it: NgStyleKeyValue) => {
    if (sanitize) {
      it.value = sanitize(it.value);
    }
    return it;
  };

  return styles
      .map(stringToKeyValue)
      .filter(entry => !!entry)
      .map(sanitizeValue)
      .reduce(keyValuesToMap, {});
}

/**
 * Convert Set<string> or raw Object to an iterable NgStyleMap
 */
function buildMapFromSet(source: any, sanitize?: NgStyleSanitizer): NgStyleMap {
  let list = new Array<string>();
  if (getType(source) == 'set') {
    source.forEach(entry => list.push(entry));
  } else {                                // simple hashmap
    Object.keys(source).forEach(key => {
      list.push(`${key}:${source[key]}`);
    });
  }
  return buildMapFromList(list, sanitize);
}


/**
 * Convert 'key:value' -> [key, value]
 */
function stringToKeyValue(it: string): NgStyleKeyValue|null {
  let [key, val] = it.split(':');
  return val ? new NgStyleKeyValue(key, val) : null;
}

/**
 * Convert [ [key,value] ] -> { key : value }
 */
function keyValuesToMap(map: NgStyleMap, entry: NgStyleKeyValue): NgStyleMap {
  if (!!entry.key) {
    map[entry.key] = entry.value;
  }
  return map;
}
