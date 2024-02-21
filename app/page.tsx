'use client'

import {useEffect, useState} from "react";
import {ConfigProvider, theme} from "antd";

import {sessionStorageService} from "@/app/config/sidebar.config";
import MainContent from "@/app/home/page";


export default function Home() {

    useEffect(() => {
        sessionStorageService.getSessionList();
    }, [])


    return (
        <main className="flex min-h-screen w-full">
            <ConfigProvider theme={{
                algorithm: window.matchMedia('(prefers-color-scheme: dark)').matches ? theme.darkAlgorithm : theme.defaultAlgorithm,
            }}>
                <MainContent></MainContent>
            </ConfigProvider>
        </main>
    );
}
