export function isDefined(value) {
  return typeof value !== 'undefined';
}


export function delay(fn, duration:number = 1, scope:any = null) {
  if ( scope ) fn = fn.bind(scope);
  setTimeout(()=> fn(),duration);
}
