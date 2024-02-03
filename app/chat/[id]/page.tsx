'use client'

import React, {useEffect, useState} from 'react';
import {useOpenAISTT} from '@lobehub/tts/react';
import {configObject, OPENAI_API_KEY, OPENAI_PROXY_URL} from "@/app/config/openai.config";
import {Button} from 'antd'
import {HeartOutlined, SoundOutlined, TranslationOutlined, AudioMutedOutlined, AudioOutlined} from '@ant-design/icons';
import TextGen from "@/app/api/textGen";
import TTS from '@/app/api/tts'

interface SessionContent {
    type: string;
    content: string;
    url?: any;
    isRealtime?: boolean;
}

const locale = configObject.locale

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

const text_para = {
    model: configObject.textModel,
    message: [{
        role: 'user',
        content: '',
    }]
}

export default function Chat({params}: { params: { id: string } }) {
    const [ttsAudioUrl, setTtsAudioUrl] = useState(null);
    const [sessionContentList, setSessionContentList] = useState([] as SessionContent[]);
    const [ttsText, setTtsText] = useState('');
    // language
    const [language, setLanguage] = useState(locale);
    const [isTranscriptionComplete, setIsTranscriptionComplete] = useState(false);


    const {text, start, stop, isLoading, isRecording, url, formattedTime} = useOpenAISTT(locale, {
        api,
    });

    useEffect(() => {
        if (!isRecording && text && isTranscriptionComplete && url) {
            setSessionContentList(prevList => {
                return prevList.map(item => {
                    if (item.isRealtime) {
                        return {...item, isRealtime: false, url: url}; // 将实时条目转换为常规条目
                    }
                    return item;
                });
            });
            getGPtRes().then();
            setIsTranscriptionComplete(false);
        }
    }, [isRecording, text, isTranscriptionComplete, isLoading, url]);

    //页面第一次加载
    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             await getFistGPTRes();
    //         } catch (error) {
    //             console.error('Error fetching data:', error);
    //         }
    //     };
    //
    //     fetchData().then();
    // }, [params.id]);
    const getGPtRes = async () => {
        const res = await TextGen(false, text)
        const gptResUrl = await TTS(res);
        // if (res) {
        //     const gptItem = {
        //         type: 'tutor',
        //         content: res,
        //         url: gptResUrl,
        //     };
        //
        //     setSessionContentList(prevList => [...prevList, gptItem]);
        //     setTtsText(res);
        //     setTtsAudioUrl(gptResUrl);
        // }
    };

// 第一次反馈播放
    useEffect(() => {
        if (ttsAudioUrl) {
            const audio = new Audio(ttsAudioUrl);
            audio.play().catch(error => console.error('Audio play failed', error));
        }
    }, [ttsAudioUrl]);


    // const getFistGPTRes = async () => {
    //     const res = await TextGen(true, '')
    //     // const {data, code} = await sessionApi.getSessionDetailById(id);
    //     if (code === 200) {
    //         const gptResUrl: Promise<string | null> | '' = await ttsFunc(data.content);
    //         const gptItem = {
    //             type: 'tutor',
    //             content: data.content,
    //             url: gptResUrl,
    //         };
    //         setTtsAudioUrl(gptResUrl);
    //         setSessionContentList([gptItem]);
    //         setTtsText(data.content);
    //     }
    // };


    useEffect(() => {
        if (isRecording) {
            setSessionContentList(prevList => {
                const newList = [...prevList];
                const realtimeIndex = newList.findIndex(item => item.isRealtime);
                if (realtimeIndex !== -1) {
                    newList[realtimeIndex] = {...newList[realtimeIndex], content: text} as SessionContent;
                }
                return newList;
            });
        }
    }, [text, isRecording]);

    const playAudio = (value: any) => {
        if (value) {
            const audio = new Audio(value);
            audio.play().catch(error => console.error(' play failed', error));
        } else {
            console.error('Invalid audio URL:', value);
        }
    };

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
        <div className='bg-black h-screen w-full p-4 text-white flex flex-col justify-between'>
            {/* 聊天气泡 */}
            <div className='space-y-2 flex flex-col gap-5 overflow-auto'>
                {sessionContentList.map((item, index) => (
                    <div className={`flex items
-center ${item.type === 'tutor' ? 'justify-start' : 'justify-end'} space-x-2`} key={index}>
                        <div className='w-[800px] rounded-lg border border-gray-600 p-4'>
                            <p>{item.content}</p>
                            <div className='flex gap-5 text-base'>
                                <SoundOutlined onClick={() => playAudio(item.url)}/>
                                <TranslationOutlined/>
                                <HeartOutlined/>
                            </div>
                        </div>
                    </div>
                ))}
            </div>


            {/* 录音控制按钮 */}
            <div className='flex items-center'>
                <div className='flex-1 rounded p-2 bg-gray-800'>
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