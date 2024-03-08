import { INodeParams, INodeCredential } from '../src/Interface'

class AlibabaAIApi implements INodeCredential {
    label: string
    name: string
    version: number
    description: string
    inputs: INodeParams[]

    constructor() {
        this.label = 'AlibabaAI API'
        this.name = 'alibabaAIApi'
        this.version = 1.0
        this.description =
            'Refer to <a target="_blank" href="https://help.aliyun.com/zh/dashscope/developer-reference/activate-dashscope-and-create-an-api-key?spm=a2c4g.11186623.0.0.5fb54c5e4AXcyb">official guide</a> on how to get ApiKey on AlibabaAI'

        this.inputs = [
            {
                label: 'AlibabaAI(通义千问) Api Key',
                name: 'alibabaAIApiKey',
                type: 'password'
            }
        ]
    }
}

module.exports = { credClass: AlibabaAIApi }
