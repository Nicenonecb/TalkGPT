'use client'
import React, {useEffect, useState} from 'react';
import Link from 'next/link';
import {SettingOutlined, StarOutlined, DeleteOutlined, EditOutlined} from '@ant-design/icons'
import {sessionStorageService} from "@/app/config/sidebar.config";
import {useRouter, usePathname} from 'next/navigation'
import {lsSetItem} from "@/app/api/storage";
import {useSessionList} from '@/app/util/SessionContext';

interface SideBarProps {
    onShowSettingModal: () => void;
}

const handleSessionPage = () => {

}
const sessionArr = sessionStorageService.getSessionList() ?? []
const SideBar: React.FC<SideBarProps> = ({onShowSettingModal}) => {
    const [isClient, setIsClient] = useState(false)
    const [hoveredChatId, setHoveredChatId] = useState<number | null>(null);
    const {sessionList, refreshSessionList} = useSessionList();

    const router = useRouter()
    const params = usePathname()
    const lastNumber = params.split("/").pop()
    useEffect(() => {
        //避免水合错误
        setIsClient(true)
    }, []);

    const handleDeleteItem = (e, id: number) => {
        e.preventDefault()
        const newArr = sessionList.filter(item => item.id !== id);
        lsSetItem('sessionList', newArr);
        refreshSessionList();
        if (id.toString() === lastNumber) {
            router.push('/')
        }
    };
    return (
        <div
            className="bg-black text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out flex flex-col justify-between">
            <div>
                <div className="flex items-center space-x-2 px-4 mb-10 cursor-pointer" onClick={() => router.push('/')}>
                    <StarOutlined size={24}/>
                    <span>TalkGPT</span>
                </div>

                {/* Chat groups and items */}
                <nav className="flex flex-col  justify-center">
                    {isClient && Array.isArray(sessionList) && sessionList.map((chat) => (
                        <Link href={`/chat/${chat.id}`} key={chat.id} onClick={handleSessionPage}
                              onMouseOver={() => setHoveredChatId(chat.id)}
                              onMouseOut={() => setHoveredChatId(null)}
                              className="block py-2.5 px-5 rounded transition duration-200 hover:bg-gray-700 hover:text-white ">

                            <div className="flex justify-between">
                                <div>{chat.subject}</div>
                                {hoveredChatId === chat.id && <div className="flex gap-3">
                                    <DeleteOutlined onClick={(e) => handleDeleteItem(e, chat.id)}></DeleteOutlined>
                                    {/*<EditOutlined></EditOutlined>*/}
                                </div>
                                }
                            </div>

                        </Link>
                    ))}

                </nav>
            </div>

            <div>
                {/* User Config */}
                <div className="flex items-center space-x-2 px-4 cursor-pointer" onClick={onShowSettingModal}>
                    <SettingOutlined size={24}/>
                    <span>设置</span>
                </div>
            </div>
            {/*<button onClick={() => router.push('/')}>112</button>*/}
        </div>
    );
};

export default SideBar;
