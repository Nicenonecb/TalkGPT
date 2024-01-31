'use client'

import SideBar from "@/app/components/SideBar";
import MainContent from "@/app/home/page"
import SettingModal from "@/app/components/SettingModal";
import {useState} from "react";

export default function Home() {
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);
    const [isSettingModalVisible, setIsSettingModalVisible] = useState(false)
    const handleToggleSidebar = () => {
        setIsSidebarVisible(!isSidebarVisible);
    };
    const handleShowSettingModal = () => {
        setIsSettingModalVisible(true);
    }

    const handleHideSettingModal = () => {
        setIsSettingModalVisible(false);
    };

    return (
        <main className="flex min-h-screen">

            {isSidebarVisible && <SideBar onShowSettingModal={handleShowSettingModal}/>}

            <div className="flex items-center bg-slate-900">
                <div onClick={handleToggleSidebar} className=" ">
                    {/* 这里可以放置一个菜单图标或按钮来触发侧边栏切换 */}
                    <button>1</button>
                </div>
            </div>

            <MainContent></MainContent>
            <SettingModal open={isSettingModalVisible} onHideSettingModal={handleHideSettingModal}></SettingModal>
        </main>
    );
}
