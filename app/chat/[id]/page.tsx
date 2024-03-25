'use client'

import React, {useEffect, useState, useCallback} from 'react';
import {useOpenAISTT} from '@lobehub/tts/react';
import {configObject, OPENAI_API_KEY, OPENAI_PROXY_URL} from "@/app/config/openai.config";
import {Button} from 'antd'
import {HeartOutlined, SoundOutlined, TranslationOutlined, AudioMutedOutlined, AudioOutlined} from '@ant-design/icons';
import Text from "@/app/api/text";
import TTS from '@/app/api/tts'

interface SessionContent {
    type: string;
    content: string;
    url?: any;
    isRealtime?: boolean;
}

const locale = configObject?.locale

const api: any =
    {
        OPENAI_API_KEY: {
            label: 'OPENAI_API_KEY',
            value: OPENAI_API_KEY,
        },
        OPENAI_PROXY_URL: {
            label: 'OPENAI_PROXY_URL',
            value: OPENAI_PROXY_URL,
        },
        serviceUrl: '',
    };


export default function Chat({params}: { params: { id: string } }) {
    const [ttsAudioUrl, setTtsAudioUrl] = useState('' as string | null);
    const [sessionContentList, setSessionContentList] = useState([] as SessionContent[]);
    const [ttsText, setTtsText] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);
    const [isTranscriptionComplete, setIsTranscriptionComplete] = useState(false);
    const {text, start, stop, isLoading, isRecording, url, formattedTime} = useOpenAISTT(locale, {
        api,
    });

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
        const res = await Text(initial, userText, params.id);
        if (res) {
            const gptResUrl = await TTS(res);
            setTtsAudioUrl(gptResUrl);
            const gptItem = {type: 'tutor', content: res, url: gptResUrl};
            setSessionContentList(prevList => [...prevList, gptItem]);
        }
    }, [params.id]);

    // 初始加载
    useEffect(() => {
        fetchAndPlayGPTResponse(true).catch(console.error);
    }, []);

    // 监听ttsAudioUrl变化，播放音频
    useEffect(() => {
        // @ts-ignore
        playAudio(ttsAudioUrl).catch(console.error);
    }, [ttsAudioUrl]);

    // 处理录音完成后的逻辑
    useEffect(() => {
        if (!isRecording && text && url) {
            fetchAndPlayGPTResponse(false, text).catch(console.error);
            setSessionContentList(prevList => prevList.map(item =>
                item.isRealtime ? {...item, isRealtime: false, url: url} : item
            ));
        }
    }, [isRecording, text, url, fetchAndPlayGPTResponse]);

    // 处理实时文字更新
    useEffect(() => {
        if (isRecording) {
            setSessionContentList(prevList => {
                const newList = [...prevList];
                const realtimeIndex = newList.findIndex(item => item.isRealtime);
                if (realtimeIndex !== -1) {
                    // @ts-ignore
                    newList[realtimeIndex] = {...newList[realtimeIndex], content: text};
                }
                return newList;
            });
        }
    }, [text, isRecording]);


    const handleStop = () => {
        stop(); // 调用原始的 stop 方法
        setIsTranscriptionComplete(true);
    }

    const handleStart = () => {
        start();
        setSessionContentList(prevList => [
            ...prevList,
            {type: 'stu', content: '', isRealtime: true}, // 添加实时 STT 条目
        ]);
    }
    return (


        <div className='bg-slate-900 h-screen w-full p-4 text-white flex flex-col justify-between'>
            {/* 聊天气泡 */}
            <div className='space-y-2 flex flex-col gap-5 overflow-auto'>
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


            {/* 录音控制按钮 */}
            <div className='flex items-center'>
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
            </div>
        </div>
    );


}