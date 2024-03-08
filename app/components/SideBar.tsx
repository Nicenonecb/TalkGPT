import React, {useState} from 'react';
import Link from 'next/link';
import {SettingOutlined, StarOutlined, EllipsisOutlined, DeleteOutlined, EditOutlined} from '@ant-design/icons'
import {sessionStorageService} from "@/app/config/sidebar.config";

import {useRouter} from 'next/navigation'
import {Dropdown, Button} from "antd";

interface SideBarProps {
    onShowSettingModal: () => void;
}

const handleSessionPage = () => {

}

const SideBar: React.FC<SideBarProps> = ({onShowSettingModal}) => {
    const [hoveredChatId, setHoveredChatId] = useState<number | null>(null);
    const router = useRouter()
    const chatList = sessionStorageService.getSessionList()

    const handleDeleItem = (id) => {

    }

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
                    {chatList.map((chat) => (
                        <Link href={`/chat/${chat.id}`} key={chat.id} onClick={handleSessionPage}
                              onMouseOver={() => setHoveredChatId(chat.id)}
                              onMouseOut={() => setHoveredChatId(null)}
                              className="block py-2.5 px-5 rounded transition duration-200 hover:bg-gray-700 hover:text-white ">
                            <div className="flex justify-between">
                                <span>{chat.subject}</span>
                                {hoveredChatId === chat.id && <div className="flex gap-3">
                                    <DeleteOutlined onClick={() => handleDeleItem(chat.id)}></DeleteOutlined>
                                    <EditOutlined></EditOutlined>
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

        </div>
    );
};

export default SideBar;
