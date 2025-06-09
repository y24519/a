// src/delete.js
import { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebase';
import {Timestamp} from "firebase/firestore";

function DeleteUser() {
  const [users, setUsers] = useState([]);

  // Firestoreからユーザー一覧を取得
  const fetchUsers = async () => {
    const usersCol = collection(db, 'mydata');
    const userSnapshot = await getDocs(usersCol);
    const userList = userSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setUsers(userList);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ユーザー削除関数
  const deleteUser = async (id) => {
    const confirmDelete = window.confirm('本当に削除しますか？');
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, 'mydata', id));
      alert('削除しました');
      fetchUsers(); // 再取得
    } catch (error) {
      alert('削除に失敗しました: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">ユーザー削除ページ</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-left table-fixed border-separate border-spacing-0">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 w-1/5">day</th>
              <th className="border border-gray-300 px-4 py-2 w-1/5">Name</th>
              <th className="border border-gray-300 px-4 py-2 w-1/5">call</th>
              <th className="border border-gray-300 px-4 py-2 w-1/5">Dorm</th>
              <th className="border border-gray-300 px-4 py-2 w-1/5">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td className="border border-gray-300 px-4 py-2">
                  {user.day?.toDate ? user.day.toDate().toLocaleDateString() : '不明'}
                </td>
                <td className="border border-gray-300 px-4 py-2">{user.name}</td>
                <td className="border border-gray-300 px-4 py-2">{user.call}</td>
                <td className="border border-gray-300 px-4 py-2">{user.dorm ? '寮生' : '通学'}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                  >
                    削除
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center text-gray-600 p-4 border border-gray-300">
                  ユーザーが見つかりません。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DeleteUser;
