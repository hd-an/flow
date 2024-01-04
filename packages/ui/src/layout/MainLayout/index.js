import './Main.css'
import { useState } from 'react'
import { IconSettings } from '@tabler/icons'
import dashboard from '../../menu-items/dashboard'
import * as React from 'react'
import PropTypes from 'prop-types'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import ChatFlows from '../../views/chatflows'
import Marketplaces from '../../views/marketplaces'
function CustomTabPanel(props) {
    const { children, value, index, ...other } = props

    return (
        <div role='tabpanel' hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    )
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired
}
export default function MainLayout() {
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
    // const ChangePath = (item, idx) => {
    //     SetHeaderState(idx)
    //     navigate(item.url)
    //     dispatch({
    //         type: MAIN_STATE,
    //         state: item.id
    //     })
    // }
    const OpenList = (ev) => {
        chooseState === true ? SetChooseState(false) : SetChooseState(true)
        ev.stopPropagation()
    }
    const chooseComponent = (component, state) => {
        SetModalState(state)
        SetShowComp(component)
    }
    const Close = () => {
        SetChooseState(false)
    }
    const [value, setValue] = React.useState(0)

    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    return (
        <div className='Main' onClick={() => Close()} role='button' tabIndex={0} onKeyDown={() => KeyDownContent()}>
            <div className='Header_Bar'>
                <Tabs sx={{ lineHeight: '7.5vh' }} value={value} onChange={handleChange} aria-label='basic tabs example'>
                    {dashboard.children.slice(0, 2).map((item, index) => (
                        <Tab
                            key={item.id}
                            label={
                                <Box sx={{ width: '8vw', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {item.icon}
                                    <span>{`${item.title}`}</span>
                                </Box>
                            }
                            id={`simple-tab-${index}`}
                        />
                        // <button
                        //     style={headerState === index ? { color: 'rgb(55,150,241)' } : {}}
                        //     onClick={() => ChangePath(item, index)}
                        //     className='Header_BarItem'
                        //     key={item.id}
                        // >
                        //     <span>{item.icon}</span>
                        //     <span>{item.title}</span>
                        // </button>
                    ))}
                    <div
                        tabIndex={0}
                        role='button'
                        onKeyDown={() => KeyDownContent()}
                        className='Header_BarItem'
                        onClick={(ev) => OpenList(ev)}
                    >
                        <IconSettings stroke={1.5} size='1.3rem' />
                    </div>
                </Tabs>
            </div>
            <div className='Content'>
                {/* <Outlet /> */}
                <CustomTabPanel value={value} index={0}>
                    <ChatFlows />
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                    <Marketplaces />
                </CustomTabPanel>
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
                        <div>{item.icon}</div>
                        <div>{item.title}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}
// export default MainLayout
