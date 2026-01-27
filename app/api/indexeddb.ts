export type StoreName = 'sessions' | 'config';

const DB_NAME = 'talkgpt';
const DB_VERSION = 1;

const ensureIndexedDb = (): void => {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
        throw new Error('IndexedDB 不可用');
    }
};

const openDatabase = (): Promise<IDBDatabase> => {
    ensureIndexedDb();
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = () => {
            const db = request.result;
            // 首次创建或版本升级时初始化对象仓库
            if (!db.objectStoreNames.contains('sessions')) {
                db.createObjectStore('sessions', {keyPath: 'id'});
            }
            if (!db.objectStoreNames.contains('config')) {
                db.createObjectStore('config', {keyPath: 'key'});
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

const requestToPromise = <T>(request: IDBRequest<T>): Promise<T> => {
    return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

export const getItem = async <T>(storeName: StoreName, key: IDBValidKey): Promise<T | null> => {
    const db = await openDatabase();
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const result = await requestToPromise<T | undefined>(store.get(key));
    return result ?? null;
};

export const getAllItems = async <T>(storeName: StoreName): Promise<T[]> => {
    const db = await openDatabase();
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const result = await requestToPromise<T[]>(store.getAll());
    return Array.isArray(result) ? result : [];
};

export const putItem = async <T>(storeName: StoreName, value: T): Promise<void> => {
    const db = await openDatabase();
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    await requestToPromise(store.put(value));
};

export const deleteItem = async (storeName: StoreName, key: IDBValidKey): Promise<void> => {
    const db = await openDatabase();
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    await requestToPromise(store.delete(key));
};
