'use client'
import SideBar from "@/app/components/SideBar";
import SettingModal from "@/app/components/SettingModal";
import {sessionStorageService} from "@/app/config/sidebar.config";
import {useEffect, useState} from "react";

export default function SidebarToggle() {

    const [isSidebarVisible, setIsSidebarVisible] = useState(true);
    const [isSettingModalVisible, setIsSettingModalVisible] = useState(false)
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        sessionStorageService.getSessionList();
    }, [])

    const handleToggleSidebar = () => {
        setIsSidebarVisible(!isSidebarVisible);
        setIsHovering(!isHovering)
    };
    const handleShowSettingModal = () => {
        setIsSettingModalVisible(true);
    }

    const handleHideSettingModal = () => {
        setIsSettingModalVisible(false);
    };

    return (
        <>
            {isSidebarVisible && <SideBar onShowSettingModal={handleShowSettingModal}/>}

            <div className="flex items-center bg-slate-900" onMouseEnter={() => setIsHovering(true)}
                 onMouseLeave={() => setIsHovering(false)}>
                {
                    isSidebarVisible && !isHovering && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20">
                            <path fill="currentColor" fillRule="evenodd"
                                  d="M10 1a1 1 0 0 1 1 1v16a1 1 0 1 1-2 0V2a1 1 0 0 1 1-1" clipRule="evenodd"/>
                        </svg>
                    )
                }
                {
                    isHovering && isSidebarVisible && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"
                             onClick={handleToggleSidebar}>
                            <path fill="currentColor" fillRule="evenodd" d="m15 4l2 2l-6 6l6 6l-2 2l-8-8z"/>
                        </svg>
                    )
                }
                {
                    !isSidebarVisible && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"
                             onClick={handleToggleSidebar}>
                            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                  strokeWidth="2.5" d="m10 17l5-5m0 0l-5-5"/>
                        </svg>
                    )
                }
            </div>
            <SettingModal open={isSettingModalVisible} onHideSettingModal={handleHideSettingModal}></SettingModal>
        </>

    )
}