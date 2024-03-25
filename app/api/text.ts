// @ts-ignore
import {configObject, OPENAI_API_KEY, OPENAI_PROXY_URL, LOCALE} from "@/app/config/openai.config";
import {sessionStorageService} from "@/app/config/sidebar.config";


//
export default async function Text(isInit = false, input: string | undefined, id: string) {
    const currentChat = sessionStorageService.getSessionById(parseInt(id, 10))
    // @ts-ignore
    const promote = `您现在是${LOCALE}语言大师， 我现在想和您聊${currentChat.subject}，请你用${LOCALE} 回复我`
    const config = {
        model: configObject.textModel,
        messages: [{
            role: 'user',
            content: isInit ? promote : input,
        }],
    }
    const response = await fetch(OPENAI_PROXY_URL + 'v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify(config),
    });

    if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
    }
    const res = await response.json();
    return res.choices[0].message.content
}