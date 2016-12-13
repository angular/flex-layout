# Angular Flex-Layout Coding Standards


## Code style

The [Google JavaScript Style Guide](https://google.github.io/styleguide/jsguide.html) is the
basis for our coding style, with additional guidance here where that style guide is not aligned with
ES6 or TypeScript.

## Coding practices

### General

#### Write useful comments
Comments that explain what some block of code does are nice; they can tell you something in less time than it would take to follow through the code itself.

Comments that explain why some block of code exists at all, or does something the way it does, 
are _invaluable_. The "why" is difficult, or sometimes impossible, to track down without seeking out 
the original author. When collaborators are in the same room, this hurts productivity. 
When collaborators are in different timezones, this can be devastating to productivity.

For example, this is a not-very-useful comment:
```ts
// Set default tabindex.
if (!$attrs['tabindex']) {
  $element.attr('tabindex', '-1');
}
```

While this is much more useful:
```ts
// Unless the user specifies so, the calendar should not be a tab stop.
// This is necessary because ngAria might add a tabindex to anything with an ng-model
// (based on whether or not the user has turned that particular feature on/off).
if (!$attrs['tabindex']) {
  $element.attr('tabindex', '-1');
}
```

#### Prefer more focused, granular components vs. complex, configurable components.

For example, rather than doing this:
```html
<md-button>Basic button</md-button>
<md-button class="md-fab">FAB</md-button>
<md-button class="md-icon-button">pony</md-button>
```

do this:
```html
<md-button>Basic button</md-button>
<md-fab>FAB</md-fab>
<md-icon-button>pony</md-icon-button>
```

#### Prefer small, focused modules
Keeping modules to a single responsibility makes the code easier to test, consume, and maintain. 
ES6 modules offer a straightforward way to organize code into logical, granular units. 
Ideally, individual files are 200 - 300 lines of code.

#### Less is more
Once a feature is released, it never goes away. We should avoid adding features that don't offer 
high user value for price we pay both in maintenance, complexity, and payload size. When in doubt, 
leave it out. 

This applies especially so to providing two different APIs to accomplish the same thing. Always 
prefer sticking to a _single_ API for accomplishing something. 

### TypeScript

#### Provide function descriptions
For functions that are more complicated than a simple getter/setter, provide at least a brief 
sentence explaining what the function does and/or _why_ it does something.

