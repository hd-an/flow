import { createTheme } from '@mui/material/styles'

// assets
// 引入所有的颜色
import colors from 'assets/scss/_themes-vars.module.scss'

// project imports

import componentStyleOverrides from './compStyleOverride'
import themePalette from './palette'
import themeTypography from './typography'

/**
 * Represent theme style and structure as per Material-UI
 * @param {JsonObject} customization customization parameter object
 */

export const theme = (customization) => {
    const color = colors
    const themeOption = {
        colors: color,
        heading: color.grey900,
        paper: color.paper,
        backgroundDefault: color.paper,
        background: color.primaryLight,
        darkTextPrimary: color.grey700,
        darkTextSecondary: color.grey500,
        textDark: color.grey900,
        menuSelected: color.secondaryDark,
        menuSelectedBack: color.secondaryLight,
        divider: color.grey200,
        customization
    }

    const themeOptions = {
        // 文本布局从左到右 left to right
        direction: 'ltr',
        // 生成主题的调色版配置
        palette: themePalette(themeOption),
        // 混合样式对象 将toolbar的样式设置为最小高度48px padding16 当最小宽度到600px时最小高度仍然为48px
        mixins: {
            toolbar: {
                minHeight: '48px',
                padding: '16px',
                '@media (min-width: 600px)': {
                    minHeight: '48px'
                }
            }
        },
        // 生成主题的字体样式配置
        typography: themeTypography(themeOption)
    }
    // 创建theme 结合themOptionshh和createTheme 生成自定义的Material-UI主题对象
    const themes = createTheme(themeOptions)
    themes.components = componentStyleOverrides(themeOption)

    return themes
}

export default theme
