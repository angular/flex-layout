/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Inject, Injectable} from '@angular/core';
import {Directionality} from '@angular/cdk/bidi';
import {MediaMatcher} from '@angular/cdk/layout';

import {UnifiedDirective} from './unified';
import {BPS, Breakpoint} from './breakpoint';
import {Tag, ValuePriority} from './tags/tag';
import {TAGS} from './tags/tags';
import {DIR_KEY, KEY_DELIMITER, NO_VALUE, PARENT_KEY, SELF_KEY, STYLE_KEY} from './constants';


/**
 * GrandCentral is a switchyard for all of the various Layout directives
 * registered in an application. It is the single source of truth for all of
 * the layout changes that occur in an application. For instance, any changes
 * to the browser state via registered media queries are monitored and updated
 * in this service. The directives themselves simply store their respective values
 * for each of the media states.
 */
@Injectable({providedIn: 'root'})
export class GrandCentral {
  private mediaQueries: Map<string, MediaQueryList> = new Map();
  private activations: Breakpoint[] = [];
  private activating: boolean = false;
  private elementsMap: Map<Breakpoint, Set<UnifiedDirective>> = new Map();
  private elementDataMap: Map<UnifiedDirective, Map<string, string>> = new Map();
  private dirListeners: Set<UnifiedDirective> = new Set();
  private elListeners: Map<UnifiedDirective, Set<UnifiedDirective>> = new Map();

  constructor(private readonly directionality: Directionality,
              mediaMatcher: MediaMatcher,
              @Inject(BPS) private readonly bps: Breakpoint[],
              @Inject(TAGS) private readonly tags: Map<string, Tag>) {
    bps.forEach(bp => {
      this.elementsMap.set(bp, new Set());
      const mediaQueryList = mediaMatcher.matchMedia(bp.media);
      this.mediaQueries.set(bp.name, mediaQueryList);
      mediaQueryList.addListener(e => {
        const activate = e.matches && this.activations.indexOf(bp) === -1;
        const deactivate = !e.matches && this.activations.indexOf(bp) > -1;
        if (!this.activating && (activate || deactivate)) {
          this.dirListeners.clear();
          this.elListeners.clear();
          this.activating = true;
          this.computeValues();
        }
      });
    });
    this.computeActivations();
    directionality.change.subscribe(() => this.dirListeners.forEach(this.addValues));
  }

  /** Add a directive for a corresponding breakpoint */
  addDirective(dir: UnifiedDirective, bp: Breakpoint) {
    this.elementsMap.get(bp)!.add(dir);
    this.updateDirective(dir);
  }

  /** Trigger an update for a directive */
  updateDirective(dir: UnifiedDirective) {
    this.computeDirective(dir);
    this.addValues(dir);
    const listeners = this.elListeners.get(dir);
    if (listeners) {
      listeners.forEach(this.addValues);
    }
  }

  /** Remove a directive from all future updates */
  removeDirective(dir: UnifiedDirective) {
    this.dirListeners.delete(dir);
    const parentListeners = this.elListeners.get(dir.parent);
    if (parentListeners) {
      parentListeners.delete(dir);
    }
    this.bps.forEach(bp => this.elementsMap.get(bp)!.delete(dir));
  }

  /** Compute the active breakpoints and sort by descending priority */
  private computeActivations() {
    this.activations = this.bps
      .filter(bp => this.mediaQueries.get(bp.name)!.matches)
      .sort((a, b) => b.priority - a.priority);
  }

  /** Compute the values and update the directives for all active breakpoints */
  private computeValues() {
    this.computeActivations();
    this.activations.forEach(bp =>
      this.elementsMap.get(bp)!.forEach(this.computeDirective.bind(this)));
    Array.from(this.elementDataMap.keys()).forEach(this.addValues.bind(this));
    this.activating = false;
  }

  /** Compute the values for an individual directive */
  private computeDirective(dir: UnifiedDirective) {
    const values: Map<string, string> = new Map();
    this.activations.forEach(bp => {
      const valueMap = dir.valueMap.get(bp.name);

      if (valueMap) {
        valueMap.forEach((value, key) => {
          if (!values.has(key)) {
            values.set(key, value);
          }
        });
      }
    });

    this.elementDataMap.set(dir, values);
  }

  /** Add the computed values for an individual directive */
  private addValues(dir: UnifiedDirective) {
    const values = this.elementDataMap.get(dir)!;
    const map: Map<string, ValuePriority> = new Map();
    values.forEach((value, key) => {
      const tag = this.tags.get(key)!;
      const priorityMap = this.calculate(tag.tag, value, dir);
      priorityMap.forEach((v, k) => {
        let [type, typeKey] = k.split(KEY_DELIMITER);
        if (typeKey === undefined) {
          typeKey = type;
          type = STYLE_KEY;
        }
        k = [type, typeKey].join(KEY_DELIMITER);
        const valuePriority = map.get(k);
        if (!valuePriority || valuePriority.priority < v.priority) {
          map.set(k, v);
        }
      });
    });

    dir.apply(map);
  }

  /** Compute the values to apply for a directive given a tag and input value */
  private calculate(tagName: string,
                    value: string,
                    dir: UnifiedDirective): Map<string, ValuePriority> {
    const tag = this.tags.get(tagName)!;
    const args = this.resolve(dir, tag.deps);
    return tag.compute(value, ...args);
  }

  /** Resolve the arguments for a builder given a directive */
  private resolve(dir: UnifiedDirective, deps: string[]): string[] {
    return deps.map(dep => {
      const keys = dep.split(KEY_DELIMITER);
      if (keys.length > 1 && keys[0] === PARENT_KEY || keys[0] === SELF_KEY) {
        // NOTE: elListeners does not account for directionality change, because
        // the assumption is that directionality does not change the parent values
        const dataMap = this.elementDataMap.get(keys[0] === PARENT_KEY ? dir.parent : dir);
        if (dataMap) {
          const elements = this.elListeners.get(dir.parent) || new Set();
          elements.add(dir);
          this.elListeners.set(dir.parent, elements);
          return dataMap.get(keys[1]) ?? NO_VALUE;
        }
      } else if (dep === DIR_KEY) {
        this.dirListeners.add(dir);
        return this.directionality.value;
      }

      return NO_VALUE;
    });
  }
}
