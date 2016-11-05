const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin;
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const LiveReloadPlugin = require('webpack-livereload-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
//const nodeExternals = require('webpack-node-externals');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

var path = require('path');
var ROOT = path.resolve(__dirname, '..');

function root(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return path.join.apply(path, [ROOT].concat(args));
}


module.exports = {

  /**
   * The entry point for the bundle
   * Our Angular.js app
   *
   * See: http://webpack.github.io/docs/configuration.html#entry
   */
  entry: {

    'polyfills': './src/demo-app/browser/polyfills.ts',
    'vendor': './src/demo-app/browser/vendor.ts',
    'main': './src/demo-app/browser/main.ts'

  },

  output: {
    path: __dirname + "/dist",
    filename: "[name].js"
  },

  resolve: {
    extensions: ['.webpack.js', '.ts', '.js'],
    alias: {
      "@angular/flex-layout": "src/lib/"
    }
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
          '@angularclass/hmr-loader',
          'awesome-typescript-loader',
          'angular2-template-loader'
        ],
        exclude: [/\.(spec|e2e)\.ts$/, /node_modules/, /demos/, /deprecated/]
      },
      {test: /\.html$/, loader: 'raw-loader'},
      {test: /\.css$/, loader: "raw"},

      /**
       *  File loader for supporting images, for example, in CSS files.
       */
      {
        test: /\.(jpg|png|gif)$/,
        loader: 'file'
      },

      {test: /\.svg$/, loader: "url-loader?mimetype=avatar/svg+xml"}
    ]
  },

  // externals : [ nodeExternals() ],

  plugins: [

    new LiveReloadPlugin({
      appendScriptTag: true
    }),

    new CopyWebpackPlugin([
      {from: 'src/demo-app/assets', to: __dirname + "/dist"}
    ]),

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
     * Plugin: ContextReplacementPlugin
     * Description: Provides context to Angular's use of System.import
     *
     * See: https://webpack.github.io/docs/list-of-plugins.html#contextreplacementplugin
     * See: https://github.com/angular/angular/issues/11580
     */
    new ContextReplacementPlugin(
      // The (\\|\/) piece accounts for path separators in *nix and Windows
      /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
      root('./src') // location of your src
    ),

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


