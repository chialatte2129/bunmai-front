function resolve(dir) {
    return path.join(__dirname, dir)
}


module.exports = {
    publicPath: '/',
    outputDir: 'dist',
    assetsDir: 'static',
    lintOnSave: false,
    productionSourceMap: false,
    devServer: {
        disableHostCheck : true,
        sockHost : "http://localhost:8080/",
    }
}