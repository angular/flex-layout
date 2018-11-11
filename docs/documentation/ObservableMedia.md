The injectable **ObservableMedia** service will provide mediaQuery **activations** notifications for all 
[registered BreakPoints](https://github.com/angular/flex-layout/wiki/Custom-Breakpoints). 

This service is essentially an Observable that exposes both features to subscribe to mediaQuery
changes and a validator method `.isActive()` to test if a mediaQuery (or alias) is
currently active.

> Only mediaChange activations (not deactivations) are announced by the ObservableMedia!

----

### API Summary 

The injectable **ObservableMedia** service has three (3) APIs:

* `subscribe(): Subscription`
* `asObservable(): Observable<MediaChange>`
* `isActive(query: string): boolean`


----

#### 1. **`ObservableMedia::subscribe()`**

```typescript
subscribe(
  next?: (value: MediaChange) => void,
  error?: (error: any) => void,
  complete?: () => void
): Subscription;
```

Developers use Angular DI to inject a reference to the **ObservableMedia** service as a **constructor** parameter. 

Shown below is the service injection and the subscription to the observable: to get programmatic notifications 
regarding mediaQuery activations. 

```typescript
import {Component, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {MediaChange, ObservableMedia} from '@angular/flex-layout';

@Component({
   selector : 'responsive-component'
})
export class MyDemo implements OnDestroy {
  watcher: Subscription;
  activeMediaQuery = '';

  constructor(media: ObservableMedia) {
    this.watcher = media.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `'${change.mqAlias}' = (${change.mediaQuery})` : '';
      if ( change.mqAlias == 'xs') {
         this.loadMobileContent();
      }
    });
  }

  ngOnDestroy() {
    this.watcher.unsubscribe();
  }

  loadMobileContent() { 
    // Do something special since the viewport is currently
    // using mobile display sizes
  }
}
```

This class uses the BreakPoint Registry to inject alias information into the raw MediaChange
notification. For custom mediaQuery notifications, alias information will not be injected and
those fields will be ''.

> This method is useful when the developer is not interested in using RxJS operators (eg `.map()`, `.filter()`).

#### 2. **`ObservableMedia::asObservable()`**


```typescript
asObservable(): Observable<MediaChange>
```

The **ObservableMedia** is not an actual **Observable**. It is a wrapper of an Observable used to publish additional 
methods like `isActive(<alias>). 

Use the `.asObservable()` accessor method to access the **Observable** and use **RxJS** operators; such as 
`media.asObservable().filter(....)`.

> Do not forget to **import** the specific RxJS operators you wish to use!


```typescript
import {Component} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {filter} from 'rxjs/operators/filter';

import {MediaChange, ObservableMedia} from '@angular/flex-layout';

@Component({
   selector : 'responsive-component'
})
export class MyDemo {

  constructor(media: ObservableMedia) {
      media.asObservable()
        .pipe(
          filter((change: MediaChange) => change.mqAlias == 'xs')
        ).subscribe(() => this.loadMobileContent() );
  }

  loadMobileContent() {  }
}
```

#### 3. **`ObservableMedia::isActive()`**

```typescript
isActive(query: string): boolean
```

This method is useful both for expressions in component templates and in component imperative logic. The query can be 
an alias or a mediaQuery. 

For example:

* `print and (max-width: 600px)` is a mediaQuery for printing with mobile viewport sizes.
* `xs` is an alias associated with the mediaQuery for mobile viewport sizes.


```typescript
import {Component, OnInit} from '@angular/core';
import {MediaChange, ObservableMedia} from '@angular/flex-layout';

const PRINT_MOBILE = 'print and (max-width: 600px)';

@Component({
   selector : 'responsive-component',
   template: `
      <div class="ad-content" *ngIf="media.isActive('xs')">
        Only shown if on mobile viewport sizes
      </div>
   `
})
export class MyDemo implements OnInit {
  constructor(public media: ObservableMedia) { }

  ngOnInit() {
    if (this.media.isActive('xs') && !this.media.isActive(PRINT_MOBILE)) {
       this.loadMobileContent();
    }
  }

  loadMobileContent() { /* .... */ }
}
```