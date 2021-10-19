const webpack = require('webpack')
const WebpackZipPlugin = require('webpack-zip-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const IS_PROD = process.env.NODE_ENV === 'production'
const productionGzipExtensions = ['html', 'js', 'css']

function resolve(dir) {
    return path.join(__dirname, dir)
}

module.exports = {
    devServer: {
        port: 8080 // 开发阶段本地服务端口
    },

    outputDir: 'app/matrix/' + process.env.VUE_APP_M3_APP,
    productionSourceMap: false,

    configureWebpack: config => {
        console.log("default config: "+JSON.stringify(config, " ", 2));
        console.log("default config.")
        config = {};
        if (IS_PROD) { // 生产环境
            config.plugins = [
                new CompressionPlugin({
                    test: new RegExp(
                        '\\.(' + productionGzipExtensions.join('|') + ')$'
                    ),
                    threshold:10240,
                    minRatio: 1,
                    deleteOriginalAssets:false
                }),
                new WebpackZipPlugin({
                    initialFile: 'app',
                    endPath: './',
                    zipName: process.env.VUE_APP_M3_APP+'.zip',
                    //frontShell: 'sed -i \'\' \'s/src="/src="\\/static\\/app\\/matrix\\/m3event/g\; s/href="/href="\\/static\\/app\\/matrix\\/m3event/g\' ./app/matrix/m3event/index.html',
                    //frontShell: 'sed -i \'\' \'s/src="/src="\\/static\\/app\\/matrix\\/m3event/g\; s/href="/href="\\/static\\/app\\/matrix\\/m3event/g\' ./app/matrix/m3event/index.html',
                    //behindShell: './deploy.sh ' + process.env.VUE_APP_M3_HOST + ' ' + process.env.VUE_APP_M3_COMPANY + ' ' + process.env.VUE_APP_M3_USERNAME + ' "' + process.env.VUE_APP_M3_PASSWORD + '" ' + process.env.VUE_APP_M3_APP + ' ' + process.env.VUE_APP_M3_TITLE + ' ' + process.env.VUE_APP_M3_VERSION
                })
            ]
        } else { // 非生产环境
            config.plugins = [
            ]
        }
        //防止将某些 import 的包(package)打包到 bundle 中，而是在运行时(runtime)再去从外部获取这些扩展依赖
        config.externals = {
            //"要导入的包": "window对象中的对应变量"
            "lodash": "_",
            "jquery": "$",
            "moment": "moment",
            "../moment": "moment",
            "vue": "Vue",
        }
        config.entry = {
            app: "./src/main.js"
        }
        //config.mode = "production"
        return config;
    },

    chainWebpack(config) {
        if (IS_PROD) {
        } else {
            //config.resolve.symlinks(true)
        }
        // set svg-sprite-loader
        config.module
            .rule('svg')
            .exclude.add(resolve('src/icons'))
            .end()
        config.module
            .rule('icons')
            .test(/\.svg$/)
            .include.add(resolve('src/icons'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            })
            .end()
        // console.log("config: ",config);
    },

    publicPath: process.env.NODE_ENV === 'production'?'/static/app/matrix/'+process.env.VUE_APP_M3_APP:''
}