### .js,.json,.vue,.styl文件使用import引入不用加后缀：
    如 import App from 'App'
    
### dist
    打包目录

### src
    assets 静态资源目录
        icon 小图标
        images 图片
        stylus 公共样式
    component 组件全部写在里面
        组件及组件目录命名规范：首字母大写
        如Common 公共组件目录
    router 路由
    store vuex
    utils 工具函数
    index.html html模版
    main.js 入口文件
    
### package.json
    项目依赖
    
### webpack.config.js
    配置文件

### 其他说明
    @babel/plugin-syntax-dynamic-import  用于vue异步组件
    
### preload-webpack-plugin
    设置css、js预加载
    npm install -D preload-webpack-plugin@next
    v2版本只支持webpack3.x以下，webpack4.x以上需要@next的版本
    
### 特别注意
    使用vue-loader实现热加载时，需设置dev模式hot为true
