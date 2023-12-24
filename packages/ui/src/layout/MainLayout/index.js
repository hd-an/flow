import { useDispatch } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom'
import './Main.css'
import { MAIN_STATE } from '../../store/actions'
import dashboard from '../../menu-items/dashboard'
import ProfileSection from './ProfileSection'
import { useState } from 'react'
// import Breadcrumbs from '@mui/material/Breadcrumbs'
// import Link from '@mui/material/Link'
// import Typography from '@mui/material/Typography'

const MainLayout = () => {
    let navigate = useNavigate()
    let dispatch = useDispatch()
    let [ModalState, SetModalState] = useState(false)
    let [ShowComp, SetShowComp] = useState(null)
    // let chooseState = useSelector((state) => state.chooseState)、
    // const handleClick = (event) => {
    //     event.preventDefault()
    //     console.info('You clicked a breadcrumb')
    //   }
    const close = () => {
        SetModalState(false)
        SetShowComp(null)
    }
    const keyDownClose = (ev) => {
        // esc键
        if (ev.keyCode === 27) {
            SetModalState(false)
            SetShowComp(null)
        } else {
            return
        }
    }
    const KeyDownContent = (ev) => {
        return
    }
    const Content = (ev) => {
        ev.stopPropagation()
    }
    const ChangePath = (item) => {
        navigate(item.url)
        dispatch({
            type: MAIN_STATE,
            state: item.id
        })
    }
    const signOutClicked = () => {
        localStorage.removeItem('username')
        localStorage.removeItem('password')
        navigate('/', { replace: true })
        navigate(0)
    }
    const getComponent = (component, state) => {
        SetModalState(state)
        SetShowComp(component)
    }
    return (
        <div className='Main'>
            <div className='Main_header'>
                智能体
                {/* <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" href="/" onClick={handleClick}>
                Material-UI
            </Link>
            <Link color="inherit" href="/getting-started/installation/" onClick={handleClick}>
                Core
            </Link>
            <Typography color="textPrimary">Breadcrumb</Typography>
            </Breadcrumbs> */}
            </div>
            <div className='Header_Bar'>
                {dashboard.children.slice(0, 2).map((item) => (
                    <button onClick={() => ChangePath(item)} className='Header_BarItem' key={item.id}>
                        <span>{item.icon}</span>
                        <span>{item.title}</span>
                    </button>
                ))}
                <div className='Header_BarItem'>
                    <ProfileSection
                        chooseComponent={getComponent}
                        handleLogout={signOutClicked}
                        username={localStorage.getItem('username') ?? ''}
                    />
                </div>
            </div>
            <div className='Content'>
                <Outlet />
            </div>
            <div
                role='button'
                tabIndex={0}
                onClick={() => close()}
                onKeyDown={(ev) => keyDownClose(ev)}
                style={ModalState === true ? { display: 'block' } : { display: 'none' }}
                className='Modal'
            >
                <div
                    role='button'
                    tabIndex={0}
                    onKeyDown={(ev) => KeyDownContent(ev)}
                    onClick={(ev) => Content(ev)}
                    className='ModalContent'
                >
                    {ShowComp}
                </div>
            </div>
        </div>
    )
}

export default MainLayout
