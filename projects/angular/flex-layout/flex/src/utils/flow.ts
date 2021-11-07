import {ɵvalidateValue as validateValue} from '@angular/flex-layout/core';

/**
 * Determine if the validated, flex-direction value specifies
 * a horizontal/row flow.
 */
export function isFlowHorizontal(value: string): boolean {
  let [flow, ] = validateValue(value);
  return flow.indexOf('row') > -1;
}
