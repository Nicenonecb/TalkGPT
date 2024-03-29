'use client'

import {useEffect} from "react";
import {ConfigProvider, theme} from "antd";
import {sessionStorageService} from "@/app/config/sidebar.config";
import MainContent from "@/app/home/page";

const isDarkMode = typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)').matches : null;
export default function Home() {

    useEffect(() => {
        sessionStorageService.getSessionList();
    }, [])
    return (
        <main className="flex min-h-screen w-full">
            <ConfigProvider theme={{
                algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
            }}>
                <MainContent></MainContent>
            </ConfigProvider>
        </main>
    );
}
