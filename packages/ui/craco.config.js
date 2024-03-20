const dotenv = require('dotenv')

dotenv.config()
module.exports = {
    webpack: {
        configure: (webpackConfig, { env, paths }) => {
            // 合并您的现有配置
            webpackConfig.module.rules.push({
                test: /\.m?js$/,
                resolve: {
                    fullySpecified: false
                }
            })

            // 添加新的 HTML 页面路径配置
            if (env === 'production') {
                webpackConfig.entry = {
                    index: [
                        paths.appIndexJs
                        // 添加其他原有入口文件路径
                    ],
                    ai_chat: './public/ai_chat.html' // 新 HTML 页面路径
                }

                webpackConfig.output = {
                    ...webpackConfig.output
                }
            }

            return webpackConfig
        }
    }
}
