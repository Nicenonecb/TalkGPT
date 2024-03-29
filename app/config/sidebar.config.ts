import {lsGetItem, lsSetItem} from "@/app/api/storage";

export type Session = {
    id: number,
    locale: string,
    subject: string,
    context?: any[],
    details?: string
    favorite?: string[]
}

export const sessionStorageService = {
    getSessionList: (): Session[] => {
        const sessionList = lsGetItem<Session[]>('sessionList', []);
        return sessionList ?? [];
    },
    saveSession: (session: Session): void => {
        const sessionList = sessionStorageService.getSessionList();
        if (Array.isArray(sessionList)) {
            session.id = sessionList.length + 1;
            sessionList?.push(session);
            lsSetItem('sessionList', sessionList);
        }
    },
    getSessionById: (id: number): Session | undefined => {
        const sessionList = sessionStorageService.getSessionList();
        return sessionList.find(session => session.id === id);
    }
};
