'use client'

import React, {useEffect, useState, useCallback, useMemo, useRef} from 'react';
import {useOpenAISTT} from '@lobehub/tts/react';
import {Button, Input} from 'antd'
import {SoundOutlined, AudioMutedOutlined, AudioOutlined} from '@ant-design/icons';
import Text from "@/app/api/text";
import TTS from '@/app/api/tts'
import {sessionStorageService, Session, SessionMessage} from "@/app/config/sidebar.config";
import {useConfig} from '@/app/util/ConfigContext';
import {useSessionList} from '@/app/util/SessionContext';


export default function Chat({params}: { params: { id: string } }) {
    const [ttsAudioUrl, setTtsAudioUrl] = useState('' as string | null);
    const [sessionContentList, setSessionContentList] = useState([] as SessionMessage[]);
    const [inputValue, setInputValue] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);
    const [session, setSession] = useState<Session | null>(null);
    const sessionRef = useRef<Session | null>(null);
    const {config} = useConfig();
    const {refreshSessionList} = useSessionList();

    const api = useMemo(() => ({
        OPENAI_API_KEY: {
            label: 'OPENAI_API_KEY',
            value: config.openai_key,
        },
        OPENAI_PROXY_URL: {
            label: 'OPENAI_PROXY_URL',
            value: config.openai_url,
        },
        serviceUrl: '',
    }), [config.openai_key, config.openai_url]);

    const {text, start, stop, isLoading, isRecording, url, formattedTime} = useOpenAISTT(config.locale || 'en-US', {
        api,
    });

    useEffect(() => {
        sessionRef.current = session;
    }, [session]);

    useEffect(() => {
        const sessionId = Number.parseInt(params.id, 10);
        if (Number.isNaN(sessionId)) {
            setSession(null);
            setSessionContentList([]);
            return;
        }
        sessionStorageService.getSessionById(sessionId)
            .then((storedSession) => {
                setSession(storedSession);
                setSessionContentList(storedSession?.messages ?? []);
            })
            .catch(console.error);
    }, [params.id]);

    const persistMessages = useCallback(async (nextList: SessionMessage[]) => {
        // 将消息列表写回 IndexedDB，保证刷新后可恢复
        const currentSession = sessionRef.current;
        if (!currentSession) {
            return;
        }
        const nextSession = {
            ...currentSession,
            messages: nextList,
            updatedAt: Date.now(),
        };
        await sessionStorageService.updateSession(nextSession);
        sessionRef.current = nextSession;
        setSession(nextSession);
        refreshSessionList().catch(console.error);
    }, [refreshSessionList]);

    const updateListAndPersist = useCallback((
        updater: SessionMessage[] | ((prev: SessionMessage[]) => SessionMessage[])
    ) => {
        setSessionContentList((prevList) => {
            const nextList = typeof updater === 'function' ? updater(prevList) : updater;
            persistMessages(nextList).catch(console.error);
            return nextList;
        });
    }, [persistMessages]);

    const playAudio = useCallback(async (audioUrl: string | undefined) => {
        if (audioUrl && !isPlaying) {
            setIsPlaying(true);
            const audio = new Audio(audioUrl);
            try {
                await audio.play();
                audio.onended = () => setIsPlaying(false);
            } catch (error) {
                console.error('Audio play failed', error);
                setIsPlaying(false);
            }
        }
    }, [isPlaying]);

    const fetchAndPlayGPTResponse = useCallback(async (initial = false, userText = '') => {
        if (!config.openai_key || !config.openai_url) {
            return;
        }
        const res = await Text(initial, userText, params.id, config);
        if (res) {
            const gptResUrl = await TTS(res, config);
            setTtsAudioUrl(gptResUrl);
            const gptItem: SessionMessage = {
                type: 'tutor',
                content: res,
                url: gptResUrl,
                createdAt: Date.now(),
            };
            updateListAndPersist(prevList => [...prevList, gptItem]);
        }
    }, [params.id, config, updateListAndPersist]);

    // 初始进入会话时自动引导一次对话
    useEffect(() => {
        if (!session) {
            return;
        }
        if (session.messages && session.messages.length > 0) {
            return;
        }
        fetchAndPlayGPTResponse(true).catch(console.error);
    }, [session, fetchAndPlayGPTResponse]);

    // 监听ttsAudioUrl变化，播放音频
    useEffect(() => {
        playAudio(ttsAudioUrl ?? undefined).catch(console.error);
    }, [ttsAudioUrl, playAudio]);

    // 处理录音完成后的逻辑
    useEffect(() => {
        if (!isRecording && text && url) {
            fetchAndPlayGPTResponse(false, text).catch(console.error);
            updateListAndPersist(prevList => prevList.map(item =>
                item.isRealtime ? {
                    ...item,
                    content: text,
                    isRealtime: false,
                    url: url,
                    createdAt: Date.now(),
                } : item
            ));
        }
    }, [isRecording, text, url, fetchAndPlayGPTResponse, updateListAndPersist]);

    // 处理实时文字更新
    useEffect(() => {
        if (isRecording) {
            setSessionContentList(prevList => {
                const newList = [...prevList];
                const realtimeIndex = newList.findIndex(item => item.isRealtime);
                if (realtimeIndex !== -1) {
                    newList[realtimeIndex] = {...newList[realtimeIndex], content: text};
                }
                return newList;
            });
        }
    }, [text, isRecording]);


    const handleStop = () => {
        stop(); // 调用原始的 stop 方法
    }

    const handleStart = () => {
        start();
        setSessionContentList(prevList => [
            ...prevList,
            {type: 'stu', content: '', isRealtime: true}, // 添加实时 STT 条目
        ]);
    }

    const handleSendText = useCallback(async () => {
        const trimmedText = inputValue.trim();
        if (!trimmedText) {
            return;
        }
        const userMessage: SessionMessage = {
            type: 'stu',
            content: trimmedText,
            createdAt: Date.now(),
        };
        updateListAndPersist(prevList => [...prevList, userMessage]);
        setInputValue('');
        await fetchAndPlayGPTResponse(false, trimmedText);
    }, [inputValue, updateListAndPersist, fetchAndPlayGPTResponse]);
    return (


        <div className='bg-slate-900 h-screen w-full p-4 text-white flex flex-col justify-between'>
            {/* 聊天气泡 */}
            <div className='space-y-2 flex flex-col gap-5 overflow-auto'>
                {!session && (
                    <div className='text-sm text-amber-400'>
                        未找到会话，请返回首页重新创建。
                    </div>
                )}
                {(!config.openai_key || !config.openai_url) && (
                    <div className='text-sm text-amber-400'>
                        请先在设置里填写 API Key 与代理地址。
                    </div>
                )}
                {sessionContentList.map((item, index) => (
                    <div className={`flex items
-center ${item.type === 'tutor' ? 'justify-start' : 'justify-end'} space-x-2`} key={index}>
                        <div className='w-[800px] rounded-lg border border-gray-600 p-4'>
                            <p>{item.content}</p>
                            <div className='flex gap-5 mt-3 text-base'>
                                <SoundOutlined onClick={() => playAudio(item.url)}/>
                                {/*<TranslationOutlined/>*/}
                                {/*<HeartOutlined/>*/}
                            </div>
                        </div>
                    </div>
                ))}
            </div>


            {/* 录音与文本输入 */}
            <div className='flex flex-col gap-3'>
                <Input
                    placeholder="输入你想练习的句子"
                    value={inputValue}
                    onChange={(event) => setInputValue(event.target.value)}
                    onPressEnter={() => handleSendText().catch(console.error)}
                />
                <div className='flex items-center gap-2'>
                    <div className='flex-1'>
                        {isRecording ? (
                            <Button block icon={<AudioMutedOutlined/>} onClick={handleStop}>
                                Stop {formattedTime}
                            </Button>
                        ) : isLoading ? (
                            <Button block loading>
                                Recognition...
                            </Button>
                        ) : (
                            <Button block icon={<AudioOutlined/>} onClick={handleStart} type='primary'>
                                Recognition
                            </Button>
                        )}
                    </div>
                    <Button
                        type='primary'
                        onClick={() => handleSendText().catch(console.error)}
                        disabled={!inputValue.trim() || isLoading}
                    >
                        发送
                    </Button>
                </div>
            </div>
        </div>
    );


}
