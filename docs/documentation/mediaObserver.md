The injectable **MediaObserver** service will provide mediaQuery **activations** notifications for all
[registered BreakPoints](https://github.com/angular/flex-layout/wiki/Custom-Breakpoints).

This service is essentially an Observable that exposes both features to subscribe to mediaQuery
changes and a validator method `.isActive()` to test if a mediaQuery (or alias) is
currently active.

> Only mediaChange activations (not deactivations) are announced by the MediaObserver

---

### API Summary

The injectable **MediaObserver** service has two (2) APIs:

- `asObservable(): Observable<MediaChange>`
- `isActive(query: string): boolean`

---

#### 1. **`MediaObserver::asObservable`**

Developers use Angular DI to inject a reference to the **MediaObserver** service as a **constructor** parameter.

The **MediaObserver** is not an actual **Observable**. It is a wrapper of an Observable used to publish additional methods like `isActive(<alias>).

```typescript
asObservable(): Observable<MediaChange>
```

Use the `.asObservable()` accessor method to access the **Observable** and use **RxJS** operators; such as `media.asObservable().filter(....)`.

> Do not forget to **import** the specific RxJS operators you wish to use!

```typescript
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(private mediaObserver: MediaObserver) {}
  private mediaSubscription!: Subscription;
  private activeMediaQuery: = '';

  ngOnInit(): void {
    this.mediaSubscription = this.mediaObserver
      .asObservable()
      .subscribe((change) => {
        change.forEach((item) => {
          this.activeMediaQuery = item
            ? `'${item.mqAlias}' = (${item.mediaQuery})`
            : '';
          if (item.mqAlias === 'xs') {
            this.loadMobileContent();
          }
          console.log('activeMediaQuery', this.activeMediaQuery);
        });
      });
  }

  loadMobileContent() {
    // Do something special since the viewport is currently
    // using mobile display sizes.
  }

  ngOnDestroy(): void {
    this.mediaSubscription.unsubscribe();
  }
}
```

This class uses the BreakPoint Registry to inject alias information into the raw MediaChange
notification. For custom mediaQuery notifications, alias information will not be injected and
those fields will be an empty string [''].

> This method is useful when the developer is not interested in using RxJS operators (eg `.map()`, `.filter()`).

#### 2. **`MediaObserver::asObservable()`**

```typescript
import { Component } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { filter } from 'rxjs/operators/filter';

import { MediaChange, MediaObserver } from '@angular/flex-layout';

@Component({
  selector: 'responsive-component',
})
export class MyDemo {
  constructor(media: MediaObserver) {
    media
      .asObservable()
      .pipe(filter((change: MediaChange[]) => change[0].mqAlias == 'xs'))
      .subscribe(() => {
        this.loadMobileContent();
      });

  loadMobileContent() {}
}
```

#### 3. **`MediaObserver::isActive()`**

```typescript
isActive(query: string): boolean
```

This method is useful both for expressions in component templates and in component imperative logic. The query can be an alias or a mediaQuery.

For example:

- `print and (max-width: 600px)` is a mediaQuery for printing with mobile viewport sizes.
- `xs` is an alias associated with the mediaQuery for mobile viewport sizes.

```typescript
import { Component, OnInit } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';

const PRINT_MOBILE = 'print and (max-width: 600px)';

@Component({
  selector: 'responsive-component',
  template: `
    <div class="ad-content" *ngIf="media.isActive('xs')">
      Only shown if on mobile viewport sizes
    </div>
  `,
})
export class MyDemo implements OnInit {
  constructor(public media: MediaObserver) {}

  ngOnInit() {
    if (this.media.isActive('xs') && !this.media.isActive(PRINT_MOBILE)) {
      this.loadMobileContent();
    }
  }

  loadMobileContent() {
    /* .... */
  }
}
```
