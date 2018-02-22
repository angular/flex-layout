### Live Layout Demos

Real-world usages of Layouts (both static and responsive) are available on the 
[Flex-Layout Demos](https://tburleson-layouts-demos.firebaseapp.com/#/responsive) site. The samples available are 
curated from the following sources:

* Layout Documentation (AngularJS Material)
* GitHub Issuses
* StackOverflow Issues
* CodePen Issues

![layoutdemos](https://cloud.githubusercontent.com/assets/210413/19868966/511c8eea-9f78-11e6-9692-7a23f399b502.jpg)


Use the following Terminal command to start the server and launch the demo application with its non-responsive and 
responsive demos:

```
npm run demo:serve 
```


### Universal (SSR) Demos

A small-scale application that demonstrates how to use Flex Layout on the server. This site is not
available publically, but can be run with the following command:

`npm run universal:serve`

**Note**: This server, unlike the demo-app, does **not** live reload. In order to incorporate build
changes into the universal-app, it will need to be re-built/re-served each time.