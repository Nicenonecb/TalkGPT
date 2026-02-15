'use client'

import {useCallback, useEffect, useState} from 'react';
import {Button, Empty, Input, message} from 'antd';
import {vocabularyStorageService, VocabularyItem} from '@/app/config/learning.config';

const formatTime = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString();
};

export default function VocabularyPage() {
    const [list, setList] = useState<VocabularyItem[]>([]);
    const [word, setWord] = useState('');
    const [note, setNote] = useState('');
    const [source, setSource] = useState('');

    // 每次操作后重新读取列表，避免本地状态与存储不同步
    const refreshList = useCallback(async () => {
        try {
            const nextList = await vocabularyStorageService.getVocabularyList();
            setList(nextList);
        } catch (error) {
            console.error('读取生词本失败:', error);
        }
    }, []);

    useEffect(() => {
        refreshList().catch(console.error);
    }, [refreshList]);

    const resetForm = () => {
        setWord('');
        setNote('');
        setSource('');
    };

    const handleAdd = async () => {
        const trimmedWord = word.trim();
        if (!trimmedWord) {
            message.warning('请输入生词');
            return;
        }
        try {
            await vocabularyStorageService.addVocabularyItem({
                word: trimmedWord,
                note: note.trim() || undefined,
                source: source.trim() || undefined,
            });
            message.success('已加入生词本');
            resetForm();
            await refreshList();
        } catch (error) {
            console.error('保存生词失败:', error);
            message.error('保存失败，请稍后重试');
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await vocabularyStorageService.deleteVocabularyItem(id);
            message.success('已删除');
            await refreshList();
        } catch (error) {
            console.error('删除生词失败:', error);
            message.error('删除失败，请稍后重试');
        }
    };

    return (
        <div className="bg-slate-900 min-h-screen w-full p-6 text-white">
            <div className="flex items-center justify-between mb-6">
                <div className="text-2xl font-semibold">生词本</div>
                <div className="text-sm text-slate-400">共 {list.length} 个</div>
            </div>

            <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-4 mb-6">
                <div className="flex flex-col gap-3">
                    <Input
                        placeholder="输入生词"
                        value={word}
                        onChange={(event) => setWord(event.target.value)}
                        onPressEnter={() => handleAdd().catch(console.error)}
                    />
                    <Input.TextArea
                        placeholder="备注/释义（可选）"
                        value={note}
                        onChange={(event) => setNote(event.target.value)}
                        rows={3}
                    />
                    <Input.TextArea
                        placeholder="来源句子（可选）"
                        value={source}
                        onChange={(event) => setSource(event.target.value)}
                        rows={3}
                    />
                    <div>
                        <Button type="primary" onClick={() => handleAdd().catch(console.error)}>
                            加入生词本
                        </Button>
                    </div>
                </div>
            </div>

            {list.length === 0 ? (
                <Empty description="暂无生词" />
            ) : (
                <div className="space-y-3">
                    {list.map((item) => (
                        <div key={item.id} className="border border-slate-700 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div className="text-lg font-semibold">{item.word}</div>
                                <Button size="small" danger onClick={() => handleDelete(item.id).catch(console.error)}>
                                    删除
                                </Button>
                            </div>
                            {item.note && (
                                <div className="text-sm text-slate-300 mt-2 whitespace-pre-line">
                                    {item.note}
                                </div>
                            )}
                            {item.source && (
                                <div className="text-xs text-slate-400 mt-2">来源：{item.source}</div>
                            )}
                            <div className="text-xs text-slate-500 mt-2">{formatTime(item.createdAt)}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
