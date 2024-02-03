import {OPENAI_API_KEY, OPENAI_PROXY_URL} from "@/app/config/openai.config";


type TextGen = {
    model: string;
    messages: {
        role: string;
        content: string;
    }[];
}
export default async function TextGen(config: TextGen) {
    const response = await fetch(OPENAI_PROXY_URL + '/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify(config)
    });

    if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
    }
    
    return await response.json();
}