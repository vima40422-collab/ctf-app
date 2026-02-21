'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { auth, db } from '@/lib/firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';

export default function Admin() {
  const [user, setUser] = useState<any>(null);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [email, setEmail] = useState('vima40422@gmail.com');
  const [password, setPassword] = useState('');
  const [challengeName, setChallengeName] = useState('');
  const [challengeFlag, setChallengeFlag] = useState('');
  const [challengePoints, setChallengePoints] = useState('10');

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && currentUser.email === 'vima40422@gmail.com') {
        setUser(currentUser);
        loadChallenges();
      }
    });
  }, []);

  const loadChallenges = async () => {
    const snapshot = await getDocs(collection(db, 'challenges'));
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setChallenges(data);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Erreur de connexion:', error);
    }
  };

  const handleLogout = () => {
    signOut(auth);
    setUser(null);
  };

  const hashFlag = async (flag: string) => {
    const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(flag));
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const handleCreateChallenge = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'challenges'), {
        name: challengeName,
        flagHash: await hashFlag(challengeFlag),
        points: parseInt(challengePoints),
        active: true
      });
      setChallengeName('');
      setChallengeFlag('');
      setChallengePoints('10');
      loadChallenges();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const toggleChallenge = async (id: string, active: boolean) => {
    try {
      await updateDoc(doc(db, 'challenges', id), { active: !active });
      loadChallenges();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const deleteChallenge = async (id: string) => {
    if (confirm('Supprimer ce challenge?')) {
      try {
        await deleteDoc(doc(db, 'challenges', id));
        loadChallenges();
      } catch (error) {
        console.error('Erreur:', error);
      }
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex justify-center items-center p-5">
        <div className="bg-white rounded-2xl p-10 shadow-2xl w-full max-w-md">
          <h1 className="text-center mb-8 text-4xl font-bold text-gray-900">
            Admin <span className="bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">Panel</span>
          </h1>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500"
              placeholder="Email"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500"
              placeholder="Mot de passe"
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold py-3 rounded-xl hover:opacity-90 transition"
            >
              Connexion
            </button>
          </form>

          <Link href="/" className="block text-center mt-4 text-purple-600 hover:text-purple-700">
            ← Retour
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-5">
      <div className="bg-white rounded-2xl p-10 shadow-2xl max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Admin <span className="bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">Panel</span>
          </h1>
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold"
          >
            Déconnexion
          </button>
        </div>

        <div className="mb-8 p-6 bg-gray-50 rounded-xl">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Nouveau Challenge</h2>
          <form onSubmit={handleCreateChallenge} className="space-y-4">
            <input
              type="text"
              value={challengeName}
              onChange={(e) => setChallengeName(e.target.value)}
              placeholder="Nom du challenge"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500"
              required
            />
            <input
              type="text"
              value={challengeFlag}
              onChange={(e) => setChallengeFlag(e.target.value)}
              placeholder="Flag"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500"
              required
            />
            <input
              type="number"
              value={challengePoints}
              onChange={(e) => setChallengePoints(e.target.value)}
              placeholder="Points"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500"
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold py-3 rounded-xl hover:opacity-90 transition"
            >
              Créer Challenge
            </button>
          </form>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Challenges</h2>
          <div className="space-y-3">
            {challenges.map((challenge) => (
              <div key={challenge.id} className="bg-gray-50 p-4 rounded-xl flex justify-between items-center">
                <span className="font-semibold">
                  {challenge.name} - {challenge.points}pts {challenge.active ? '✅' : '❌'}
                </span>
                <div className="space-x-2">
                  <button
                    onClick={() => toggleChallenge(challenge.id, challenge.active)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                  >
                    Toggle
                  </button>
                  <button
                    onClick={() => deleteChallenge(challenge.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Link href="/" className="block text-center mt-8 text-purple-600 hover:text-purple-700 font-semibold">
          ← Retour
        </Link>
      </div>
    </div>
  );
}
