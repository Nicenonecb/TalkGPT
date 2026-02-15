import {deleteItem, getAllItems, getItem, putItem} from "@/app/api/indexeddb";

export type Session = {
    id: number,
    locale: string,
    subject: string,
    context?: any[],
    details?: string,
    favorite?: string[]
    messages?: SessionMessage[],
    updatedAt?: number,
}

export type SessionMessage = {
    type: 'tutor' | 'stu';
    content: string;
    url?: string;
    isRealtime?: boolean;
    createdAt?: number;
};

export const sessionStorageService = {
    getSessionList: async (): Promise<Session[]> => {
        let sessionList = await getAllItems<Session>('sessions');
        if (sessionList.length === 0 && typeof localStorage !== 'undefined') {
            const legacyData = localStorage.getItem('sessionList');
            if (legacyData) {
                try {
                    const legacyList = JSON.parse(legacyData);
                    if (Array.isArray(legacyList)) {
                        for (const legacySession of legacyList) {
                            const migratedSession: Session = {
                                ...legacySession,
                                messages: legacySession.messages ?? [],
                                updatedAt: legacySession.updatedAt ?? Date.now(),
                            };
                            await putItem('sessions', migratedSession);
                        }
                        sessionList = await getAllItems<Session>('sessions');
                    }
                } catch (error) {
                    console.error('迁移会话数据失败:', error);
                }
            }
        }
        // 最近活跃的会话优先展示
        return sessionList
            .filter(Boolean)
            .sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0));
    },
    saveSession: async (session: Session): Promise<Session> => {
        const sessionList = await sessionStorageService.getSessionList();
        const maxId = sessionList.reduce((acc, item) => {
            const numericId = Number(item.id);
            return Number.isFinite(numericId) ? Math.max(acc, numericId) : acc;
        }, 0);
        const nextSession: Session = {
            ...session,
            id: maxId + 1,
            messages: session.messages ?? [],
            updatedAt: Date.now(),
        };
        await putItem('sessions', nextSession);
        return nextSession;
    },
    updateSession: async (session: Session): Promise<Session> => {
        const nextSession = {
            ...session,
            messages: session.messages ?? [],
            updatedAt: Date.now(),
        };
        await putItem('sessions', nextSession);
        return nextSession;
    },
    getSessionById: async (id: number): Promise<Session | null> => {
        return await getItem<Session>('sessions', id);
    },
    deleteSessionById: async (id: number): Promise<void> => {
        await deleteItem('sessions', id);
    },
};
