const storedConfig = localStorage.getItem('config');
const configObject = storedConfig ? JSON.parse(storedConfig) : {};


const OPENAI_API_KEY = configObject['openai_key']

const OPENAI_PROXY_URL = configObject['openai_url'];

const LOCALE = configObject['locale']

// const sttAPI: any = {
//     OPENAI_API_KEY: {
//         label: 'OPENAI_API_KEY',
//         value: OPENAI_API_KEY,
//     },
//     OPENAI_PROXY_URL: {
//         label: 'OPENAI_PROXY_URL',
//         value: OPENAI_PROXY_URL,
//     },
//     serviceUrl: '',
// };


export {OPENAI_API_KEY, OPENAI_PROXY_URL, LOCALE}