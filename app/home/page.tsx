'use client'

import {Input} from "antd";
import {useState} from "react";
import {sceneList} from "@/app/config/dialogue.config";
import {LOCALE} from "@/app/config/openai.config";
import {Session, sessionStorageService} from "@/app/config/sidebar.config";
import {ArrowUpOutlined} from '@ant-design/icons'


export default function MainContent() {
    const [inputValue, setInputValue] = useState('');
    const [isInitialPage, setIsInitialPage] = useState(true)
    const [isInputChange, setInputChange] = useState(false)

    const handleFinish = (values: any) => {
        const session: Session = {
            id: 0,
            subject: values.target.value,
            locale: LOCALE,
        }
        sessionStorageService.saveSession(session);
        setIsInitialPage(false)
    }
    const handleInputChange = (e: any) => {
        e.target.value ? setInputChange(true) : setInputChange(false)
    }
    const InputAfterIcon = () => {
        return isInputChange ? <ArrowUpOutlined/> : null
    }
    return (
        // flex flex-col  items-center
        <div className="bg-slate-900 w-full   flex flex-col items-center ">
            {isInitialPage ? (
                <>
                    <div className="flex flex-1 justify-center  items-center ">
                        What do you want to talk to me
                    </div>
                    <div className="flex flex-col w-full  items-center ">
                        <div className="flex items-center justify-center  gap-10 mb-8">
                            {sceneList.map((scene, index) => (
                                <div key={index} className="">{scene.title}</div>
                            ))}
                        </div>
                        <div className="flex gap-3 mb-10 w-full">
                            <Input placeholder="主题：前端开发面试" className="w-full"
                                   onChange={handleInputChange} onPressEnter={handleFinish}
                            >
                            </Input>
                            <InputAfterIcon></InputAfterIcon>
                        </div>
                    </div>
                </>) : null}
        </div>
    )
}

