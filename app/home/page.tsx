'use client'
import {AudioOutlined} from '@ant-design/icons';
import {Input, Button, Form} from "antd";
import {useState} from "react";
import {sceneList} from "@/app/config/dialogue.config";
import {LOCALE} from "@/app/config/openai.config";
import {Session, sessionStorageService} from "@/app/config/sidebar.config";

export default function MainContent() {
    const [inputValue, setInputValue] = useState('');
    const [isInitialPage, setIsInitialPaget] = useState(true)

    const [form] = Form.useForm();

    const handleAddChat = () => {
        form.submit()
    }

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
    return (
        <div className="bg-slate-900 w-full flex flex-col  items-center ">
            {isInitialPage ? (
                <>
                    <div className="flex flex-1 justify-center items-center ">
                        What do you want to talk to me
                    </div>
                    <div className="flex flex-col gap-y-10">
                        <div className="flex items-center justify-center gap-x-20 ">
                            {sceneList.map((scene, index) => (
                                <div key={index}
                                     className="flex flex-col gap-3 mb-4 border-2 h-24 w-60 border-gray-500 rounded  group p-3">
                                    <div className="text-lg ">{scene.title}</div>
                                    <div className="flex gap-3">
                                        <div className="text-gray-600">{scene.content}</div>
                                        <AudioOutlined className="hidden group-hover:block"/>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex w-full justify-center items-center">

                            <Form form={form} onFinish={handleFinish} className="w-2/3">
                                <Form.Item name="subject">
                                    <Input placeholder="主题：前端开发面试">


                                    </Input>
                                </Form.Item>
                                <Form.Item name='details'>
                                    <Input placeholder="细节：专注微前端领域">
                                    </Input>
                                </Form.Item>
                            </Form>

                            <Button className="" shape="round" onClick={handleAddChat}>

                            </Button>
                        </div>
                    </div>
                </>) : null}


        </div>
    )
}

