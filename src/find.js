// src/find.js
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import Navigation from './components/Navigation';

function FindUserPage() {
  const [users, setUsers] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCol = collection(db, 'mydata');
      const userSnapshot = await getDocs(usersCol);
      const userList = userSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(userList);
      setFilteredUsers(userList);
    };

    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    const kw = e.target.value;
    setKeyword(kw);

    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(kw.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      
      <h2 className="text-2xl font-bold mb-4 text-center">ユーザー検索ページ</h2>

      <div className="max-w-md mx-auto mb-6">
        <input
          type="text"
          placeholder="名前で検索"
          value={keyword}
          onChange={handleSearch}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 table-fixed border-separate border-spacing-0">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 w-1/3">Name</th>
              <th className="border border-gray-300 px-4 py-2 w-1/3">Mail</th>
              <th className="border border-gray-300 px-4 py-2 w-1/3">Dorm</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td className="border border-gray-300 px-4 py-2">{user.name}</td>
                <td className="border border-gray-300 px-4 py-2">{user.mail}</td>
                <td className="border border-gray-300 px-4 py-2">{user.dorm ? '利用中' : '退出済'}</td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center text-gray-600 p-4 border border-gray-300">
                  該当するユーザーが見つかりません。
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
