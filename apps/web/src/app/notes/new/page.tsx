"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // 使用App Router的useRouter
import { Button, message } from 'antd';

export default function NewNotePage() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [messageApi, contextHolder] = message.useMessage();
    const router = useRouter(); // 获取router实例以便于页面跳转

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // 阻止表单默认的刷新行为

        try {
            const res = await fetch('http://localhost:3000/notes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, content }),
            });

            if (!res.ok) {
                throw new Error('Failed to create note');
            }

            message.success('笔记创建成功');

            // 创建成功后，跳转回主页
            router.push('/');
        } catch (error) {
            console.error(error);
            messageApi.error('Error creating note!');
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-8">
            {contextHolder}
            <h1 className="text-3xl font-bold mb-6">新建一个笔记</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        标题
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        内容
                    </label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={10}
                        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <div>
                    <Button
                        type="primary"
                        size="large"
                        onClick={handleSubmit}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        创建笔记
                    </Button>
                </div>
            </form>
        </div>
    );
}