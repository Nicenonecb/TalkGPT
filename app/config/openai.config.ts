import {lsGetItem} from '@/app/api/storage'

type  Config = {
    openai_key: string,
    openai_url: string,
    locale: string
}
const configObject = lsGetItem<Config>('config', {
    openai_key: '',
    openai_url: '',
    locale: ''
})

let OPENAI_API_KEY, OPENAI_PROXY_URL, LOCALE: string;

if (configObject) {
    OPENAI_API_KEY = configObject['openai_key']
    OPENAI_PROXY_URL = configObject['openai_url']
    LOCALE = configObject['locale']
}


export {OPENAI_API_KEY, OPENAI_PROXY_URL, LOCALE, configObject}

