// src/App.js
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navigation from './components/Navigation';
import AddUser from './add';
import DeleteUser from './delete';
import FindUser from './find';
import Edit from './Edit';
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db,auth, provider } from './firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

function App() {
  const [user, setUser] = useState(null); // Firebaseユーザー
  const [dbUsers, setdbUsers] = useState([]); // Firesroreのデータ

useEffect(() => {
// Firestoreからusersコレクションを取得
const fetchUsers = async () => {
const usersCol = collection(db, 'mydata');
const userSnapshot = await getDocs(usersCol);
const userList = userSnapshot.docs.map(doc => ({
id: doc.id,
...doc.data()
}));
setdbUsers(userList);
};

// 認証状態を監視
const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
  setUser(currentUser);
 
  });
  fetchUsers();
  return () => unsubscribe();
  
    
  

}, []);

// Googleログイン処理
const handleLogin = async () => {
try {
await signInWithPopup(auth, provider);
} catch (error) {
console.error("ログインエラー :", error);
}
};
// ログアウト処理
const handleLogout = async () => {
try {
await signOut(auth);
} catch (error) {
console.error("ログアウトエラー :", error);
}
};

return (
  <Router>
<Navigation /> {/* ← ナビゲーションをここ䛻表示 */}

<div className="bg-gray-100 py-4 text-center text-2xl font-bold text-gray-800">
  施設利用管理
</div>

<div className="p-4 flex justify-end bg-gray-100">
 {user ? (
 <div>
 <span className="mr-4">こんにちは、 {user.displayName} さん</span>
 <button onClick={handleLogout} className="p-2 bg-red-500 text-white rounded">ログアウト </button>
 </div>
 ) : (
 <button onClick={handleLogin} className="p-2 bg-blue-500 text-white rounded">Googleでログイン </button>
 )}
 </div>


 
<Routes>
<Route path="/" element={ 
  <div className="overflow-x-auto">
  <table className="min-w-full border border-gray-300 text-left table-fixed border-separate border-spacing-0">
    <thead className="bg-gray-100">
      <tr>
        <th className="border border-gray-300 px-4 py-2 w-1/6">ID</th>
        <th className="border border-gray-300 px-4 py-2 w-1/6">day</th>
        <th className="border border-gray-300 px-4 py-2 w-1/6">Name</th>
        <th className="border border-gray-300 px-4 py-2 w-1/6">call</th>
        <th className="border border-gray-300 px-4 py-2 w-1/6">Dorm</th>
        <th className="border border-gray-300 px-4 py-2 w-1/6">edit</th>

      </tr>
    </thead>
    <tbody>
      {user ? (
        dbUsers.map(user => (
          <tr key={user.id}>
            <td className="border border-gray-300 px-4 py-2">{user.id}</td>
            <td className="border border-gray-300 px-4 py-2">
              {/* Timestamp を 日付文字列に変換 */}
              {user.day && user.day.toDate
              ? user.day.toDate().toLocaleDateString()
              : '未設定'}
           </td>
            <td className="border border-gray-300 px-4 py-2">{user.name}</td>
            <td className="border border-gray-300 px-4 py-2">{user.call}</td>
            <td className="border border-gray-300 px-4 py-2">{user.dorm ? "利用中" : "退出済"}</td>
            <td className="border border-gray-300 px-4 py-2">
                <Link
                  to={`/edit/${user.id}`}
                  className="text-blue-500 hover:underline"
                >
                  編集
                </Link>
</td>

          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={4} className="text-gray-600 p-4 text-center border border-gray-300">
            ログインするとデータが見られます。
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>

} />

    {user ? (
  <>
  <Route path="/add" element={<AddUser />} />
  <Route path="/delete" element={<DeleteUser />} />
  <Route path="/find" element={<FindUser />} />
  <Route path="/edit/:id" element={<Edit />} />
  </>
  ) : (
  <>
  <Route path="/add" element={<p>ログインしてください </p>} />
  <Route path="/delete" element={<p>ログインしてください </p>} />
  <Route path="/find" element={<p>ログインしてください </p>} />
  <Route path="/edit/:id" element={user ? <Edit /> : <p>ログインしてください</p>} />

  </>
  )}


  </Routes>
  </Router>
  );
  }
  export default App;