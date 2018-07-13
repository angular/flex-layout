### Continuous Integration (CI) Tools


Due to overuse of the Angular core license and loads on the Angular BrowserStack license, Flex-Layout has switched to an independent license of BrowserStack. This was will facilitate more stable CI testing [with PRs and builds] and avoid the excessive *timeouts* occurring with the Angular core license.

> This is a temporary solution only; started on March 9, 2018.

##### Building with Bazel

As part of efforts to migrate to building with Bazel, Flex-Layout is also migrating to CircleCI as part of the library's continuous integration toolset. This will work in tandem with Travis CI to handle all of our builds during the migration period.

More updates on our build process will be posted here as they're available.