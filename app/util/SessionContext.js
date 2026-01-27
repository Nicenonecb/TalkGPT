'use client'
import React, {createContext, useContext, useEffect, useState} from 'react';
import {sessionStorageService} from "@/app/config/sidebar.config";

const SessionListContext = createContext();
export const useSessionList = () => useContext(SessionListContext);

export const SessionListProvider = ({children}) => {
    const [sessionList, setSessionList] = useState([]);

    const refreshSessionList = async () => {
        // 从 IndexedDB 异步加载会话列表
        const updatedList = await sessionStorageService.getSessionList();
        setSessionList(updatedList);
    };

    useEffect(() => {
        refreshSessionList().catch(console.error);
    }, []);

    return (
        <SessionListContext.Provider value={{sessionList, refreshSessionList}}>
            {children}
        </SessionListContext.Provider>
    );
};
