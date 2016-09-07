const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin;
const LiveReloadPlugin = require('webpack-livereload-plugin');


module.exports = {

    /**
     * The entry point for the bundle
     * Our Angular.js app
     *
     * See: http://webpack.github.io/docs/configuration.html#entry
     */
    entry: {

      'polyfills': './src/demo-app/browser/polyfills.ts',
      'vendor':    './src/demo-app/browser/vendor.ts',
      'main':      './src/demo-app/browser/main.ts'

    },

  output: {
      path: __dirname + "/dist",
      filename: "[name].js"
    },

  resolve: {
    extensions: ['', '.webpack.js', '.ts', '.js']
  },

  /**
   * Developer tool to enhance debugging
   *
   * See: http://webpack.github.io/docs/configuration.html#devtool
   * See: https://github.com/webpack/docs/wiki/build-performance#sourcemaps
   * See: http://cheng.logdown.com/posts/2016/03/25/679045
   *
   *  eval-source-map
   *  cheap-module-eval-source-map
   */
  devtool: 'cheap-module-source-map',

  module: {
    loaders: [
      /*
       * Typescript loader support for .ts and Angular 2 async routes via .async.ts
       * Replace templateUrl and stylesUrl with require()
       *
       * See: https://github.com/s-panferov/awesome-typescript-loader
       * See: https://github.com/TheLarkInn/angular2-template-loader
       *
       * Also see [Handle Vendor JS Libs](http://bit.ly/2bpEAcA)
       */
      {
        test: /\.ts$/,
        loaders: [
          'awesome-typescript-loader',
          'angular2-template-loader',
          '@angularclass/hmr-loader'
        ],
        exclude: [/\.(spec|e2e)\.ts$/,  /node_modules/, /demos/, /deprecated/],
        noParse : [ /angular/ ]
      },
      { test: /\.html$/, loader: 'html-loader' },
      { test: /\.css$/, loader: "raw" },

      /**
       *  File loader for supporting images, for example, in CSS files.
       */
      {
        test: /\.(jpg|png|gif)$/,
        loader: 'file'
      },

      { test: /\.svg$/, loader: "url-loader?mimetype=avatar/svg+xml" }
    ]
  },

  plugins: [
    new LiveReloadPlugin({
          appendScriptTag: true
        }),

     /**
      * Plugin: ForkCheckerPlugin
      * Description: Do type checking in a separate process, so webpack don't need to wait.
      *
      * See: https://github.com/s-panferov/awesome-typescript-loader#forkchecker-boolean-defaultfalse
      */
     new ForkCheckerPlugin(),

     /**
       * Plugin: CommonsChunkPlugin
       * Description: Shares common code between the pages.
       * It identifies common modules and put them into a commons chunk.
       *
       * See: https://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin
       * See: https://github.com/webpack/docs/wiki/optimization#multi-page-app
       */
      new webpack.optimize.CommonsChunkPlugin({
        name: ['polyfills', 'vendor', 'main'].reverse()
      }),


     /**
       * Plugin: HtmlWebpackPlugin
       * Description: Simplifies creation of HTML files to serve your webpack bundles.
       * This is especially useful for webpack bundles that include a hash in the filename
       * which changes every compilation.
       *
       * See: https://github.com/ampedandwired/html-webpack-plugin
       */
     new HtmlWebpackPlugin({
        template: './src/demo-app/index.html',
        chunksSortMode: 'dependency'
      })

    ]
};
