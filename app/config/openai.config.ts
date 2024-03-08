const storedConfig = typeof localStorage !== 'undefined' ? localStorage.getItem('config') : null;
const configObject = storedConfig ? JSON.parse(storedConfig) : {};

const OPENAI_API_KEY = configObject['openai_key']
const OPENAI_PROXY_URL = configObject['openai_url'];

const LOCALE = configObject['locale']


export {OPENAI_API_KEY, OPENAI_PROXY_URL, LOCALE, configObject}

