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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
    // Rafraîchir toutes les 5 secondes
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      setError('');
      const challengeSnapshot = await getDocs(collection(db, 'challenges'));
      const challengeData = challengeSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as Challenge))
        .filter(c => c.active);
      setChallenges(challengeData);

      const userSnapshot = await getDocs(collection(db, 'users'));
      const userData = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
      setUsers(userData.sort((a, b) => (b.score || 0) - (a.score || 0)));
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-5 py-10">
      <div className="bg-white rounded-3xl p-12 shadow-2xl max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900">
            🏆 <span className="bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">Scoreboard</span>
          </h1>
          <button
            onClick={loadData}
            className="px-6 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition font-bold text-lg"
          >
            🔄 Rafraîchir
          </button>
        </div>

        {error && (
          <div className="mb-8 p-6 bg-red-100 text-red-800 rounded-xl text-lg font-semibold">
            ⚠️ {error}
          </div>
        )}

        {loading && (
          <div className="text-center py-12 text-2xl text-gray-600 font-semibold">
            ⏳ Chargement...
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Top Players */}
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-900">🥇 Top Players</h2>
              {users.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-xl">
                  Aucun joueur pour le moment...
                </div>
              ) : (
                <div className="space-y-4">
                  {users.map((user, index) => (
                    <div key={user.id} className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border-2 border-purple-100 hover:border-purple-300 transition">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-gray-900 text-lg">
                          {index === 0 && '🥇'} {index === 1 && '🥈'} {index === 2 && '🥉'} {index > 2 && '🔹'}
                          {' '}{user.name}
                        </span>
                        <span className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-2 rounded-full font-bold text-lg">
                          {user.score || 0} pts
                        </span>
                      </div>
                      <p className="text-gray-600 text-base">{user.email}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Active Challenges */}
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-900">⚡ Challenges Actifs</h2>
              {challenges.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-xl">
                  Aucun challenge actif...
                </div>
              ) : (
                <div className="space-y-4">
                  {challenges.map((challenge) => (
                    <div key={challenge.id} className="bg-blue-50 p-6 rounded-2xl border-l-4 border-blue-500 hover:bg-blue-100 transition">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-900 text-lg">{challenge.name}</span>
                        <span className="bg-blue-500 text-white px-6 py-2 rounded-full text-lg font-bold">
                          {challenge.points} pts
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <Link href="/" className="block text-center mt-12 text-purple-600 hover:text-purple-700 font-bold text-lg">
          ← Retour
        </Link>
      </div>
    </div>
  );
}
