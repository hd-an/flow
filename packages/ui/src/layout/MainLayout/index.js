import { useDispatch } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom'
import './Main.css'
import { MAIN_STATE } from '../../store/actions'
// import ProfileSection from './ProfileSection'
import { useState } from 'react'
import { IconSettings } from '@tabler/icons'
import dashboard from '../../menu-items/dashboard'
const MainLayout = () => {
    let navigate = useNavigate()
    let dispatch = useDispatch()
    let [ModalState, SetModalState] = useState(false)
    let [ShowComp, SetShowComp] = useState(null)
    let [chooseState, SetChooseState] = useState(false)
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
    const KeyDownContent = () => {
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
    const OpenList = (ev) => {
        SetChooseState(true)
        ev.stopPropagation()
    }
    const chooseComponent = (component, state) => {
        SetModalState(state)
        SetShowComp(component)
    }
    const Close = () => {
        SetChooseState(false)
    }
    return (
        <div className='Main' onClick={() => Close()} role='button' tabIndex={0} onKeyDown={() => KeyDownContent()}>
            <div className='Header_Bar'>
                {dashboard.children.slice(0, 2).map((item) => (
                    <button onClick={() => ChangePath(item)} className='Header_BarItem' key={item.id}>
                        <span>{item.icon}</span>
                        <span>{item.title}</span>
                    </button>
                ))}
                <div className='Header_BarItem'>
                    {/* <ProfileSection
                        chooseComponent={getComponent}
                        handleLogout={signOutClicked}
                        username={localStorage.getItem('username') ?? ''}
                    /> */}
                    <IconSettings stroke={1.5} size='1.3rem' onClick={(ev) => OpenList(ev)} />
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
            <div style={chooseState === true ? { display: 'block' } : { display: 'none' }} className='RouterList'>
                {dashboard.children.slice(2).map((item) => (
                    <div
                        role='button'
                        tabIndex={0}
                        onKeyDown={() => KeyDownContent()}
                        onClick={() => {
                            SetChooseState(false)
                            chooseComponent(item.component, true)
                        }}
                        key={item.id}
                        className='RouterItem'
                    >
                        <span>{item.icon}</span>
                        <span>{item.title}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MainLayout
