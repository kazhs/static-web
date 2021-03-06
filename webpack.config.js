
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const pugWebpackPlugin = require('./webpack/pug-webpack-plugin');
const root = require('./config/helper').root;

module.exports = (_, argv) => {

  const mode = argv.mode || 'development';
  const context = '';
  const assetPath = `${context}/assets`;
  const isDev = mode === 'development';
  const isLocal = isDev && !argv.env;
  const devtool = isDev ? 'source-map' : false;
  const target = isDev ? 'web' : ['web', 'es5'];

  return {
    mode,
    target,
    devtool,
    entry: root('src', 'assets', 'ts', 'main.ts'),
    output: {
      filename: 'script/[name].[contenthash].js',
    },
    resolve: {
      extensions: ['.js', '.ts', '.styl'],
    },

    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader'
        },
        {
          test: /\.pug$/,
          use: 'pug-loader'
        },
        {
          test: /\.styl$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: { sourceMap: isDev },
            },
            {
              loader: 'stylus-loader',
              options: {
                sourceMap: isDev,
                stylusOptions: {
                  use: ['nib'],
                  import: ['nib', root('src', 'assets', 'stylus', 'index.styl')],
                }
              },
            },
          ]
        },
        {
          test: /\.(jpe?g|png|gif|svg|ico)([?]?.*)$/i,
          use: [
            {
              loader: 'file-loader',
              options: {
                limit: 8192,
                name: '[name].[contenthash].[ext]',
                outputPath: 'assets/image',
                publicPath: `${assetPath}/image`,
              }
            },
            {
              loader: 'image-webpack-loader',
              options: {
                bypassOnDebug: isLocal,
                mozjpeg: {
                  progressive: true,
                  quality: [0.65, 0.90]
                },
                optipng: {
                  enabled: false,
                },
                pngquant: {
                  quality: [0.65, 0.90],
                  speed: 4
                },
                gifsicle: {
                  interlaced: false,
                },
              }
            },
          ]
        },
        {
          test: /\.(eot|woff|woff2|ttf)([?]?.*)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                limit: 8192,
                name: '[name].[contenthash].[ext]',
                outputPath: 'assets/font',
                publicPath: `${assetPath}/font`,
              }
            }
          ]
        },
      ]
    },

    optimization: {
      minimizer: [
        new OptimizeCSSAssetsPlugin({})
      ]
    },

    plugins: [
      ...pugWebpackPlugin(mode, context),

      new MiniCssExtractPlugin({
        filename: 'css/style.[contenthash].css'
      }),

      // new CopyPlugin({
      //   patterns: []
      // }),
    ],

    performance: {
      hints: false
    },

    /**
     * webpackのinformation設定
     */
    stats: {
      children: false,
      colors: true,
      env: true,
      version: true,
    },

    /**
     * webpack-dev-serverの設定
     */
    devServer: {
      contentBase: root('dist'),
      port: 9000,
      open: true,
      progress: true,
      stats: 'minimal',
    },
  }
}
