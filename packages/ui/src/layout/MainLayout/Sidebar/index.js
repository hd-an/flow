import PropTypes from 'prop-types'

// material-ui
import { useTheme } from '@mui/material/styles'
import { Box, Drawer, useMediaQuery } from '@mui/material'

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar'
import { BrowserView, MobileView } from 'react-device-detect'

// project imports
import MenuList from './MenuList'
import LogoSection from '../LogoSection'
import { drawerWidth } from 'store/constant'

// ==============================|| SIDEBAR DRAWER ||============================== //

const Sidebar = ({ drawerOpen, drawerToggle, window }) => {
    const theme = useTheme()
    const matchUpMd = useMediaQuery(theme.breakpoints.up('md'))

    const drawer = (
        <>
            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                <Box sx={{ display: 'flex', p: 2, mx: 'auto' }}>
                    <LogoSection />
                </Box>
            </Box>
            {/* 移动端显示 */}
            <BrowserView>
                {/* PerfectScrollbar 用来设置当元素超出高度则显示滚动条 */}
                <PerfectScrollbar
                    component='div'
                    style={{
                        // height: !matchUpMd ? 'calc(100vh - 56px)' : 'calc(100vh - 88px)',
                        paddingLeft: '16px',
                        paddingRight: '16px'
                    }}
                >
                    {/* MenuList组件用来显示左侧菜单的数据 */}
                    <MenuList />
                </PerfectScrollbar>
            </BrowserView>
            {/* 在手机端显示 */}
            <MobileView>
                <Box sx={{ px: 2 }}>
                    <MenuList />
                </Box>
            </MobileView>
        </>
    )
    // container 首先看在使用Sidebar时是否传递了window 如果没有 那么自己找window.document.body 如果也没有那么走undefined
    const container = window !== undefined ? () => window.document.body : undefined

    return (
        <Box component='nav' sx={{ flexShrink: { md: 0 }, width: matchUpMd ? drawerWidth : 'auto' }} aria-label='mailbox folders'>
            <Drawer
                container={container}
                variant={matchUpMd ? 'persistent' : 'temporary'}
                anchor='left'
                open={drawerOpen}
                onClose={drawerToggle}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        background: theme.palette.background.default,
                        color: theme.palette.text.primary,
                        borderRight: 'none',
                        [theme.breakpoints.up('md')]: {
                            top: '66px'
                        }
                    }
                }}
                ModalProps={{ keepMounted: true }}
                color='inherit'
            >
                {/* 数据 */}
                {drawer}
            </Drawer>
        </Box>
    )
}

Sidebar.propTypes = {
    drawerOpen: PropTypes.bool,
    drawerToggle: PropTypes.func,
    window: PropTypes.object
}

export default Sidebar
