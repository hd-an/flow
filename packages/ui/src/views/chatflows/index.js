import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
// material-ui
import { Grid, Box, Stack, Toolbar, ToggleButton, ButtonGroup, InputAdornment, TextField } from '@mui/material'
// project imports
import MainCard from 'ui-component/cards/MainCard'
import ItemCard from 'ui-component/cards/ItemCard'
import { gridSpacing } from 'store/constant'
import WorkflowEmptySVG from 'assets/images/workflow_empty.svg'
import LoginDialog from 'ui-component/dialog/LoginDialog'
import ConfirmDialog from 'ui-component/dialog/ConfirmDialog'
// API
import chatflowsApi from 'api/chatflows'

// GetParams
import { getUsersArray } from '../../utils/GetUsersArr'
// Hooks
import useApi from 'hooks/useApi'

// const
// import { baseURL } from 'store/constant'

// icons
import { IconPlus, IconSearch, IconLayoutGrid, IconList } from '@tabler/icons'
import * as React from 'react'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import { FlowListTable } from '../../ui-component/table/FlowListTable'
import { StyledButton } from '../../ui-component/button/StyledButton'
// ==============================|| CHATFLOWS ||============================== //

const Chatflows = () => {
    const navigate = useNavigate()
    const [isLoading, setLoading] = useState(true)
    const [images, setImages] = useState({})
    const [search, setSearch] = useState('')
    const [loginDialogOpen, setLoginDialogOpen] = useState(false)
    const [loginDialogProps, setLoginDialogProps] = useState({})
    // 修改api
    const getAllChatflowsApi = useApi(chatflowsApi.getAllChatflows)
    const [view, setView] = React.useState(localStorage.getItem('flowDisplayStyle') || 'card')

    const handleChange = (event, nextView) => {
        localStorage.setItem('flowDisplayStyle', nextView)
        setView(nextView)
    }

    const onSearchChange = (event) => {
        setSearch(event.target.value)
    }
    function filterFlows(data) {
        return (
            data.name.toLowerCase().indexOf(search.toLowerCase()) > -1 ||
            (data.category && data.category.toLowerCase().indexOf(search.toLowerCase()) > -1)
        )
    }

    const onLoginClick = (username, password) => {
        localStorage.setItem('username', username)
        localStorage.setItem('password', password)
        navigate(0)
    }

    const addNew = () => {
        navigate('/canvas')
    }

    const goToCanvas = (selectedChatflow) => {
        navigate(`/canvas/${selectedChatflow.id}`)
    }

    useEffect(() => {
        getUsersArray().then((res) => {
            getAllChatflowsApi.request(res.orgId, JSON.stringify(res.userIdArr))
        })
    }, [document.cookie])
    useEffect(() => {
        if (getAllChatflowsApi.error) {
            if (getAllChatflowsApi.error?.response?.status === 401) {
                setLoginDialogProps({
                    title: 'Login',
                    confirmButtonName: 'Login'
                })
                setLoginDialogOpen(true)
            }
        }
    }, [getAllChatflowsApi.error])

    useEffect(() => {
        setLoading(getAllChatflowsApi.loading)
    }, [getAllChatflowsApi.loading])

    useEffect(() => {
        if (getAllChatflowsApi.data) {
            try {
                const chatflows = getAllChatflowsApi.data
                const images = {}
                for (let i = 0; i < chatflows.length; i += 1) {
                    images[chatflows[i].id] = JSON.parse(chatflows[i].Images)

                    // const flowDataStr = chatflows[i].flowData
                    // const flowData = JSON.parse(flowDataStr)
                    // console.log(flowData, 'i am flowDATA')
                    // const nodes = flowData.nodes || []
                    // images[chatflows[i].id] = []
                    // for (let j = 0; j < nodes.length; j += 1) {
                    //     const imageSrc = `${baseURL}/api/v1/node-icon/${nodes[j].data.name}`
                    //     if (!images[chatflows[i].id].includes(imageSrc)) {
                    //         images[chatflows[i].id].push(imageSrc)
                    //     }
                    // }
                }
                setImages(images)
            } catch (e) {
                console.error(e)
            }
        }
    }, [getAllChatflowsApi.data])

    return (
        <MainCard>
            <Stack flexDirection='column'>
                <Box sx={{ flexGrow: 1 }}>
                    <Toolbar
                        disableGutters={true}
                        style={{
                            margin: 1,
                            padding: 1,
                            paddingBottom: 10,
                            display: 'flex',
                            justifyContent: 'space-between',
                            width: '100%'
                        }}
                    >
                        <TextField
                            size='small'
                            style={{ position: 'relative', left: '-1.5%' }}
                            sx={{ display: { xs: 'none', sm: 'block' }, ml: 3 }}
                            variant='outlined'
                            placeholder='根据名称或者别名进行搜索'
                            onChange={onSearchChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position='start'>
                                        <IconSearch />
                                    </InputAdornment>
                                )
                            }}
                        />
                        <Box sx={{ flexGrow: 1 }} />
                        <ButtonGroup sx={{ maxHeight: 40 }} disableElevation variant='contained' aria-label='outlined primary button group'>
                            <ButtonGroup disableElevation variant='contained' aria-label='outlined primary button group'>
                                <ToggleButtonGroup sx={{ maxHeight: 40 }} value={view} color='primary' exclusive onChange={handleChange}>
                                    <ToggleButton variant='contained' value='card' title='Card View'>
                                        <IconLayoutGrid />
                                    </ToggleButton>
                                    <ToggleButton variant='contained' value='list' title='List View'>
                                        <IconList />
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            </ButtonGroup>
                            <Box sx={{ width: 5 }} />
                            <ButtonGroup disableElevation aria-label='outlined primary button group'>
                                <StyledButton variant='contained' onClick={addNew} startIcon={<IconPlus />}>
                                    创建
                                </StyledButton>
                            </ButtonGroup>
                        </ButtonGroup>
                    </Toolbar>
                </Box>
                {!isLoading && (!view || view === 'card') && getAllChatflowsApi.data && (
                    <Grid container spacing={gridSpacing}>
                        {getAllChatflowsApi.data.filter(filterFlows).map((data, index) => (
                            <Grid key={index} item lg={3} md={4} sm={6} xs={12}>
                                <ItemCard onClick={() => goToCanvas(data)} data={data} images={images[data.id]} />
                            </Grid>
                        ))}
                    </Grid>
                )}
                {!isLoading && view === 'list' && getAllChatflowsApi.data && (
                    <FlowListTable
                        sx={{ mt: 20, fontSize: '12px' }}
                        data={getAllChatflowsApi.data}
                        images={images}
                        filterFunction={filterFlows}
                        updateFlowsApi={getAllChatflowsApi}
                    />
                )}
            </Stack>

            {!isLoading && (!getAllChatflowsApi.data || getAllChatflowsApi.data.length === 0) && (
                <Stack sx={{ alignItems: 'center', justifyContent: 'center' }} flexDirection='column'>
                    <Box sx={{ p: 2, height: 'auto' }}>
                        <img
                            style={{ objectFit: 'cover', height: '30vh', width: 'auto', fontSize: '12px' }}
                            src={WorkflowEmptySVG}
                            alt='WorkflowEmptySVG'
                        />
                    </Box>
                    <div style={{ fontSize: '12px' }}>还没有创建智能体</div>
                </Stack>
            )}
            <LoginDialog show={loginDialogOpen} dialogProps={loginDialogProps} onConfirm={onLoginClick} />
            <ConfirmDialog />
        </MainCard>
    )
}

export default Chatflows
