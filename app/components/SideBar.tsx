import React from 'react';
import {SettingOutlined, StarOutlined} from '@ant-design/icons'
import SettingModal from "@/app/components/SettingModal";

interface SideBarProps {
    onShowSettingModal: () => void;
}

const SideBar: React.FC<SideBarProps> = ({onShowSettingModal}) => {
    // 假设这是从某个状态或 API 获取的数据
    const chatGroups = [
        {
            title: 'Today',
            chats: ['微服务架构模式', 'DevOps 技术栈概述', '布隆过滤器是神什么']
            // ... 可以添加更多属性和聊天
        },
        {
            title: 'Previous 7 Days',
            chats: ['New chat', '全局/UI交互逻辑']
            // ... 可以添加更多属性和聊天
        },
        // ... 更多分组
    ];


    return (
        <div
            className="bg-black text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out flex flex-col justify-between">
            {/* Logo and search part */}
            <div>


                <div className="flex items-center space-x-2 px-4">
                    <StarOutlined size={24}/>
                    <span>TalkGPT</span>
                </div>

                {/* Chat groups and items */}
                <nav>
                    {chatGroups.map((group) => (
                        <div key={group.title}>
                            <h3 className="text-gray-400 px-4 my-2">{group.title}</h3>
                            {group.chats.map((chat) => (
                                <a href="#"
                                   className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white"
                                   key={chat}>
                                    {chat}
                                </a>
                            ))}
                        </div>
                    ))}
                </nav>
            </div>
            <div>

                {/* User Account */}
                <div className="flex items-center space-x-2 px-4 cursor-pointer" onClick={onShowSettingModal}>
                    <SettingOutlined size={24}/>
                    <span>设置</span>
                </div>
            </div>
        </div>
    );
};

export default SideBar;
