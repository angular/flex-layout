### Background

The primary idea behind the flexbox layout is to give HTML DOM elements the ability to alter their width/height 
(and order) to best fill the available space... to *reflow* and *layout* for different kinds of display devices and 
different screen sizes. 

More importantly, flexbox css is direction-agnostic as opposed to the regular layouts (block which is vertically-based 
and inline which is horizontally-based). While those work well for some pages, they lack flexibility to support large 
or complex applications: especially when it comes to orientation changing, resizing, stretching, shrinking, etc.
Especially important are *flex* features that resize elements to intelligently fill available spaces. A flex container 
expands items to fill available free space, or shrinks them to prevent overflow.

Now let's add these complexities the requirements that developers often want combine the CSS Flexbox API with CSS media 
queries in order to support responsive layouts. e.g.

![CSS Flexbox example](https://cloud.githubusercontent.com/assets/210413/20029960/fbbc0e62-a328-11e6-8045-c6532affc857.png)

Unfortunately, developers manually implementing Flexbox CSS must become experts at both the syntax and the workarounds 
to accommodate browser-specific differences in Flexbox runtime support.

Several AngularJS Material applications: **[Material-Adaptive](https://github.com/angular/material-adaptive/tree/master/shrine)** 
have been implemented using custom Flexbox CSS. These efforts illustrated the needs and features within a responsive, 
adaptive application.

* [Pesto](https://material-adaptive.firebaseapp.com/pesto/app/dist.html#/home)
* [Shring](https://material-adaptive.firebaseapp.com/shrine/app/dist.html)

![screen shot 2016-11-05 at 7 26 56 am](https://cloud.githubusercontent.com/assets/210413/20029970/44c16d64-a329-11e6-9a9a-bd00561ea936.png)

These additional feature ideas - derived from real-world Application implementations - have now been implemented within 
the Angular Flex-Layout library. Here are some of this libraries more notable features:   

* Direct DOM element CSS style injections
* Distinct responsive engine (MediaQuery change notifications with adapters)
* Subscription process for adaptive notifications to trigger custom Layout processes

