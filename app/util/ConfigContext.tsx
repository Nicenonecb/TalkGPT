'use client';

import React, {createContext, useCallback, useContext, useEffect, useState} from 'react';
import type {AppConfig} from '@/app/config/openai.config';
import {defaultConfig} from '@/app/config/openai.config';
import {getItem, putItem} from '@/app/api/indexeddb';

type ConfigRecord = {
    key: string;
    value: AppConfig;
};

type ConfigContextValue = {
    config: AppConfig;
    isReady: boolean;
    refreshConfig: () => Promise<void>;
    saveConfig: (nextConfig: AppConfig) => Promise<void>;
};

const ConfigContext = createContext<ConfigContextValue | null>(null);

export const useConfig = (): ConfigContextValue => {
    const context = useContext(ConfigContext);
    if (!context) {
        throw new Error('ConfigContext 未初始化');
    }
    return context;
};

export const ConfigProvider = ({children}: {children: React.ReactNode}) => {
    const [config, setConfig] = useState<AppConfig>(defaultConfig);
    const [isReady, setIsReady] = useState(false);

    const refreshConfig = useCallback(async () => {
        try {
            const stored = await getItem<ConfigRecord>('config', 'config');
            if (stored?.value) {
                setConfig({...defaultConfig, ...stored.value});
                return;
            }
            if (typeof localStorage !== 'undefined') {
                const legacyConfig = localStorage.getItem('config');
                if (legacyConfig) {
                    const parsedConfig = JSON.parse(legacyConfig);
                    const normalizedConfig = {...defaultConfig, ...parsedConfig};
                    setConfig(normalizedConfig);
                    await putItem('config', {key: 'config', value: normalizedConfig});
                }
            }
        } catch (error) {
            console.error('读取配置失败:', error);
        } finally {
            setIsReady(true);
        }
    }, []);

    const saveConfig = useCallback(async (nextConfig: AppConfig) => {
        // 保证配置字段完整，避免历史数据缺字段导致运行异常
        const normalizedConfig = {...defaultConfig, ...nextConfig};
        setConfig(normalizedConfig);
        setIsReady(true);
        try {
            await putItem('config', {key: 'config', value: normalizedConfig});
        } catch (error) {
            console.error('保存配置失败:', error);
        }
    }, []);

    useEffect(() => {
        refreshConfig().catch(console.error);
    }, [refreshConfig]);

    return (
        <ConfigContext.Provider value={{config, isReady, refreshConfig, saveConfig}}>
            {children}
        </ConfigContext.Provider>
    );
};
