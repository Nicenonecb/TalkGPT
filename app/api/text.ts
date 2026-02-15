import {sessionStorageService} from "@/app/config/sidebar.config";
import type {AppConfig} from "@/app/config/openai.config";


//
const normalizeApiBase = (baseUrl: string): string => {
    const trimmed = baseUrl.trim();
    if (!trimmed) {
        return '';
    }
    return trimmed.endsWith('/') ? trimmed : `${trimmed}/`;
};

export default async function Text(
    isInit = false,
    input: string | undefined,
    id: string,
    config: AppConfig
) {
    const sessionId = Number.parseInt(id, 10);
    const currentChat = Number.isNaN(sessionId) ? undefined : await sessionStorageService.getSessionById(sessionId);
    const locale = config.locale || '目标语言';
    const subject = currentChat?.subject || '日常交流';
    const promote = `您现在是${locale}语言大师， 我现在想和您聊${subject}，请你用${locale} 回复我`;
    const content = isInit ? promote : input;
    if (!content) {
        return '';
    }

    const apiBase = normalizeApiBase(config.openai_url);
    const payload = {
        model: config.textModel,
        temperature: config.randomness,
        messages: [{
            role: 'user',
            content,
        }],
    }
    const response = await fetch(`${apiBase}v1/chat/completions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.openai_key}`
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
    }
    const res = await response.json();
    return res.choices[0].message.content
}
