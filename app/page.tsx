'use client'

import {useEffect, useState} from "react";
import {ConfigProvider, theme} from "antd";

import {sessionStorageService} from "@/app/config/sidebar.config";


export default function Home() {


    useEffect(() => {
        sessionStorageService.getSessionList();
    }, [])


    return (
        <main className="flex min-h-screen">
            <ConfigProvider theme={{
                // 1. 单独使用暗色算法
                algorithm: theme.darkAlgorithm,
                // 2. 组合使用暗色算法与紧凑算法
                // algorithm: [theme.darkAlgorithm, theme.compactAlgorithm],
            }}>


            </ConfigProvider>
        </main>
    );
}
