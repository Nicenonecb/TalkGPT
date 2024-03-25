'use client'
import React, {createContext, useContext, useState} from 'react';
import {sessionStorageService} from "@/app/config/sidebar.config";

const SessionListContext = createContext();
export const useSessionList = () => useContext(SessionListContext);

export const SessionListProvider = ({children}) => {
    const [sessionList, setSessionList] = useState(sessionStorageService.getSessionList());

    const refreshSessionList = () => {
        // Fetch session list from localStorage
        const updatedList = sessionStorageService.getSessionList();
        setSessionList(updatedList);
    };

    return (
        <SessionListContext.Provider value={{sessionList, refreshSessionList}}>
            {children}
        </SessionListContext.Provider>
    );
};
