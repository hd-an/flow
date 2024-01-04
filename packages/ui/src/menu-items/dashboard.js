// assets
import { IconHierarchy, IconBuildingStore, IconKey, IconTool, IconLock } from '@tabler/icons'
// IconRobot
// constant
// const icons = { IconHierarchy, IconBuildingStore, IconKey, IconTool, IconLock, IconRobot }

// apikey routing
import APIKey from '../views/apikey'
// tools routing
import Tools from '../views/tools'
// assistants routing
// import Assistants from '../views/assistants'
// credentials routing
import Credentials from '../views/credentials'

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
    id: 'dashboard',
    title: '',
    type: 'group',
    children: [
        {
            id: 'chatflows',
            title: '智能体',
            type: 'item',
            url: '/chatflows',
            icon: <IconHierarchy />,
            breadcrumbs: true,
            component: null
        },
        {
            id: 'marketplaces',
            title: '模板',
            type: 'item',
            url: '/marketplaces',
            icon: <IconBuildingStore />,
            breadcrumbs: true,
            component: null
        },
        {
            id: 'tools',
            title: '工具',
            type: 'item',
            url: '/tools',
            icon: <IconTool />,
            breadcrumbs: true,
            component: <Tools />
        },
        {
            id: 'credentials',
            title: '凭证',
            type: 'item',
            url: '/credentials',
            icon: <IconLock />,
            breadcrumbs: true,
            component: <Credentials />
        },
        {
            id: 'apikey',
            title: 'API密钥',
            type: 'item',
            url: '/apikey',
            icon: <IconKey />,
            breadcrumbs: true,
            component: <APIKey />
        }
        // {
        //     id: 'assistants',
        //     title: '助理',
        //     type: 'item',
        //     url: '/assistants',
        //     icon: <IconRobot />,
        //     breadcrumbs: true,
        //     component: <Assistants />
        // }
    ]
}

export default dashboard
