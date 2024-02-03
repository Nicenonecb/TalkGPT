export type SessionList = Session[]

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
        const sessionList = localStorage.getItem('sessionList');
        return sessionList ? JSON.parse(sessionList) : [];
    },
    saveSession: (session: Session): void => {
        const sessionList = sessionStorageService.getSessionList();
        session.id = sessionList.length + 1;
        sessionList.push(session);
        localStorage.setItem('sessionList', JSON.stringify(sessionList));
    }
};
