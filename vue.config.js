let proxyObj = {}

proxyObj['/'] = {
    //webSocket
    ws: false,
    //目标地址
    target: 'http://localhost:10010',
    //安装请求头Host会被设置target
    changeOrigin: true,
    //不重写请求地址
    pathRewrite: {
        '^/': '/'
    }
}


module.exports = {
    publicPath: './',
    devServer: {
        host: 'localhost',
        port: 3000,
        proxy: proxyObj
    }
}
