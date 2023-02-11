//set publicPath for deploy to github pages
module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
        ? '/dmc-wallet-tool/'
        : '/'
}