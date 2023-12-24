// assets
import { IconHierarchy, IconBuildingStore, IconKey, IconTool, IconLock, IconRobot } from '@tabler/icons'

// constant
// const icons = { IconHierarchy, IconBuildingStore, IconKey, IconTool, IconLock, IconRobot }

// apikey routing
import APIKey from '../views/apikey'
// tools routing
import Tools from '../views/tools'
// assistants routing
import Assistants from '../views/assistants'
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
            title: 'Chatflows',
            type: 'item',
            url: '/chatflows',
            icon: <IconHierarchy />,
            breadcrumbs: true,
            component: null
        },
        {
            id: 'marketplaces',
            title: 'Marketplaces',
            type: 'item',
            url: '/marketplaces',
            icon: <IconBuildingStore />,
            breadcrumbs: true,
            component: null
        },
        {
            id: 'tools',
            title: 'Tools',
            type: 'item',
            url: '/tools',
            icon: <IconTool />,
            breadcrumbs: true,
            component: <Tools />
        },
        {
            id: 'assistants',
            title: 'Assistants',
            type: 'item',
            url: '/assistants',
            icon: <IconRobot />,
            breadcrumbs: true,
            component: <Assistants />
        },
        {
            id: 'credentials',
            title: 'Credentials',
            type: 'item',
            url: '/credentials',
            icon: <IconLock />,
            breadcrumbs: true,
            component: <Credentials />
        },
        {
            id: 'apikey',
            title: 'API Keys',
            type: 'item',
            url: '/apikey',
            icon: <IconKey />,
            breadcrumbs: true,
            component: <APIKey />
        }
    ]
}

export default dashboard
