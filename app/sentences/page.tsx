'use client'

import {useCallback, useEffect, useState} from 'react';
import {Button, Empty, Input, message, Tag} from 'antd';
import {favoriteSentenceStorageService, FavoriteSentence} from '@/app/config/learning.config';

const formatTime = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString();
};

const roleTextMap: Record<string, string> = {
    tutor: '老师',
    stu: '学生',
};

export default function SentencesPage() {
    const [list, setList] = useState<FavoriteSentence[]>([]);
    const [content, setContent] = useState('');

    // 收藏列表独立维护，保证页面刷新后仍能看到完整记录
    const refreshList = useCallback(async () => {
        try {
            const nextList = await favoriteSentenceStorageService.getSentenceList();
            setList(nextList);
        } catch (error) {
            console.error('读取收藏句子失败:', error);
        }
    }, []);

    useEffect(() => {
        refreshList().catch(console.error);
    }, [refreshList]);

    const handleAdd = async () => {
        const trimmed = content.trim();
        if (!trimmed) {
            message.warning('请输入要收藏的句子');
            return;
        }
        try {
            await favoriteSentenceStorageService.addSentence({
                content: trimmed,
            });
            message.success('已收藏');
            setContent('');
            await refreshList();
        } catch (error) {
            console.error('收藏句子失败:', error);
            message.error('收藏失败，请稍后重试');
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await favoriteSentenceStorageService.deleteSentenceById(id);
            message.success('已删除');
            await refreshList();
        } catch (error) {
            console.error('删除收藏句子失败:', error);
            message.error('删除失败，请稍后重试');
        }
    };

    return (
        <div className="bg-slate-900 min-h-screen w-full p-6 text-white">
            <div className="flex items-center justify-between mb-6">
                <div className="text-2xl font-semibold">收藏句子</div>
                <div className="text-sm text-slate-400">共 {list.length} 条</div>
            </div>

            <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-4 mb-6">
                <div className="flex flex-col gap-3">
                    <Input.TextArea
                        placeholder="手动输入要收藏的句子"
                        value={content}
                        onChange={(event) => setContent(event.target.value)}
                        rows={3}
                    />
                    <div>
                        <Button type="primary" onClick={() => handleAdd().catch(console.error)}>
                            收藏句子
                        </Button>
                    </div>
                </div>
            </div>

            {list.length === 0 ? (
                <Empty description="暂无收藏句子" />
            ) : (
                <div className="space-y-3">
                    {list.map((item) => (
                        <div key={item.id} className="border border-slate-700 rounded-lg p-4">
                            <div className="flex items-center justify-between gap-3">
                                <div className="text-sm text-slate-300">{formatTime(item.createdAt)}</div>
                                <Button size="small" danger onClick={() => handleDelete(item.id).catch(console.error)}>
                                    删除
                                </Button>
                            </div>
                            <div className="mt-2 text-base whitespace-pre-line">{item.content}</div>
                            <div className="flex items-center gap-2 mt-3 text-xs text-slate-400">
                                {item.role && <Tag color="blue">{roleTextMap[item.role] ?? item.role}</Tag>}
                                {item.sessionId && <span>会话 {item.sessionId}</span>}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
