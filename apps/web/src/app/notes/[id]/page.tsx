"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button, message } from 'antd';

// 定义Note的数据类型
interface Note {
    id: number;
    title: string;
    content: string | null;
}

export default function NoteDetailPage() {
    const [note, setNote] = useState<Note | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [messageApi, contextHolder] = message.useMessage();

    const router = useRouter();
    const params = useParams();
    const { id } = params;

    // 1. 组件加载时，获取笔记数据
    useEffect(() => {
        if (id) {
            fetch(`http://localhost:3000/notes/${id}`)
                .then(res => res.json())
                .then(data => {
                    setNote(data);
                    setTitle(data.title);
                    setContent(data.content || '');
                });
        }
    }, [id]);

    // 2. 处理保存（更新）逻辑
    const handleSave = async () => {
        try {
            const res = await fetch(`http://localhost:3000/notes/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content }),
            });
            if (!res.ok) throw new Error('Failed to update note');
            const updatedNote = await res.json();
            setNote(updatedNote); // 更新页面数据
            messageApi.success('笔记保存成功');
            setIsEditing(false); // 切换回查看模式
        } catch (error) {
            console.error(error);
            messageApi.error('保存笔记时出错');
        }
    };

    // 3. 处理删除逻辑
    const handleDelete = async () => {
        // 弹出确认对话框
        if (window.confirm('你确定要删除这个笔记吗？')) {
            try {
                const res = await fetch(`http://localhost:3000/notes/${id}`, {
                    method: 'DELETE',
                });
                if (!res.ok) throw new Error('删除笔记失败');
                messageApi.success('笔记删除成功');
                router.push('/'); // 删除成功后返回主页
            } catch (error) {
                console.error(error);
                messageApi.error('删除笔记时出错');
            }
        }
    };

    if (!note) {
        return <div>加载中...</div>;
    }

    return (
        <div className="max-w-3xl mx-auto p-8">
        {contextHolder}
            {isEditing ? (
                // --- 编辑模式 ---
                <div className="space-y-4">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full text-4xl font-bold bg-transparent focus:outline-none dark:text-white"
                    />
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={15}
                        className="w-full text-lg leading-relaxed bg-transparent focus:outline-none dark:text-gray-300"
                    />
                </div>
            ) : (
                // --- 查看模式 ---
                <div className="space-y-4">
                    <h1 className="text-4xl font-bold dark:text-white">{note.title}</h1>
                    <p className="text-lg leading-relaxed dark:text-gray-300 whitespace-pre-wrap">
                        {note.content}
                    </p>
                </div>
            )}

            {/* --- 操作按钮 --- */}
            <div className="mt-8 space-x-4">
                {isEditing ? (
                    <Button type="primary" onClick={handleSave}>
                        保存
                    </Button>
                ) : (
                    <Button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        编辑
                    </Button>
                )}
                <Button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                    删除
                </Button>
                <Button onClick={() => router.push('/')} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                    返回列表
                </Button>
            </div>
        </div>
    );
}