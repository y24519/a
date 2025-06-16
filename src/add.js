// src/add.js
import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase';
import { useNavigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import {Timestamp} from "firebase/firestore";

function AddUser() {
  const [day, setDay] = useState('');
  const [task, setTask] = useState('');
  const [dou, setDo] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, 'mydata'), {
        day: Timestamp.fromDate(new Date(day)),
        task,
        dou,
      });
      alert('ユーザーを追加しました');
      navigate('/');
    } catch (error) {
      alert('追加に失敗しました: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen p-6 text-center">
      
      <h1 className="text-2xl font-bold mb-6">ユーザー追加</h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto border border-gray-300 rounded p-6 space-y-4"
      >

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">日付</label>
          <input
            type="date"
            value={day}
            onChange={(e) => setDay(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">タスク</label>
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>


        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">実行</label>
          <select
            value={dou}
            onChange={(e) => setDo(e.target.value === 'true')}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="true">実行中</option>
            <option value="false">実行済</option>
          </select>
        </div>

        <div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
          >
            ユーザーを追加
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddUser;
