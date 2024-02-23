'use client'

import {Input, Button, Form} from "antd";
import {useEffect, useState} from "react";
import {sceneList} from "@/app/config/dialogue.config";
import {LOCALE} from "@/app/config/openai.config";
import {Session, sessionStorageService} from "@/app/config/sidebar.config";
import {SettingOutlined, ArrowUpOutlined} from '@ant-design/icons'


export default function MainContent() {
    const [inputValue, setInputValue] = useState('');
    const [isInitialPage, setIsInitialPaget] = useState(true)
    const [isInputChange, setInputChange] = useState(false)

    const handleFinish = (values: any) => {
        const session: Session = {
            id: 0,
            details: values.details,
            subject: values.subject,
            locale: LOCALE,
        }
        sessionStorageService.saveSession(session);
        setIsInitialPaget(false)
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


                        <Input placeholder="主题：前端开发面试"
                               className='mb-10 h-10 w-1/3' onChange={handleInputChange}
                               suffix={<InputAfterIcon/>}>
                        </Input>

                    </div>
                </>) : null}


        </div>
    )
}

