'use client'

import React, {useEffect, useState} from 'react';


interface SessionContent {
    type: string;
    content: string;
    url?: any;
    isRealtime?: boolean;
}

export default function Chat({params}: { params: { id: string } }) {
    const [ttsAudioUrl, setTtsAudioUrl] = useState(null);
    const [sessionContentList, setSessionContentList] = useState([] as SessionContent[]);
    const [ttsText, setTtsText] = useState('');
    // 后面改成从后端获取
    const [language, setLanguage] = useState();
    const [isTranscriptionComplete, setIsTranscriptionComplete] = useState(false);

}