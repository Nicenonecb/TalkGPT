import {configObject, OPENAI_API_KEY, OPENAI_PROXY_URL} from "@/app/config/openai.config";


const promote = `您现在是${configObject.locale}语言大师， 我现在想和您聊${configObject.subject},具体细节为${configObject.details}，请你用${configObject.locale} 回复我`
//
export default async function Text(isInit = false, input: string | undefined) {
    const config = {
        model: configObject.textModel,
        messages: [{
            role: 'user',
            content: isInit ? promote : input,
        }],
    }
    const response = await fetch(OPENAI_PROXY_URL + 'chat/completions', {
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