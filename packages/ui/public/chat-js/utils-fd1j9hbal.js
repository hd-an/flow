window.addEventListener('message', receiveMessage, false)
const matchOrigin = new RegExp(`experimental.cloudladder.net.cn$`)

let initChatOptions = {
    theme: {
        chatWindow: {
            showTitle: true,
            title: '尚云数智Bot',
            titleAvatarSrc: './messages.svg',
            welcomeMessage: '你好呀!',
            backgroundColor: '#ffffff',
            fontSize: 16,
            poweredByTextColor: '#303235',
            botMessage: {
                backgroundColor: '#f7f8ff',
                textColor: '#303235',
                showAvatar: true,
                avatarSrc: './parroticon.png'
            },
            userMessage: {
                backgroundColor: '#3B81F6',
                textColor: '#ffffff',
                showAvatar: true,
                avatarSrc: './usericon.png'
            },
            textInput: {
                placeholder: '请输入',
                backgroundColor: '#ffffff',
                textColor: '#303235',
                sendButtonColor: '#3B81F6'
            }
        }
    }
}

function deepAssign(target, source) {
    for (let key in source) {
        if (source[key] != null && typeof source[key] === 'object') {
            if (
                !target.hasOwnProperty(key) ||
                typeof target[key] !== 'object' ||
                Array.isArray(target[key]) !== Array.isArray(source[key])
            ) {
                target[key] = Array.isArray(source[key]) ? [] : {}
            }
            deepAssign(target[key], source[key])
        } else {
            if (
                ['[object Undefined]', '[object Null]'].includes(Object.prototype.toString.call(source[key])) ||
                (typeof source[key] == 'string' && !source[key].trim())
            ) {
            } else target[key] = source[key]
        }
    }
    return target
}

function setPropertyByPath(obj, path, value) {
    const keys = path.split('.')
    let current = obj

    for (let i = 0; i < keys.length - 1; i++) {
        if (!current.hasOwnProperty(keys[i]) || typeof current[keys[i]] !== 'object') {
            current[keys[i]] = {}
        }
        current = current[keys[i]]
    }

    try {
        if (typeof current[keys[keys.length - 1]] !== 'string') value = JSON.parse(value)
    } catch (error) {}

    current[keys[keys.length - 1]] = value

    return obj
}

function receiveMessage(event) {
    const origin = event.origin

    if (!matchOrigin.test(origin)) return

    deepAssign(initChatOptions, event.data)

    window.removeEventListener('message', receiveMessage, false)
}

let queryData = new URLSearchParams(window.location.search)

queryData.forEach((value, key) => {
    setPropertyByPath(initChatOptions, key, value)
})
