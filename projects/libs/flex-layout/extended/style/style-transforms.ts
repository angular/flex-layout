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

/** NgStyle allowed inputs */
export class NgStyleKeyValue {
  constructor(public key: string, public value: string, noQuotes = true) {
    this.key = noQuotes ? key.replace(/['"]/g, '').trim() : key.trim();

    this.value = noQuotes ? value.replace(/['"]/g, '').trim() : value.trim();
    this.value = this.value.replace(/;/, '');
  }
}

export function getType(target: any): string {
  let what = typeof target;
  if (what === 'object') {
    return (target.constructor === Array) ? 'array' :
        (target.constructor === Set) ? 'set' : 'object';
  }
  return what;
}

/**
 * Split string of key:value pairs into Array of k-v pairs
 * e.g.  'key:value; key:value; key:value;' -> ['key:value',...]
 */
export function buildRawList(source: any, delimiter = ';'): NgStyleRawList {
  return String(source)
      .trim()
      .split(delimiter)
      .map((val: string) => val.trim())
      .filter(val => val !== '');
}

/** Convert array of key:value strings to a iterable map object */
export function buildMapFromList(styles: NgStyleRawList, sanitize?: NgStyleSanitizer): NgStyleMap {
  const sanitizeValue = (it: NgStyleKeyValue) => {
    if (sanitize) {
      it.value = sanitize(it.value);
    }
    return it;
  };

  return styles
      .map(stringToKeyValue)
      .filter(entry => !!entry)
      .map(sanitizeValue)
      .reduce(keyValuesToMap, {} as NgStyleMap);
}

/** Convert Set<string> or raw Object to an iterable NgStyleMap */
export function buildMapFromSet(source: NgStyleType, sanitize?: NgStyleSanitizer): NgStyleMap {
  let list: string[] = [];
  if (getType(source) === 'set') {
    (source as Set<string>).forEach(entry => list.push(entry));
  } else {
    Object.keys(source).forEach((key: string) => {
      list.push(`${key}:${(source as NgStyleMap)[key]}`);
    });
  }
  return buildMapFromList(list, sanitize);
}


/** Convert 'key:value' -> [key, value] */
export function stringToKeyValue(it: string): NgStyleKeyValue {
  const [key, ...vals] = it.split(':');
  return new NgStyleKeyValue(key, vals.join(':'));
}

/** Convert [ [key,value] ] -> { key : value } */
export function keyValuesToMap(map: NgStyleMap, entry: NgStyleKeyValue): NgStyleMap {
  if (!!entry.key) {
    map[entry.key] = entry.value;
  }
  return map;
}
