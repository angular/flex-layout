# Developer Guide 

----

## Getting your environment set up

1. Make sure you have `node` installed with a version at _least_ 5.5.0.
2. Run `npm install -g gulp` to install gulp.
3. Run `npm install -g yarn` to install yarn.
3. Fork the `angular/flex-layout` repo. 
4. Clone your fork. 
   Recommendation: name your git remotes `upstream` for `angular/flex-layout`
   and `<your-username>` for your fork. Also see the [team git shortcuts](https://github.com/angular/flex-layout/wiki/Team-git----bash-shortcuts).
5. From the root of the project, run `yarn install`.

----

## Building the library

*  To build the library in dev mode, run `gulp build:lib`.
*  To build the library in release mode, run `gulp build:release`

----

## Integration within your project.

Developers should read the [Fast Start](https://github.com/angular/flex-layout#fast-start) for alternate integration instructions.

> **npm** installs will only be available **on/after the v1.0.0-beta.1 release**. 

 
### Running tests

To run unit tests, run `gulp test`.
To run lint, run `gulp lint`.


### Running benchmarks
Not yet implemented.

### Running screenshot diff tests
Not yet implemented.
