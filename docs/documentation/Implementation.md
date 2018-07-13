The Angular architecture for Layouts eliminates `all` external Flexbox stylesheets and SCSS files formerly used in 
the AngularJS Material Layout implementations.  

This is pure TypeScript, Angular Layout engine that is independent of Angular Material... yet can be used easily 
within any Angular Material application.

The Layout API directives are used to create DOM element style injectors which inject specific, custom Flexbox 
CSS directly as inline styles onto the DOM element. 

For example, consider the use of the `fxLayout="row"` and `fxLayoutAlign="center center"` directives.

Static Markup:

```html
<div [fxLayout]="direction" fxLayoutAlign="center center">
  <div>one</div>
  <div>two</div>
  <div>three</div>
</div>
```

is transformed (at runtime) with inline, injected styles:

```html
<div fxLayout="row" fxLayoutAlign="center center"
      style="display: flex; flex-direction: row; max-width: 100%; 
             box-sizing: border-box; justify-content: center; 
             align-content: center; align-items: center;">
  <div>one</div>
  <div>two</div>
  <div>three</div>
</div>
```

Developers should consult the [API Documentation](https://github.com/angular/flex-layout/wiki/API-Documentation) for 
more details.