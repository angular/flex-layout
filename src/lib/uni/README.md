The `uni` entrypoint is a completely new approach to the Layout library. The emphasis here
is on simplicity, with as little defined in the library as possible. The goal is to create
a utility around the hardest part of layout management: creating and defining interchangeable
builders and coordinating that with the media query system in the browser.

This is a backwards-incompatible approach to the current version of Angular Flex Layout, but
we believe that this approach is more ergonomic in nature, and is the right way of doing things
moving forward. That being said, this is completely opt-in, with no actual plans to transition
anywhere in the near- or long-term.

To use this is quite simple:

### Step 1: Import the new module
```ts
// app.module.ts

@NgModule({
  imports: [UnifiedModule.withDefaults()] // brings in default tags and breakpoints
})
export class AppModule {}
```

### Step 2: Use the new syntax
```html
<div ngl flexAlign="start">
  <bp tag="xs" flexAlign="end"></bp>
  <bp tag="md" flexAlign="center"></bp>
</div>
```

Here, `ngl` stands for "Angular (ng) Layout (l)". The `bp` elements are optional if
you don't plan to use breakpoints in your template. Conceptually, it's cleaner than
cramming all of the breakpoints on one root element, and the `bp` elements don't
actually render in the template anyway.

We've removed the `fx` and `gd` prefixes, since now we can rely on attributes that
are only applicable on the `bp` and root `ngl` elements.

Again, our goal here is simplicity. The most basic usage could be construed as the
following:

```html
<div ngl flex></div>
```

This roughly corresponds to the old syntax for accomplishing the same:

```html
<div fxFlex></div>
```

While users who don't use many attributes per directive may not see a difference,
it will become quite apparent to those who use many, or as you scale.

This is only a proposal, and all feedback is welcome.