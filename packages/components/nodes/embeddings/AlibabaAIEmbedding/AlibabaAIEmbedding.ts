// import { OpenAIEmbeddings, OpenAIEmbeddingsParams } from '@langchain/openai'
import { AlibabaAIEmbeddings, type AlibabaAIEmbeddingsParams } from './alibaba_embedding'
import { ICommonObject, INode, INodeData, INodeParams } from '../../../src/Interface'
import { getBaseClasses, getCredentialData, getCredentialParam } from '../../../src/utils'

class OpenAIEmbedding_Embeddings implements INode {
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
        this.label = 'AlibabaAI Embeddings'
        this.name = 'alibabaAIEmbeddings'
        this.version = 1.0
        this.type = 'AlibabaAIEmbeddings'
        this.icon = 'AlibabaAI.png'
        this.category = 'Embeddings'
        this.description = 'AlibabaAI API to generate embeddings for a given text'
        this.baseClasses = [this.type, ...getBaseClasses(AlibabaAIEmbeddings)]
        this.credential = {
            label: 'Connect Credential',
            name: 'credential',
            type: 'credential',
            credentialNames: ['alibabaAIApi']
        }
        this.inputs = [
            {
                label: 'Model Name',
                name: 'modelName',
                type: 'options',
                options: [
                    {
                        label: 'text-embedding-v2',
                        name: 'text-embedding-v2'
                    }
                ],
                default: 'text-embedding-v2',
                optional: true
            },
            {
                label: 'Strip New Lines',
                name: 'stripNewLines',
                type: 'boolean',
                optional: true,
                additionalParams: true
            },
            {
                label: 'Batch Size',
                name: 'batchSize',
                type: 'number',
                optional: true,
                additionalParams: true
            }
        ]
    }

    async init(nodeData: INodeData, _: string, options: ICommonObject): Promise<any> {
        const stripNewLines = nodeData.inputs?.stripNewLines as boolean
        const batchSize = nodeData.inputs?.batchSize as string
        // const timeout = nodeData.inputs?.timeout as string
        // const basePath = nodeData.inputs?.basepath as string
        const modelName = nodeData.inputs?.modelName

        const credentialData = await getCredentialData(nodeData.credential ?? '', options)
        const apiKey = getCredentialParam('alibabaAIApiKey', credentialData, nodeData)

        const obj: Partial<AlibabaAIEmbeddingsParams> & { apiKey?: string } = {
            apiKey,
            modelName
        }

        if (stripNewLines) obj.stripNewLines = stripNewLines
        if (batchSize) obj.batchSize = parseInt(batchSize, 10)

        const model = new AlibabaAIEmbeddings(obj)
        return model
    }
}

module.exports = { nodeClass: OpenAIEmbedding_Embeddings }
