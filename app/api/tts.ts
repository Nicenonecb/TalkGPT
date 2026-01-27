import {OpenAITTS, OpenAITTSPayload} from '@lobehub/tts';
import type {AppConfig} from "@/app/config/openai.config";

const normalizeApiBase = (baseUrl: string): string => {
    const trimmed = baseUrl.trim();
    if (!trimmed) {
        return '';
    }
    return trimmed.endsWith('/') ? trimmed : `${trimmed}/`;
};

export default function TTS(content: string, config: AppConfig) {
    const tts = new OpenAITTS(
        {
            OPENAI_API_KEY: config.openai_key,
            OPENAI_PROXY_URL: `${normalizeApiBase(config.openai_url)}v1/`,
        }
    )
    const fetchTTS = async () => {
        try {
            const payload: OpenAITTSPayload = {
                input: content,
                options: {
                    model: config.voiceModel,
                    voice: config.voice,
                },
            };
            const response: Response = await tts.create(payload);
            const audioBlob: Blob = new Blob([await response.arrayBuffer()], {type: 'audio/mp3'});
            return URL.createObjectURL(audioBlob);
        } catch (error) {
            console.error('Error synthesizing speech:', error);
            return null;
        }
    };

    if (content) {
        return fetchTTS().then();
    }
    return '';
}
