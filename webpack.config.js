
/*************************************************************/
/*                                                           */
/*	 fichier de config de webpack                            */
/*                                                           */
/*************************************************************/

var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin')


var BUILD_DIR = path.resolve(__dirname, 'Front/client/public'); // dossier source assemble
var APP_DIR = path.resolve(__dirname, 'Front/client/app');      // dossier source du projet react

/*permet de dupliquer la page index.html de src dans build et lui rajoute le fichier bundle a la fin*/
var HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
  template: APP_DIR + '/index.html',
  filename: 'index.html',
  inject: 'body'
});


module.exports = {
  devtool: 'source-map',
  devServer: {
    /* Les SPA utilise généralement un seul fichier d'index accessible par les navigateurs (ici index.html)
       la navgation dans l'application est traité par react
       il y avait donc un soucis lors d'un rafraichissement ou d'un accés direct a un url
       étant donné que la ressource n'existe pas "réellement" sur le serveur
    */
  historyApiFallback: true
  },
  /*entry est un array de string qui prend le chemin des fichiers d'entrée de l'application*/
  entry: [
  APP_DIR + '/index.jsx'
  ],
  module : {
    /* loaders va transformer les fichiers en Javascript ''regular'' */
    /* il prend 3 arguments :
                            -test : l'extention des fichiers a transformer
                            -include or exclude : les dossiers ou il faut ou pas appliquer le loaders
                            -loader : le loader en question a appliquer
                */
    loaders : [
       {
                test: /\.css$/,
                loader: "style!css"
            },
       {
                test: /\.less$/,
                loader: "style!css!less"
       },
      {
        test : /\.jsx?/, //expression réguliere qui va prendre tout les fichiers avec une extension .js ou .jsx
        include : APP_DIR,
        loader : 'babel'
      }
    ]
  },
  resolve: {
        alias: {
            "ag-grid-root" : __dirname + "/node_modules/ag-grid"
        }
    },
  output: {
    path: BUILD_DIR,      // chemin de sortie
    filename: '/bundle.js'   // nom du fichier qui contiendra les sources
  },
  plugins : [
    HTMLWebpackPluginConfig,
    new webpack.DefinePlugin({
      'process.env': {
      'NODE_ENV': JSON.stringify('development')
      }
    })
  ]
};
