import { defineConfig } from 'rollup'
import html from '@rollup/plugin-html'

export default defineConfig({
    output: {
        file: 'dist',
        format: 'esm'
    },
    plugins: [
        html({
            inject: false,
            publicPath: './../public/ai_chat.html'
        })
    ]
})
