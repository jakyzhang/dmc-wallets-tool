//set publicPath for deploy to github pages
module.exports = {
    // publicPath: process.env.NODE_ENV === 'production' ? '/dmc-wallets-tool/': '/'
    devServer: {
        disableHostCheck: true,
    }    
}