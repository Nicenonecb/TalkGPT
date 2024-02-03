import React from 'react';
import Link from 'next/link';
import {SettingOutlined, StarOutlined} from '@ant-design/icons'
import {sessionStorageService} from "@/app/config/sidebar.config";

interface SideBarProps {
    onShowSettingModal: () => void;
}

const handleSessionPage = () => {

}
const SideBar: React.FC<SideBarProps> = ({onShowSettingModal}) => {
    const chatList = sessionStorageService.getSessionList()
    return (
        <div
            className="bg-black text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out flex flex-col justify-between">
            <div>


                <div className="flex items-center space-x-2 px-4">
                    <StarOutlined size={24}/>
                    <span>TalkGPT</span>
                </div>

                {/* Chat groups and items */}
                <nav>
                    {chatList.map((chat) => (
                        <Link href={`/chat/${chat.id}`} key={chat.id} onClick={handleSessionPage}
                              className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white">
                            {chat.subject}
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
