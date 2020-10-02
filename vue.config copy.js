//vue.config.js
module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
        ? '/'
        : '/',

    // 输出文件目录
    outputDir: 'dist', // 默认dist
    // 用于嵌套生成的静态资产（js,css,img,fonts）目录
    // assetsDir: '',
    // 指定生成的 index.html 的输出路径 (相对于 outputDir)。也可以是一个绝对路径
    indexPath: 'index.html', // Default: 'index.html'
    filenameHashing: true,
    // 构建多页时使用
    pages: undefined,
    // eslint-loader是否在保存的时候检查
    lintOnSave: true,
    // 是否使用包含运行时编译器的Vue核心的构建
    runtimeCompiler: false,

    // 默认情况下 babel-loader 忽略其中的所有文件 node_modules
    transpileDependencies: [
        /\/node_modules\/vue-echarts\//,
        /\/node_modules\/resize-detector\//
    ],

    // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
    productionSourceMap: false,

    // 是一个函数，会接收一个基于 webpack-chain 的 ChainableConfig 实例。允许对内部的 webpack 配置进行更细粒度的修改。
    configureWebpack: {
        externals: {
            'BMap': 'BMap',
            'google.maps': 'google.maps'
        }
    },

    // 是一个函数，会接收一个基于 webpack-chain 的 ChainableConfig 实例。允许对内部的 webpack 配置进行更细粒度的修改。
    chainWebpack: config => {
        /*config.module
          .rule('images')
          .use('url-loader')
            .loader('url-loader')
            .tap(options => {
              // 修改它的选项...
              return options
            })*/
    },

    // css相关配置
    css: {
        // 启用 CSS modules
        modules: false,
        // 是否使用css分离插件
        extract: true,
        // 开启 CSS source maps?
        sourceMap: false,
        // css预设器配置项
        loaderOptions: {},
    },

    // webpack-dev-server 相关配置
    // devServer: {
    //     host: '0.0.0.0',
    //     port: 8080,
    //     https: false,
    //     open: true,
    //     hotOnly: false,
    //     proxy: null, // 设置代理
    //     before: app => { },
    // },
    devServer: {
        proxy: {
            '/apt': {     //这里最好有一个 /
                target: 'http://192.168.137.1:80',  // 后台接口域名
                //ws: true,        //如果要代理 websockets，配置这个参数
                //secure: false,  // 如果是https接口，需要配置这个参数
                changeOrigin: true,  //是否跨域
                pathRewrite:{
                    '^/apt':'/123'
                }
            }
        }
      },

    // 构建时开启多进程处理 babel 编译
    parallel: require('os').cpus().length > 1,

    // PWA 插件相关配置
    pwa: {},

    // 第三方插件配置
    pluginOptions: {}
};
