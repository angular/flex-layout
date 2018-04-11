### Building with Bazel
 
The Angular Layout library, like Angular's Core and Material libraries, can now be built with the Bazel distributed build utility. Full details about Bazel and Angular can be found in the 
[Angular Core repo](https://github.com/angular/angular/blob/master/docs/BAZEL.md). 
 
> Bazel supports distributed, incremental builds and testing that are significantly faster than traditional WebPack builds.
 
Please ensure that you have Bazel installed by following the instructions in that document. This Wiki page only serves as a quick reference to building and testing Angular Layout with Bazel.
 
----
 
### Installing Bazel
 
Install Bazel from the distribution, see [install] instructions.
On Mac, just `brew install bazel`.
 
Bazel will install a hermetic version of Node, npm, and Yarn when
you run the first build.
 
[install]: https://bazel.build/versions/master/docs/install.html
 
#### Installation of ibazel
 
Install interactive bazel runner / fs watcher via:
 
```
yarn global add @bazel/ibazel
```
 
### Building with Bazel
 
Before building or testing, please run the following command to ensure Bazel tracks all node_modules:
 
```terminal
bazel run @nodejs//:npm i
```
 
The instructions for **building** with Bazel are:
 
```terminal
bazel build ...
```
 
The instructions for **testing** with Bazel are:
 
```terminal
bazel test ...
```
 
### Publishing with Bazel
 
To publish Flex Layout to NPM with Bazel, run the following command:
 
```terminal
bazel run //src/lib:npm_package.publish
```