import {lsGetItem} from '@/app/api/storage'

type  Config = {
    openai_key: string,
    openai_url: string,
    locale: string,
    textModel: string,
}
const configObject = lsGetItem<Config>('config', {
    openai_key: '',
    openai_url: '',
    locale: '',
    textModel: '',
})

let OPENAI_API_KEY: string = configObject ? configObject['openai_key'] : '';
let OPENAI_PROXY_URL: string = configObject ? configObject['openai_url'] : '';
let LOCALE: string = configObject ? configObject['locale'] : '';


export {OPENAI_API_KEY, OPENAI_PROXY_URL, LOCALE, configObject}

