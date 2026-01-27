export type AppConfig = {
    openai_key: string;
    openai_url: string;
    locale: string;
    textModel: string;
    voiceModel: string;
    voice: string;
    randomness: number;
    speechRate: number;
};

export const defaultConfig: AppConfig = {
    openai_key: '',
    openai_url: '',
    locale: 'en-US',
    textModel: 'gpt-3.5-turbo',
    voiceModel: 'tts-1',
    voice: 'alloy',
    randomness: 1,
    speechRate: 1,
};
