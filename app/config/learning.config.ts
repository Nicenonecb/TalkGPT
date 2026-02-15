import {deleteItem, getAllItems, putItem} from "@/app/api/indexeddb";

type MessageRole = 'tutor' | 'stu';

export type VocabularyItem = {
    id: string;
    word: string;
    note?: string;
    source?: string;
    locale?: string;
    sessionId?: number;
    createdAt: number;
    normalizedWord: string;
};

export type FavoriteSentence = {
    id: string;
    content: string;
    locale?: string;
    sessionId?: number;
    role?: MessageRole;
    createdAt: number;
    normalizedContent: string;
};

const generateId = (): string => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const normalizeWord = (word: string): string => word.trim().toLowerCase();
const normalizeSentence = (content: string): string => content.trim();

export const vocabularyStorageService = {
    getVocabularyList: async (): Promise<VocabularyItem[]> => {
        const list = await getAllItems<VocabularyItem>('vocabulary');
        return list.sort((a, b) => b.createdAt - a.createdAt);
    },
    addVocabularyItem: async (payload: Omit<VocabularyItem, 'id' | 'createdAt' | 'normalizedWord'>): Promise<VocabularyItem> => {
        const normalizedWord = normalizeWord(payload.word);
        if (!normalizedWord) {
            throw new Error('生词不能为空');
        }
        // 通过规范化字段避免重复收录
        const list = await getAllItems<VocabularyItem>('vocabulary');
        const existing = list.find((item) => item.normalizedWord === normalizedWord);
        if (existing) {
            return existing;
        }
        const nextItem: VocabularyItem = {
            ...payload,
            id: generateId(),
            normalizedWord,
            createdAt: Date.now(),
        };
        await putItem('vocabulary', nextItem);
        return nextItem;
    },
    deleteVocabularyItem: async (id: string): Promise<void> => {
        await deleteItem('vocabulary', id);
    },
};

export const favoriteSentenceStorageService = {
    getSentenceList: async (): Promise<FavoriteSentence[]> => {
        const list = await getAllItems<FavoriteSentence>('favoriteSentences');
        return list.sort((a, b) => b.createdAt - a.createdAt);
    },
    addSentence: async (payload: Omit<FavoriteSentence, 'id' | 'createdAt' | 'normalizedContent'>): Promise<FavoriteSentence> => {
        const normalizedContent = normalizeSentence(payload.content);
        if (!normalizedContent) {
            throw new Error('句子内容不能为空');
        }
        // 使用规范化句子去重，避免重复收藏
        const list = await getAllItems<FavoriteSentence>('favoriteSentences');
        const existing = list.find((item) => item.normalizedContent === normalizedContent);
        if (existing) {
            return existing;
        }
        const nextItem: FavoriteSentence = {
            ...payload,
            id: generateId(),
            normalizedContent,
            createdAt: Date.now(),
        };
        await putItem('favoriteSentences', nextItem);
        return nextItem;
    },
    deleteSentenceById: async (id: string): Promise<void> => {
        await deleteItem('favoriteSentences', id);
    },
    deleteSentenceByContent: async (content: string): Promise<void> => {
        const normalizedContent = normalizeSentence(content);
        const list = await getAllItems<FavoriteSentence>('favoriteSentences');
        const target = list.find((item) => item.normalizedContent === normalizedContent);
        if (target) {
            await deleteItem('favoriteSentences', target.id);
        }
    },
};
