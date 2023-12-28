import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { enqueueSnackbar as enqueueSnackbarAction, closeSnackbar as closeSnackbarAction } from 'store/actions'
import { v4 as uuidv4 } from 'uuid'

import {
    Box,
    Typography,
    Button,
    Select,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    OutlinedInput,
    MenuItem
} from '@mui/material'

// project import
import AddEditCredentialDialog from 'views/credentials/AddEditCredentialDialog'
import { StyledButton } from 'ui-component/button/StyledButton'
import { TooltipWithParser } from 'ui-component/tooltip/TooltipWithParser'
import { MultiDropdown } from 'ui-component/dropdown/MultiDropdown'
import { File } from 'ui-component/file/File'
import { BackdropLoader } from 'ui-component/loading/BackdropLoader'
import DeleteConfirmDialog from './DeleteConfirmDialog'
import { getUsersArray } from '../../utils/GetUsersArr'
// Icons
import { IconX } from '@tabler/icons'

// API
import assistantsApi from 'api/assistants'
import credentialsApi from 'api/credentials'
// Hooks
import useApi from 'hooks/useApi'

// utils
import useNotifier from 'utils/useNotifier'
import { HIDE_CANVAS_DIALOG, SHOW_CANVAS_DIALOG } from 'store/actions'
// Model列表
const assistantAvailableModels = [
    {
        label: 'gpt-4-1106-preview',
        name: 'gpt-4-1106-preview'
    },
    {
        label: 'gpt-4-0613',
        name: 'gpt-4-0613'
    },
    {
        label: 'gpt-4-0314',
        name: 'gpt-4-0314'
    },
    {
        label: 'gpt-4',
        name: 'gpt-4'
    },
    {
        label: 'gpt-3.5-turbo',
        name: 'gpt-3.5-turbo'
    },
    {
        label: 'gpt-3.5-turbo-1106',
        name: 'gpt-3.5-turbo-1106'
    },
    {
        label: 'gpt-3.5-turbo-0613',
        name: 'gpt-3.5-turbo-0613'
    },
    {
        label: 'gpt-3.5-turbo-16k',
        name: 'gpt-3.5-turbo-16k'
    },
    {
        label: 'gpt-3.5-turbo-16k-0613',
        name: 'gpt-3.5-turbo-16k-0613'
    }
]

const inputParam = {
    label: 'Connect Credential',
    name: 'credential',
    type: 'credential',
    credentialNames: ['openAIApi']
}

const AssistantDialog = ({ show, dialogProps, onCancel, onConfirm }) => {
    // show 当前组件是否展示的状态
    // dialogProps 由index文件传递过来的弹出框参数
    // onCancel  关闭方法
    // onConfirm 提交方法
    console.log({ show, dialogProps, onCancel, onConfirm }, '进来了')
    const portalElement = document.getElementById('portal')

    // 设置消息通知弹窗的
    useNotifier()
    const dispatch = useDispatch()

    // 设置弹窗消息
    const enqueueSnackbar = (...args) => dispatch(enqueueSnackbarAction(...args))

    // 设置手动关闭弹窗的消息
    const closeSnackbar = (...args) => dispatch(closeSnackbarAction(...args))

    const getAllCredentialsApi = useApi(credentialsApi.getAllCredentials)
    const getAllComponentsCredentialsApi = useApi(credentialsApi.getAllComponentsCredentials)
    // 获取特定的助手 需要有id
    const getSpecificAssistantApi = useApi(assistantsApi.getSpecificAssistant)
    // 获取助手对象 需要传递 凭证和id
    const getAssistantObjApi = useApi(assistantsApi.getAssistantObj)

    const [assistantId, setAssistantId] = useState('')
    const [openAIAssistantId, setOpenAIAssistantId] = useState('')
    const [assistantName, setAssistantName] = useState('')
    const [assistantDesc, setAssistantDesc] = useState('')
    const [assistantIcon, setAssistantIcon] = useState(`https://api.dicebear.com/7.x/bottts/svg?seed=${uuidv4()}`)
    const [assistantModel, setAssistantModel] = useState('')
    const [assistantCredential, setAssistantCredential] = useState('')
    const [assistantInstructions, setAssistantInstructions] = useState('')
    const [assistantTools, setAssistantTools] = useState(['code_interpreter', 'retrieval'])
    const [assistantFiles, setAssistantFiles] = useState([])
    const [uploadAssistantFiles, setUploadAssistantFiles] = useState('')
    const [loading, setLoading] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [deleteDialogProps, setDeleteDialogProps] = useState({})
    const [OpenAI, setOpenAI] = useState('')
    const [AddEditCredentialDialogState, SetAddEditCredentialDialogState] = useState(false)
    useEffect(() => {
        // 如果show为true那么就把store仓库中的 canvas仓库中的 dialog弹窗的状态改为true
        if (show) dispatch({ type: SHOW_CANVAS_DIALOG })
        // 为false  则 改为false
        else dispatch({ type: HIDE_CANVAS_DIALOG })
        // 当组件销毁时 改为false
        return () => dispatch({ type: HIDE_CANVAS_DIALOG })
    }, [show, dispatch])

    useEffect(() => {
        // 特定的助手信息请求成功后
        if (getSpecificAssistantApi.data) {
            console.log('获取特定的助手信息成功需要传递id')
            setAssistantId(getSpecificAssistantApi.data.id)
            setAssistantIcon(getSpecificAssistantApi.data.iconSrc)
            setAssistantCredential(getSpecificAssistantApi.data.credential)
            // 将助手详细信息进行JSON.parse将字符串转为对象
            const assistantDetails = JSON.parse(getSpecificAssistantApi.data.details)
            setOpenAIAssistantId(assistantDetails.id)
            setAssistantName(assistantDetails.name)
            setAssistantDesc(assistantDetails.description)
            setAssistantModel(assistantDetails.model)
            setAssistantInstructions(assistantDetails.instructions)
            setAssistantTools(assistantDetails.tools ?? [])
            setAssistantFiles(assistantDetails.files ?? [])
        }
    }, [getSpecificAssistantApi.data])

    useEffect(() => {
        // 如果获取助手对象信息请求成功调用syncData方法
        if (getAssistantObjApi.data) {
            syncData(getAssistantObjApi.data)
        }
    }, [getAssistantObjApi.data])

    useEffect(() => {
        // 如果传递过来的type类型是edit 修改 并且 props有data属性
        if (dialogProps.type === 'EDIT' && dialogProps.data) {
            console.log('传递过来的type类型是edit 修改 并且 props有data属性')
            // When assistant dialog is opened from Assistants dashboard
            setAssistantId(dialogProps.data.id)
            setAssistantIcon(dialogProps.data.iconSrc)
            setAssistantCredential(dialogProps.data.credential)

            const assistantDetails = JSON.parse(dialogProps.data.details)
            setOpenAIAssistantId(assistantDetails.id)
            setAssistantName(assistantDetails.name)
            setAssistantDesc(assistantDetails.description)
            setAssistantModel(assistantDetails.model)
            setAssistantInstructions(assistantDetails.instructions)
            setAssistantTools(assistantDetails.tools ?? [])
            setAssistantFiles(assistantDetails.files ?? [])
        } else if (dialogProps.type === 'EDIT' && dialogProps.assistantId) {
            console.log('当画布中的openAi打开助手对话框')
            // 当画布中的openAi打开助手对话框
            getSpecificAssistantApi.request(dialogProps.assistantId)
        } else if (dialogProps.type === 'ADD' && dialogProps.selectedOpenAIAssistantId && dialogProps.credential) {
            console.log('当助手对话框是从现有的添加新的助手')
            // 当助手对话框是从现有的添加新的助手
            setAssistantId('')
            setAssistantIcon(`https://api.dicebear.com/7.x/bottts/svg?seed=${uuidv4()}`)
            setAssistantCredential(dialogProps.credential)

            getAssistantObjApi.request(dialogProps.selectedOpenAIAssistantId, dialogProps.credential)
        } else if (dialogProps.type === 'ADD' && !dialogProps.selectedOpenAIAssistantId) {
            console.log('type是ADD并且弹出框的props的selectedOpenAI有助手id')
            // 当助手对话框是添加一个空白的新助手
            setAssistantId('')
            setAssistantIcon(`https://api.dicebear.com/7.x/bottts/svg?seed=${uuidv4()}`)
            setAssistantCredential('')

            setOpenAIAssistantId('')
            setAssistantName('')
            setAssistantDesc('')
            setAssistantModel('')
            setAssistantInstructions('')
            setAssistantTools(['code_interpreter', 'retrieval'])
            setUploadAssistantFiles('')
            setAssistantFiles([])
        }

        return () => {
            console.log('组件销毁时 重置字段 (传递props type 或id 或凭证的 副作用函数)')
            setAssistantId('')
            setAssistantIcon(`https://api.dicebear.com/7.x/bottts/svg?seed=${uuidv4()}`)
            setAssistantCredential('')

            setOpenAIAssistantId('')
            setAssistantName('')
            setAssistantDesc('')
            setAssistantModel('')
            setAssistantInstructions('')
            setAssistantTools(['code_interpreter', 'retrieval'])
            setUploadAssistantFiles('')
            setAssistantFiles([])
            setLoading(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dialogProps])
    useEffect(() => {
        getUsersArray().then((res) => {
            getAllCredentialsApi.request(res.orgId, JSON.stringify(res.userIdArr))
        })
        getAllComponentsCredentialsApi.request()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // 获取助手对象信息的方法
    const syncData = (data) => {
        console.log('助手对象信息请求成功设置对象的详细信息')
        setOpenAIAssistantId(data.id)
        setAssistantName(data.name)
        setAssistantDesc(data.description)
        setAssistantModel(data.model)
        setAssistantInstructions(data.instructions)
        setAssistantFiles(data.files ?? [])

        let tools = []
        if (data.tools && data.tools.length) {
            for (const tool of data.tools) {
                tools.push(tool.type)
            }
        }
        setAssistantTools(tools)
    }
    // 选择Model
    const handleChange = (event) => {
        setAssistantModel(event.target.value)
    }
    // 选择凭证
    const Getcredential = (event) => {
        setOpenAI(event.target.value)
    }
    // 添加新的助手方法 (是一个异步方法)
    const addNewAssistant = async () => {
        setLoading(true)
        try {
            const assistantDetails = {
                id: openAIAssistantId,
                name: assistantName,
                description: assistantDesc,
                model: assistantModel,
                instructions: assistantInstructions,
                tools: assistantTools,
                files: assistantFiles,
                uploadFiles: uploadAssistantFiles
            }
            const obj = {
                details: JSON.stringify(assistantDetails),
                iconSrc: assistantIcon,
                credential: assistantCredential
            }
            // 通过获取的details信息和obj对象 进行数据添加
            const createResp = await assistantsApi.createNewAssistant(obj)
            if (createResp.data) {
                // 如果添加信息成功 则弹出消息
                enqueueSnackbar({
                    message: 'New Assistant added',
                    options: {
                        key: new Date().getTime() + Math.random(),
                        variant: 'success',
                        action: (key) => (
                            <Button style={{ color: 'white' }} onClick={() => closeSnackbar(key)}>
                                <IconX />
                            </Button>
                        )
                    }
                })
                // 调用index文件的onConfirm对新的内容进行实时更新
                onConfirm(createResp.data.id)
            }
            setLoading(false)
        } catch (error) {
            // 捕获报错信息 并且弹出报错信息弹窗
            const errorData = error.response.data || `${error.response.status}: ${error.response.statusText}`
            enqueueSnackbar({
                message: `Failed to add new Assistant: ${errorData}`,
                options: {
                    key: new Date().getTime() + Math.random(),
                    variant: 'error',
                    persist: true,
                    action: (key) => (
                        <Button style={{ color: 'white' }} onClick={() => closeSnackbar(key)}>
                            <IconX />
                        </Button>
                    )
                }
            })
            setLoading(false)
            onCancel()
        }
    }
    // 保存方法 当type是 edit时才会走这个 为修改方法 整体流程和add一样
    const saveAssistant = async () => {
        setLoading(true)
        try {
            const assistantDetails = {
                name: assistantName,
                description: assistantDesc,
                model: assistantModel,
                instructions: assistantInstructions,
                tools: assistantTools,
                files: assistantFiles,
                uploadFiles: uploadAssistantFiles
            }
            const obj = {
                details: JSON.stringify(assistantDetails),
                iconSrc: assistantIcon,
                credential: assistantCredential
            }
            const saveResp = await assistantsApi.updateAssistant(assistantId, obj)
            if (saveResp.data) {
                enqueueSnackbar({
                    message: 'Assistant saved',
                    options: {
                        key: new Date().getTime() + Math.random(),
                        variant: 'success',
                        action: (key) => (
                            <Button style={{ color: 'white' }} onClick={() => closeSnackbar(key)}>
                                <IconX />
                            </Button>
                        )
                    }
                })
                onConfirm(saveResp.data.id)
            }
            setLoading(false)
        } catch (error) {
            const errorData = error.response.data || `${error.response.status}: ${error.response.statusText}`
            enqueueSnackbar({
                message: `Failed to save Assistant: ${errorData}`,
                options: {
                    key: new Date().getTime() + Math.random(),
                    variant: 'error',
                    persist: true,
                    action: (key) => (
                        <Button style={{ color: 'white' }} onClick={() => closeSnackbar(key)}>
                            <IconX />
                        </Button>
                    )
                }
            })
            setLoading(false)
            onCancel()
        }
    }
    // 当type为edit时 才会显示sync和delete按钮 这个就是用来保存的 流程和上边差不多
    const onSyncClick = async () => {
        setLoading(true)
        try {
            const getResp = await assistantsApi.getAssistantObj(openAIAssistantId, assistantCredential)
            if (getResp.data) {
                syncData(getResp.data)
                enqueueSnackbar({
                    message: 'Assistant successfully synced!',
                    options: {
                        key: new Date().getTime() + Math.random(),
                        variant: 'success',
                        action: (key) => (
                            <Button style={{ color: 'white' }} onClick={() => closeSnackbar(key)}>
                                <IconX />
                            </Button>
                        )
                    }
                })
            }
            setLoading(false)
        } catch (error) {
            const errorData = error.response.data || `${error.response.status}: ${error.response.statusText}`
            enqueueSnackbar({
                message: `Failed to sync Assistant: ${errorData}`,
                options: {
                    key: new Date().getTime() + Math.random(),
                    variant: 'error',
                    persist: true,
                    action: (key) => (
                        <Button style={{ color: 'white' }} onClick={() => closeSnackbar(key)}>
                            <IconX />
                        </Button>
                    )
                }
            })
            setLoading(false)
        }
    }
    // 当type 为edit 显示的按钮的删除方法
    const onDeleteClick = () => {
        setDeleteDialogProps({
            title: `Delete Assistant`,
            description: `Delete Assistant ${assistantName}?`,
            cancelButtonName: 'Cancel'
        })
        setDeleteDialogOpen(true)
    }
    // 专门的delete弹窗的删除方法
    const deleteAssistant = async (isDeleteBoth) => {
        setDeleteDialogOpen(false)
        try {
            const delResp = await assistantsApi.deleteAssistant(assistantId, isDeleteBoth)
            if (delResp.data) {
                enqueueSnackbar({
                    message: 'Assistant deleted',
                    options: {
                        key: new Date().getTime() + Math.random(),
                        variant: 'success',
                        action: (key) => (
                            <Button style={{ color: 'white' }} onClick={() => closeSnackbar(key)}>
                                <IconX />
                            </Button>
                        )
                    }
                })
                onConfirm()
            }
        } catch (error) {
            const errorData = error.response.data || `${error.response.status}: ${error.response.statusText}`
            enqueueSnackbar({
                message: `Failed to delete Assistant: ${errorData}`,
                options: {
                    key: new Date().getTime() + Math.random(),
                    variant: 'error',
                    persist: true,
                    action: (key) => (
                        <Button style={{ color: 'white' }} onClick={() => closeSnackbar(key)}>
                            <IconX />
                        </Button>
                    )
                }
            })
            onCancel()
        }
    }
    // 删除上传文件的方法
    const onFileDeleteClick = async (fileId) => {
        setAssistantFiles(assistantFiles.filter((file) => file.id !== fileId))
    }
    // 创建新的openAi凭证
    const CreateOpenAICredentials = () => {
        console.log('创建')
        SetAddEditCredentialDialogState(true)
        return
    }
    const component = show ? (
        <Dialog
            fullWidth
            maxWidth='md'
            open={show}
            onClose={onCancel}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
            sx={{ position: 'relative' }}
        >
            {/* 对话框的title标题信息 */}
            <DialogTitle sx={{ fontSize: '1rem' }} id='alert-dialog-title'>
                {dialogProps.title}
            </DialogTitle>

            {/* 对话框的内容组件 */}
            <DialogContent>
                {/* 一个Box就是一行 */}
                {/* sx={{p:2}} 设置内边距 */}
                {/* 助手名称 */}
                <Box sx={{ p: 2 }}>
                    {/* 横向 从左到右布局 类似于flex */}
                    <Stack sx={{ position: 'relative' }} direction='row'>
                        <Typography variant='overline'>
                            Assistant Name
                            <div>
                                最多可以包含256个字符
                                {/* <TooltipWithParser title={"THE NAME OF THE ASSISTANT. THE MAXIMUM LENGTH IS 256 CHARACTERS."} /> */}
                            </div>
                        </Typography>
                    </Stack>
                    <OutlinedInput
                        id='assistantName'
                        type='string'
                        fullWidth
                        placeholder='My New Assistant'
                        value={assistantName}
                        name='assistantName'
                        onChange={(e) => setAssistantName(e.target.value)}
                    />
                </Box>
                {/* 助手描述信息 */}
                <Box sx={{ p: 2 }}>
                    <Stack sx={{ position: 'relative' }} direction='row'>
                        <Typography variant='overline'>
                            Assistant Description
                            <div>最多可以包含512个字符</div>
                            {/* <TooltipWithParser
                                style={{ marginLeft: 10 }}
                                title={'The description of the assistant. The maximum length is 512 characters.'}
                            /> */}
                        </Typography>
                    </Stack>
                    <OutlinedInput
                        id='assistantDesc'
                        type='string'
                        fullWidth
                        placeholder='Description of what the Assistant does'
                        multiline={true}
                        rows={3}
                        value={assistantDesc}
                        name='assistantDesc'
                        onChange={(e) => setAssistantDesc(e.target.value)}
                    />
                </Box>
                {/* 机器人图片 */}
                <Box sx={{ p: 2 }}>
                    <Stack sx={{ position: 'relative' }} direction='row'>
                        <Typography variant='overline'>Assistant Icon Src</Typography>
                    </Stack>
                    <div
                        style={{
                            width: 100,
                            height: 100,
                            borderRadius: '50%',
                            backgroundColor: 'white'
                        }}
                    >
                        <img
                            style={{
                                width: '100%',
                                height: '100%',
                                padding: 5,
                                borderRadius: '50%',
                                objectFit: 'contain'
                            }}
                            alt={assistantName}
                            src={assistantIcon}
                        />
                    </div>
                    <OutlinedInput
                        id='assistantIcon'
                        type='string'
                        fullWidth
                        placeholder={`https://api.dicebear.com/7.x/bottts/svg?seed=${uuidv4()}`}
                        value={assistantIcon}
                        name='assistantIcon'
                        onChange={(e) => setAssistantIcon(e.target.value)}
                    />
                </Box>
                {/* 助手模型 */}
                <Box sx={{ p: 2 }}>
                    <Stack sx={{ position: 'relative' }} direction='row'>
                        <Typography variant='overline'>
                            Assistant Model
                            <span style={{ color: 'red' }}>&nbsp;*</span>
                        </Typography>
                    </Stack>
                    <Select fullWidth value={assistantModel} onChange={handleChange}>
                        {assistantAvailableModels.map((item) => (
                            <MenuItem key={item.label} value={item.name}>
                                {item.label}
                            </MenuItem>
                        ))}
                    </Select>
                </Box>
                {/* openAi资格 */}
                <Box sx={{ p: 2 }}>
                    <Stack sx={{ position: 'relative' }} direction='row'>
                        <Typography variant='overline'>
                            OpenAI Credential
                            <span style={{ color: 'red' }}>&nbsp;*</span>
                        </Typography>
                    </Stack>
                    {/* <CredentialInputHandler
                        key={assistantCredential}
                        data={assistantCredential ? { credential: assistantCredential } : {}}
                        inputParam={{
                            label: 'Connect Credential',
                            name: 'credential',
                            type: 'credential',
                            credentialNames: ['openAIApi']
                        }}
                        onSelect={(newValue) => setAssistantCredential(newValue)}
                    /> */}

                    <Select fullWidth value={OpenAI} onChange={Getcredential}>
                        {getAllCredentialsApi.data
                            .filter((item) => item.credentialName === 'openAIApi')
                            .map((item) => (
                                <MenuItem key={item.id} value={item.name}>
                                    {item.name}
                                </MenuItem>
                            ))}
                        <MenuItem value={''} onClick={() => CreateOpenAICredentials()}>
                            create New
                        </MenuItem>
                    </Select>
                </Box>
                {/* 助手描述(类似说明书) */}
                <Box sx={{ p: 2 }}>
                    <Stack sx={{ position: 'relative' }} direction='row'>
                        <Typography variant='overline'>
                            Assistant Instruction
                            <TooltipWithParser
                                style={{ marginLeft: 10 }}
                                title={'The system instructions that the assistant uses. The maximum length is 32768 characters.'}
                            />
                        </Typography>
                    </Stack>
                    <OutlinedInput
                        id='assistantInstructions'
                        type='string'
                        fullWidth
                        placeholder='You are a personal math tutor. When asked a question, write and run Python code to answer the question.'
                        multiline={true}
                        rows={3}
                        value={assistantInstructions}
                        name='assistantInstructions'
                        onChange={(e) => setAssistantInstructions(e.target.value)}
                    />
                </Box>
                {/* 助手工具 */}
                <Box sx={{ p: 2 }}>
                    <Stack sx={{ position: 'relative' }} direction='row'>
                        <Typography variant='overline'>
                            Assistant Tools
                            <TooltipWithParser
                                style={{ marginLeft: 10 }}
                                title='A list of tool enabled on the assistant. There can be a maximum of 128 tools per assistant.'
                            />
                        </Typography>
                    </Stack>
                    <MultiDropdown
                        key={JSON.stringify(assistantTools)}
                        name={JSON.stringify(assistantTools)}
                        options={[
                            {
                                label: 'Code Interpreter',
                                name: 'code_interpreter'
                            },
                            {
                                label: 'Retrieval',
                                name: 'retrieval'
                            }
                        ]}
                        onSelect={(newValue) => (newValue ? setAssistantTools(JSON.parse(newValue)) : setAssistantTools([]))}
                        value={assistantTools ?? 'choose an option'}
                    />
                </Box>
                {/* 知识文件 上传文件 */}
                <Box sx={{ p: 2 }}>
                    <Stack sx={{ position: 'relative' }} direction='row'>
                        <Typography variant='overline'>
                            Knowledge Files
                            <TooltipWithParser
                                style={{ marginLeft: 10 }}
                                title='Allow assistant to use the content from uploaded files for retrieval and code interpreter. MAX: 20 files'
                            />
                        </Typography>
                    </Stack>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        {assistantFiles.map((file, index) => (
                            <div
                                key={index}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    width: 'max-content',
                                    height: 'max-content',
                                    borderRadius: 15,
                                    background: 'rgb(254,252,191)',
                                    paddingLeft: 15,
                                    paddingRight: 15,
                                    paddingTop: 5,
                                    paddingBottom: 5,
                                    marginRight: 10
                                }}
                            >
                                <span style={{ color: 'rgb(116,66,16)', marginRight: 10 }}>{file.filename}</span>
                                <IconButton sx={{ height: 15, width: 15, p: 0 }} onClick={() => onFileDeleteClick(file.id)}>
                                    <IconX />
                                </IconButton>
                            </div>
                        ))}
                    </div>
                    <File
                        key={uploadAssistantFiles}
                        fileType='*'
                        onChange={(newValue) => setUploadAssistantFiles(newValue)}
                        value={uploadAssistantFiles ?? 'Choose a file to upload'}
                    />
                </Box>
            </DialogContent>
            {/* DialogActions 组件是 Material-UI 中的一个组件，用于在对话框中显示操作按钮。*/}
            {/* 它通常与 Dialog 组件一起使用，用于在对话框底部显示按钮，以供用户进行交互。 */}
            <DialogActions>
                {dialogProps.type === 'EDIT' && (
                    <StyledButton color='secondary' variant='contained' onClick={() => onSyncClick()}>
                        Sync
                    </StyledButton>
                )}
                {dialogProps.type === 'EDIT' && (
                    <StyledButton color='error' variant='contained' onClick={() => onDeleteClick()}>
                        Delete
                    </StyledButton>
                )}
                {/* 点开的表单的最后Add添加按钮 */}
                <StyledButton
                    disabled={!(assistantModel && assistantCredential)}
                    variant='contained'
                    // 点击事件当点击后如果type是ADD走addNew  如果不是走save 点开的表单的最后Add添加按钮
                    onClick={() => (dialogProps.type === 'ADD' ? addNewAssistant() : saveAssistant())}
                >
                    {dialogProps.confirmButtonName}
                </StyledButton>
            </DialogActions>
            <DeleteConfirmDialog
                show={deleteDialogOpen}
                dialogProps={deleteDialogProps}
                onCancel={() => setDeleteDialogOpen(false)}
                onDelete={() => deleteAssistant()}
                onDeleteBoth={() => deleteAssistant(true)}
            />
            {loading && <BackdropLoader open={loading} />}
            {AddEditCredentialDialogState && <AddEditCredentialDialog></AddEditCredentialDialog>}
        </Dialog>
    ) : null
    // 将这个对话框组件通过Portal渲染到portal的节点上
    return createPortal(component, portalElement)
}

AssistantDialog.propTypes = {
    show: PropTypes.bool,
    dialogProps: PropTypes.object,
    onCancel: PropTypes.func,
    onConfirm: PropTypes.func
}

export default AssistantDialog
