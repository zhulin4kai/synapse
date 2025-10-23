import Link from 'next/link';
import '@ant-design/v5-patch-for-react-19';

interface Note {
  id: number;
  title: string;
  content: string | null;
  createdAt: string;
  updatedAt: string;
}

async function getNotes(): Promise<Note[]> {
  try {
    const res = await fetch('http://localhost:3000/notes', {
      cache: 'no-store', // 开发阶段不缓存，确保看到最新数据
    });
    if (!res.ok) {
      throw new Error('Failed to fetch notes');
    }
    return res.json();
  } catch (error) {
    console.error(error);
    return []; // 出错时返回空数组
  }
}

export default async function HomePage() {
  const notes = await getNotes();

  return (
    <div className="max-w-4xl mx-auto p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Synapse Notes</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          你的第二大脑
        </p>
        <Link href="/notes/new" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          新建笔记
        </Link>
      </header>

      <main>
        {notes.length > 0 ? (
          <ul className="space-y-4">
            {notes.map((note) => (
              <Link href={`/notes/${note.id}`} key={note.id}>
                <li className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">{note.title}</h2>
                  <p className="text-gray-700 dark:text-gray-300 mt-2 truncate">
                    {note.content || 'No content'}
                  </p>
                  <small className="text-gray-500 mt-2 block">
                    最后一次更新: {new Date(note.updatedAt).toISOString().slice(0, 10).replace('T', ' ').slice(0, 19)}
                  </small>
                </li>
              </Link>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">
            没有笔记，你可以创建一个!
          </p>
        )}
      </main>
    </div>
  );
}