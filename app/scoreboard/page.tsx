'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

interface Challenge {
  id: string;
  name: string;
  points: number;
  active: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
  score: number;
}

export default function Scoreboard() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const challengeSnapshot = await getDocs(collection(db, 'challenges'));
      const challengeData = challengeSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as any))
        .filter(c => c.active);
      setChallenges(challengeData);

      const userSnapshot = await getDocs(collection(db, 'users'));
      const userData = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      setUsers(userData.sort((a, b) => b.score - a.score));
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <div className="min-h-screen p-5">
      <div className="bg-white rounded-2xl p-10 shadow-2xl max-w-6xl mx-auto">
        <h1 className="text-center mb-10 text-4xl font-bold text-gray-900">
          🏆 <span className="bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">Scoreboard</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Players */}
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">🥇 Top Players</h2>
            <div className="space-y-3">
              {users.map((user, index) => (
                <div key={user.id} className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">
                      {index === 0 && '🥇'} {index === 1 && '🥈'} {index === 2 && '🥉'} {index > 2 && '🔹'}
                      {' '}{user.name}
                    </span>
                    <span className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-1 rounded-full font-bold">
                      {user.score} pts
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{user.email}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Active Challenges */}
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">⚡ Challenges Actifs</h2>
            <div className="space-y-3">
              {challenges.map((challenge) => (
                <div key={challenge.id} className="bg-blue-50 p-4 rounded-xl border-l-4 border-blue-500">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">{challenge.name}</span>
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {challenge.points} pts
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Link href="/" className="block text-center mt-8 text-purple-600 hover:text-purple-700 font-semibold">
          ← Retour
        </Link>
      </div>
    </div>
  );
}
