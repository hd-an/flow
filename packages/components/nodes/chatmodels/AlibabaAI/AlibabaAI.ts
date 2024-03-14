import { ICommonObject, INode, INodeData, INodeParams } from '../../../src/Interface'
import { getBaseClasses, getCredentialData, getCredentialParam } from '../../../src/utils'
import { ChatAlibabaTongyi } from '@langchain/community/chat_models/alibaba_tongyi'
import { BaseCache } from '@langchain/core/caches'
import { BaseChatModelParams } from '@langchain/core/language_models/chat_models'

interface AlibabaTongyiChatInput {
    /** Model name to use. Available options are: qwen-turbo, qwen-plus, qwen-max, or Other compatible models.
     * @default "qwen-turbo"
     */
    modelName: string
    /** Whether to stream the results or not. Defaults to false. */
    streaming?: boolean
    /** Messages to pass as a prefix to the prompt */
    // prefixMessages?: TongyiMessage[]
    /**
     * API key to use when making requests. Defaults to the value of
     * `ALIBABA_API_KEY` environment variable.
     */
    alibabaApiKey?: string
    /** Amount of randomness injected into the response. Ranges
     * from 0 to 1 (0 is not included). Use temp closer to 0 for analytical /
     * multiple choice, and temp closer to 1 for creative
     * and generative tasks. Defaults to 0.95.
     */
    temperature?: number
    /** Total probability mass of tokens to consider at each step. Range
     * from 0 to 1.0. Defaults to 0.8.
     */
    topP?: number
    topK?: number
    enableSearch?: boolean
    maxTokens?: number
    seed?: number
    /** Penalizes repeated tokens according to frequency. Range
     * from 1.0 to 2.0. Defaults to 1.0.
     */
    repetitionPenalty?: number
}

class ChatAlibabaAI_ChatModels implements INode {
    label: string
    name: string
    version: number
    type: string
    icon: string
    category: string
    description: string
    baseClasses: string[]
    credential: INodeParams
    inputs: INodeParams[]

    constructor() {
        this.label = 'ChatAlibabaAI'
        this.name = 'chatAlibabaAI'
        this.version = 1.0
        this.type = 'ChatAlibabaAI'
        this.icon = 'AlibabaAI.png'
        this.category = 'Chat Models'
        this.description = 'Wrapper around 通义千问AI large language models that use the Chat endpoint'
        this.baseClasses = [this.type, ...getBaseClasses(ChatAlibabaTongyi)]
        this.credential = {
            label: 'Connect Credential',
            name: 'credential',
            type: 'credential',
            credentialNames: ['alibabaAIApi']
        }
        this.inputs = [
            {
                label: 'Cache',
                name: 'cache',
                type: 'BaseCache',
                optional: true
            },
            {
                label: 'Model Name',
                name: 'modelName',
                type: 'options',
                options: [
                    {
                        label: 'qwen-turbo',
                        name: 'qwen-turbo'
                    },
                    {
                        label: 'qwen-plus',
                        name: 'qwen-plus'
                    },
                    {
                        label: 'qwen-max',
                        name: 'qwen-max'
                    },
                    {
                        label: 'qwen-max-longcontext',
                        name: 'qwen-max-longcontext'
                    },
                    {
                        label: 'qwen-1.8b-chat',
                        name: 'qwen-1.8b-chat'
                    },
                    {
                        label: 'qwen-7b-chat',
                        name: 'qwen-7b-chat'
                    },
                    {
                        label: 'qwen-14b-chat',
                        name: 'qwen-14b-chat'
                    },
                    {
                        label: 'qwen-72b-chat',
                        name: 'qwen-72b-chat'
                    },
                    {
                        label: 'baichuan2-7b-chat-v1',
                        name: 'baichuan2-7b-chat-v1'
                    },
                    {
                        label: 'baichuan2-13b-chat-v1',
                        name: 'baichuan2-13b-chat-v1'
                    },
                    {
                        label: 'chatglm-6b-v2',
                        name: 'chatglm-6b-v2'
                    },
                    {
                        label: 'wanx-v1',
                        name: 'wanx-v1'
                    },
                    {
                        label: 'wanx-style-repaint-v1',
                        name: 'wanx-style-repaint-v1'
                    },
                    {
                        label: 'wanx-background-generation-v2',
                        name: 'wanx-background-generation-v2'
                    },
                    {
                        label: 'Sambert系列模型',
                        name: 'Sambert系列模型'
                    },
                    {
                        label: 'paraformer-v1',
                        name: 'paraformer-v1'
                    },
                    {
                        label: 'paraformer-8k-v1',
                        name: 'paraformer-8k-v1'
                    },
                    {
                        label: 'paraformer-mtl-v1',
                        name: 'paraformer-mtl-v1'
                    },
                    {
                        label: 'paraformer-realtime-v1',
                        name: 'paraformer-realtime-v1'
                    },
                    {
                        label: 'paraformer-realtime-8k-v1',
                        name: 'paraformer-realtime-8k-v1'
                    },
                    {
                        label: 'qwen-vl-v1',
                        name: 'qwen-vl-v1'
                    },
                    {
                        label: 'qwen-vl-chat-v1',
                        name: 'qwen-vl-chat-v1'
                    },
                    {
                        label: 'baichuan-7b-v1',
                        name: 'baichuan-7b-v1'
                    },
                    {
                        label: 'llama2-7b-chat-v2',
                        name: 'llama2-7b-chat-v2'
                    },
                    {
                        label: 'llama2-13b-chat-v2',
                        name: 'llama2-13b-chat-v2'
                    },
                    {
                        label: 'chatglm3-6b',
                        name: 'chatglm3-6b'
                    },
                    {
                        label: 'multimodal-embedding-one-peace-v1',
                        name: 'multimodal-embedding-one-peace-v1'
                    },
                    {
                        label: 'facechain-facedetect',
                        name: 'facechain-facedetect'
                    },
                    {
                        label: 'facechain-finetune',
                        name: 'facechain-finetune'
                    },
                    {
                        label: 'facechain-generation',
                        name: 'facechain-generation'
                    },
                    {
                        label: 'stable-diffusion-xl',
                        name: 'stable-diffusion-xl'
                    },
                    {
                        label: 'stable-diffusion-v1.5',
                        name: 'stable-diffusion-v1.5'
                    },
                    {
                        label: 'dolly-12b-v2',
                        name: 'dolly-12b-v2'
                    }
                ],
                default: 'qwen-turbo',
                optional: true
            },
            {
                label: 'Temperature',
                name: 'temperature',
                type: 'number',
                step: 0.1,
                default: 0.9,
                optional: true
            },
            {
                label: 'Max Tokens',
                name: 'maxTokens',
                type: 'number',
                step: 1,
                optional: true,
                additionalParams: true
            },
            {
                label: 'Top Probability',
                name: 'topP',
                type: 'number',
                step: 0.1,
                optional: true,
                additionalParams: true
            },
            {
                label: 'top_k',
                name: 'topK',
                type: 'number',
                step: 1,
                default: 50,
                optional: true,
                additionalParams: true
            },
            // {
            //     label: 'Repetition Penalty',
            //     name: 'repetitionPenalty',
            //     type: 'number',
            //     step: 1,
            //     default: 1,
            //     optional: true,
            //     additionalParams: true
            // },
            // {
            //     label: 'Stop',
            //     name: 'stop',
            //     type: 'string',
            //     optional: true,
            //     additionalParams: true
            // },
            {
                label: 'Enable Search',
                name: 'enableSearch',
                type: 'boolean',
                optional: true,
                additionalParams: true,
                default: false
            },
            {
                label: 'BaseOptions',
                name: 'baseOptions',
                type: 'json',
                optional: true,
                additionalParams: true
            }
        ]
    }

    async init(nodeData: INodeData, _: string, options: ICommonObject): Promise<any> {
        const temperature = nodeData.inputs?.temperature as string
        const modelName = nodeData.inputs?.modelName as string
        const maxTokens = nodeData.inputs?.maxTokens as string
        const topP = nodeData.inputs?.topP as string
        const topK = nodeData.inputs?.topK as string
        const repetitionPenalty = nodeData.inputs?.repetitionPenalty as string
        const enableSearch = nodeData.inputs?.enableSearch || false
        const streaming = nodeData.inputs?.streaming as boolean
        const baseOptions = nodeData.inputs?.baseOptions

        const credentialData = await getCredentialData(nodeData.credential ?? '', options)
        const alibabaApiKey = getCredentialParam('alibabaAIApiKey', credentialData, nodeData)

        const cache = nodeData.inputs?.cache as BaseCache

        const obj: Partial<AlibabaTongyiChatInput> & BaseChatModelParams & { alibabaApiKey?: string } = {
            temperature: parseFloat(temperature),
            modelName,
            alibabaApiKey: alibabaApiKey,
            streaming: streaming ?? true
        }

        if (maxTokens) obj.maxTokens = parseInt(maxTokens, 10)
        if (topP) obj.topP = parseFloat(topP)
        if (topK) obj.topK = parseFloat(topK)
        if (repetitionPenalty) obj.repetitionPenalty = parseFloat(repetitionPenalty)
        obj.enableSearch = enableSearch
        if (cache) obj.cache = cache

        let parsedBaseOptions: any | undefined = undefined

        if (baseOptions) {
            try {
                parsedBaseOptions = typeof baseOptions === 'object' ? baseOptions : JSON.parse(baseOptions)
            } catch (exception) {
                throw new Error("Invalid JSON in the ChatOpenAI's BaseOptions: " + exception)
            }
        }
        const model = new ChatAlibabaTongyi({
            ...obj,
            ...parsedBaseOptions
        })
        return model
    }
}

module.exports = { nodeClass: ChatAlibabaAI_ChatModels }
