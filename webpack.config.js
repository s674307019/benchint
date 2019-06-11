const path=require('path');
const webpack=require('webpack');
const HtmlWebpackPlugin=require('html-webpack-plugin'); // 自动生成index.html
const MiniCssExtractPlugin=require('mini-css-extract-plugin'); // 文本分离插件，分离js和css
const OptimizeCssAssetsPlugin=require('optimize-css-assets-webpack-plugin');
const CleanWebpackPlugin=require('clean-webpack-plugin'); // 清理垃圾文件

const VueLoaderPlugin = require('vue-loader/lib/plugin'); // vue加载器
const PostStylus=require('poststylus'); // stylus加前缀

const HappyPack = require('happypack'); // 分块打包
const os = require('os');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

const PreloadWebpackPlugin = require('preload-webpack-plugin'); // 让静态资源(css、js)支持 DNS 预解析和预加载

// 获取本机ip
const LocalIp=require('./get_ip');

/**
 * 判断是生产环境还是开发环境
 * @type {boolean}
 * isProd为true表示生产
 */
const isProd=process.env.NODE_ENV==='production';

/**
 *  css和stylus开发、生产依赖
 *  生产分离css
 */
const cssConfig=[
    isProd?MiniCssExtractPlugin.loader:'vue-style-loader',
    {
        loader: 'css-loader',
        options: {
            sourceMap: !isProd
        }
    }
]
    ,stylusConfig=[
        isProd?MiniCssExtractPlugin.loader:'vue-style-loader',
        {
            loader: 'css-loader',
            options: {
                sourceMap: !isProd
            }
        },{
            loader: 'stylus-loader',
            options: {
                sourceMap: !isProd
            }
        }
    ];

const config={
    entry: {
        main: './src/main.js' // 入口文件
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: isProd?'javascript/[name].[hash:8].js':'[name].js', // [name] 是entry的key
        publicPath: isProd?'./':'/'
        // , crossOriginLoading: 'anonymous' // 允许跨域加载，用anonymous的时候，不会在请求发送证书
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use:cssConfig
            },
            {
                test: /\.styl(us)?$/,
                use: stylusConfig
            },
            {
                test: /\.vue$/,
                use: {
                    loader: 'vue-loader',
                    options: {
                        // hotReload: true, // 热重载-默认开启
                        loaders:{
                            css: cssConfig,
                            stylus: stylusConfig
                        }
                    }
                }
            },
            {
                test: /\.js$/,
                use: 'happypack/loader?id=js_vue',
                exclude: file => (
                    /node_modules/.test(file) && !/\.vue\.js/.test(file)
                )
            },
            {
                test: /\.tsx?$/,
                use: [
                    {loader: "ts-loader"}
                ],
                exclude: file => (
                    /node_modules/.test(file) && !/\.vue\.js/.test(file)
                )
            },
            {
                test: /\.(png|jpe?g|gif|bmp|svg)$/,
                use: [{
                    loader: 'url-loader',
                    options: { // 配置图片编译路径
                        limit: 8192, // 小于8k将图片转换成base64
                        name: '[name].[hash:8].[ext]',
                        outputPath: 'images/'
                    }
                },{
                    loader: 'image-webpack-loader', // 图片压缩
                    options: {
                        bypassOnDebug: true
                    }
                }]
            },
            {
                test: /\.html$/,
                use: [{
                    loader: 'html-loader',
                    options: { // 配置html中图片编译
                        minimize: true
                    }
                }]
            },
            {test: /\.(mp4|ogg|svg)$/,use: ['file-loader']},
            {
                test:/\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader:'url-loader',
                options:{
                    limit:8192,
                    name:'fonts/[name].[hash:8].[ext]'
                }
            }
        ]
    },
    resolve: { // 配置路径别名
        extensions: ['.js', '.vue', '.styl'], // import引入文件的时候不用加后缀
        modules: [
            'node_modules'
            ,path.resolve(__dirname, 'src/assets')
            ,path.resolve(__dirname, 'src/components')
            ,path.resolve(__dirname, 'src/router')
            ,path.resolve(__dirname, 'src/store')
            ,path.resolve(__dirname, 'src/utils')
        ]
    },
    plugins: [
        new webpack.BannerPlugin(`xs build at ${Date.now()}`),
        new VueLoaderPlugin(), // vue加载器
        new HappyPack({
            id: 'js_vue', // id值，与loader配置项对应
            loaders: [{
                loader: `babel-loader?cacheDirectory=${!isProd}`
            }], // 用什么loader处理
            threadPool: happyThreadPool, // 共享进程池
            verbose: true //允许 HappyPack 输出日志
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src/index.html') // 引入模版
            ,favicon: path.join(__dirname, 'src/assets/icon/favicon.ico')
            ,filename: 'index.html'
            ,minify: { // 对index.html压缩
                collapseWhitespace: isProd // 去掉index.html的空格
                ,removeAttributeQuotes: isProd // 去掉引号
            }
            ,hash: true // 去掉上次浏览器的缓存（使浏览器每次获取到的是最新的html）
            // ,chunks:['vendor','main'] // 在产出的html文件里面引入哪些代码块，里面的名字要跟entry里面key对应(一般用于多文件入口)
            ,inlineSource:  '.(js|css)'
        }),
        new webpack.LoaderOptionsPlugin({ // stylus加前缀
            options: {
                stylus: {
                    use: [
                        PostStylus(['autoprefixer']),
                    ]
                }
            }
        }),
        new webpack.ProvidePlugin({ // 配置第三方库
            $http: 'axios'
        })
    ]
};

if(isProd){
    config.entry.vendor=['vue', 'vue-router', 'vuex', 'axios'];
    config.plugins.push(
        new CleanWebpackPlugin([path.join(__dirname, 'dist')]),
        new MiniCssExtractPlugin({ // 分离css
            filename: isProd?'stylesheets/[name].[contenthash:8].css':'[name].css'
            // chunkFilename: isProd?'stylesheets/[name].[contenthash:8].css':'[name].css'
        }),
        new PreloadWebpackPlugin({ // 设置js、css预加载，如：<link as="script" href="./javascript/view.2e1c0548.js" rel="preload">
            rel: 'preload',
            as(entry) {
                if (/\.css$/.test(entry)) return 'style';
                if (/\.woff$/.test(entry)) return 'font';
                if (/\.png$/.test(entry)) return 'image';
                return 'script';
            },
            include: 'asyncChunks'
        }),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/g,       //一个正则表达式，指示应优化/最小化的资产的名称。提供的正则表达式针对配置中ExtractTextPlugin实例导出的文件的文件名运行，而不是源CSS文件的文件名。默认为/\.css$/g
            cssProcessor: require('cssnano'), //用于优化\最小化CSS的CSS处理器，默认为cssnano
            cssProcessorOptions: { safe: true, discardComments: { removeAll: true } }, //传递给cssProcessor的选项，默认为{}
            canPrint: true                    //一个布尔值，指示插件是否可以将消息打印到控制台，默认为true
        }),
    );
    config.optimization={ // 抽离第三方插件
        splitChunks: {
            chunks: 'all', // 必须三选一： "initial" | "all" | "async"(默认就是异步)
            minSize: 10000, // 提高缓存利用率，这需要在http2/spdy
            maxSize: 0, // 没有限制
            minChunks: 3,// 共享最少的chunk数，使用次数超过这个值才会被提取
            maxAsyncRequests: 5,//最多的异步chunk数
            maxInitialRequests: 5,// 最多的同步chunks数
            name: true,
            cacheGroups: { // 这里开始设置缓存的 chunks
                vendor: { // key 为entry中定义的 入口名称，new webpack.ProvidePlugin中的库
                    test: /node_modules/, // 正则规则验证，如果符合就提取 chunk (指定是node_modules下的第三方包)
                    name: 'vendor', // 要缓存的 分隔出来的 chunk 名称
                    enforce: true
                },
                styles: {
                    test: /src\.(css|styl)$/,
                    name: 'main',
                    enforce: true
                }
            }
        }
        , runtimeChunk: { name: 'manifest' } // 为每个入口提取出webpack runtime模块
    };
} else {
    config.devtool='source-map'; // 如果只用source-map开发环境出现错误定位源文件，生产环境会生成map文件
    config.devServer = {
        contentBase: path.join(__dirname, 'dist') // 将 dist 目录下的文件，作为可访问文件。
        , compress: true // 开启Gzip压缩
        , host: LocalIp() // 设置服务器的ip地址，默认localhost
        , port: 6001 // 端口号
        , overlay: { // 当出现编译器错误或警告时，就在网页上显示一层黑色的背景层和错误信息
            errors: true
        }
        , open: true // 自动打开浏览器
        , hot: true
        // ,inline: true // 在打包后文件里注入一个websocket客户端  自动打包，浏览器自动刷新
        // ,historyApiFallback: true // 使用BrowserRouter时，刷新页面不会404(dev模式)
        ,proxy: { // 配置服务器代理 处理跨域
            '/api': {
                target: 'https://api.douban.com', // 要请求的IP地址
                pathRewrite: {'^/api': '/api'},
                changeOrigin: true
            }
        }
    };
}

module.exports=config;
