import {ɵgetDOM as getDom} from '@angular/platform-browser';

export function isBrowser() {
  return getDom().supportsDOMEvents();
}
