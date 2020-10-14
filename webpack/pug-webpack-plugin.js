const HtmlWebpackPlugin = require('html-webpack-plugin');
const root = require('./../config/helper').root;

const BASE_TITLE = 'STATIC WEB';

const title = (_title = '') => _title + BASE_TITLE;

const template = name => root('src', 'template', `${name}.pug`);

module.exports = (mode, context) => {

  const isProdEnv = mode === 'production';
  const link = (href = '') => `${context}/${href}`;

  const htmlWebpackPlugins = [
    new HtmlWebpackPlugin({
      template: template('index'),
      title: title('HOME'),
      link,
      isProdEnv,
    })
  ];

  return htmlWebpackPlugins;
};
