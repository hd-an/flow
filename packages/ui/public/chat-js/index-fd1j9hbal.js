import Chatbot from './web-fd1j9hbal.js'

function init() {
    const element = document.createElement('flowise-fullchatbot')

    document.body.replaceChild(element, document.body.firstElementChild)

    Chatbot.initFull(initChatOptions)
    queryData = initChatOptions = void 0
    window.removeEventListener('message', receiveMessage, false)
}

if (typeof window.parent.postMessage === 'function') {
    window.parent.postMessage({ uniqueKey: queryData.get('key') }, '*')

    setTimeout(init, 150)
} else init()
