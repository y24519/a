import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';

function FindUserPage() {
  const [users, setUsers] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchType, setSearchType] = useState('name'); // name or day

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCol = collection(db, 'mydata');
      const userSnapshot = await getDocs(usersCol);
      const userList = userSnapshot.docs.map(doc => {
        const data = doc.data();
        const dayStr = data.day?.toDate().toISOString().split('T')[0]; // "2024-06-16" 形式
        return {
          id: doc.id,
          ...data,
          dayStr: dayStr || ''
        };
      });
      setUsers(userList);
      setFilteredUsers(userList);
    };

    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    const kw = e.target.value;
    setKeyword(kw);

    const filtered = users.filter(user => {
      if (searchType === 'name') {
        return user.name?.toLowerCase().includes(kw.toLowerCase());
      } else if (searchType === 'day') {
        return user.dayStr.includes(kw); // "2024-06-16" 形式と一致
      }
      return false;
    });

    setFilteredUsers(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">タスク検索ページ</h2>

      {/* 検索モード選択 */}
      <div className="max-w-md mx-auto mb-4 flex gap-4 justify-center">
        <label>
          <input
            type="radio"
            value="task"
            checked={searchType === 'task'}
            onChange={() => setSearchType('task')}
          />
          <span className="ml-1">タスクで検索</span>
        </label>
        <label>
          <input
            type="radio"
            value="day"
            checked={searchType === 'day'}
            onChange={() => setSearchType('day')}
          />
          <span className="ml-1">日付で検索</span>
        </label>
      </div>

      {/* 検索ボックス */}
      <div className="max-w-md mx-auto mb-6">
        <input
          type={searchType === 'day' ? 'date' : 'text'}
          placeholder={searchType === 'day' ? '日付を選択' : 'タスクで検索'}
          value={keyword}
          onChange={handleSearch}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* 検索結果テーブル */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 table-fixed border-separate border-spacing-0">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 w-1/4">task</th>
              <th className="border border-gray-300 px-4 py-2 w-1/4">Do</th>
              <th className="border border-gray-300 px-4 py-2 w-1/4">Day</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td className="border border-gray-300 px-4 py-2">{user.task}</td>
                <td className="border border-gray-300 px-4 py-2">{user.dou ? '実行中' : '実行済'}</td>
                <td className="border border-gray-300 px-4 py-2">{user.dayStr}</td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center text-gray-600 p-4 border border-gray-300">
                  該当するタスクが見つかりません。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FindUserPage;
