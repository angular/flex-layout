## Getting your environment set up

1. Make sure you have `node` installed with a version at _least_ 8.9.1
2. Run `npm install -g gulp` to install `gulp`
3. Fork the `angular/flex-layout` repo
4. Clone your fork.
  >  Recommendation: name your git remotes `upstream` for `angular/flex-layout`
   and `<your-username>` for your fork
5. From the root of the project, run `npm install`

## Building the library

* To build the library, run `npm run lib:build`
* To build and serve the demo-app, run `npm run demo:serve`
* To build and serve the Universal app, run `npm run universal:serve`

## Integration within your project

Developers should read the [Fast Start](https://github.com/angular/flex-layout/wiki/Fast-Starts) for alternate 
integration instructions

### Running tests

* To run unit tests, run `npm run lib:test`
* To run lint, run `npm run lib:lint`
