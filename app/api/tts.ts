import {OpenAITTS, OpenAITTSPayload} from '@lobehub/tts';
import {OPENAI_API_KEY, OPENAI_PROXY_URL} from "@/app/config/openai.config";
import {OpenaiVoice} from "@lobehub/tts";
import {configObject} from "@/app/config/openai.config";

const model = configObject.voiceModel
const voice = configObject.voice
export default function TTS(content: string,) {

    const tts = new OpenAITTS(
        {
            OPENAI_API_KEY: OPENAI_API_KEY,
            OPENAI_PROXY_URL: OPENAI_PROXY_URL + 'v1/'
        }
    )
    const fetchTTS = async () => {
        try {
            const payload: OpenAITTSPayload = {
                input: content,
                options: {
                    model: model,
                    voice: voice,
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