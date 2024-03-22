// storage.ts

export const lsSetItem = <T>(key: string, value: T): void => {
    localStorage.setItem(key, JSON.stringify(value));
};


export const lsGetItem = <T>(key: string, defaultValue: T): T | null => {
    if (typeof localStorage !== 'undefined') {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    }
    return defaultValue
};


export const lsRemoveItem = (key: string): void => {
    localStorage.removeItem(key);
};
