The ImgSrcsetDirective is a smart API purposed to extend the *`<img srcset>`* attribute.

*  Image used as isolated tag: `<img>` 
*  Image used as nested tag within a `<picture>` element

This API makes it super easy to add progressive images to your HTML... by using the Flex-Layout "Responsive API" notation:  

*  `[srcset]`
*  `[srcset.xs]`
*  `[srcset.md]`
*  ...

<br/>&nbsp;

### Isolated Img 

When **not nested** within a `<picture>` DOM element, the Image element may specify both `src` and `srcset` attributes.

```html
  <img src="" srcset="">
```


##### References

<br/>&nbsp;

----

### Picture + Image

When **nested** within a `<picture>` DOM element, the Image element may specify both `src` and `srcset` attributes.

```html
  <picture>
    <img src="" srcset="">
  </picture>
```

##### References

