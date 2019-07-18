var webpack = require('webpack')
const path = require('path')

function resolve(dir) {
    return path.join(__dirname, dir)
}
module.exports = {
    configureWebpack: {
        plugins: [
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery',
                'windows.jQuery': 'jquery'
            })
        ]
    },
    chainWebpack(config) {
        config.resolve.alias
            .set('@', resolve('src'))
            .set('~static', resolve('static'))
            .set('style', resolve('src/styles'))
        config.module
            .rule('svg')
            .exclude.add(resolve('src/components/icons'))
            .end()
        config.module
            .rule('icons')
            .test(/\.svg$/)
            .include.add(resolve('src/components/icons'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            })
            .end()

        config.module
            .rule('file')
            .test(/\.(swf|proto)$/)
            .use('file-loader')
            .loader('file-loader')
            .end()
    },
}