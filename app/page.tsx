'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

interface Challenge {
  id: string;
  name: string;
  points: number;
  flagHash: string;
  active: boolean;
}

export default function Home() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedChallenge, setSelectedChallenge] = useState('');
  const [selectedChallengeObj, setSelectedChallengeObj] = useState<Challenge | null>(null);
  const [flag, setFlag] = useState('');
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [loading, setLoading] = useState(false);

  // Charger les challenges au démarrage
  useEffect(() => {
    loadChallenges();
  }, []);

  const loadChallenges = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'challenges'));
      const data = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as Challenge))
        .filter(c => c.active);
      setChallenges(data);
    } catch (error) {
      console.error('Erreur chargement challenges:', error);
    }
  };

  const hashFlag = async (flag: string) => {
    const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(flag));
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const handleChallengeChange = (challengeId: string) => {
    setSelectedChallenge(challengeId);
    const selected = challenges.find(c => c.id === challengeId);
    setSelectedChallengeObj(selected || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Validation
      if (!name || !email || !selectedChallenge || !flag) {
        setMessageType('error');
        setMessage('Remplis tous les champs!');
        setLoading(false);
        return;
      }

      // Vérifier le flag
      const flagHash = await hashFlag(flag);
      if (flagHash !== selectedChallengeObj?.flagHash) {
        setMessageType('error');
        setMessage('❌ Flag incorrect!');
        setFlag('');
        setLoading(false);
        return;
      }

      // Flag correct! Créer/mettre à jour l'utilisateur
      const userRef = doc(db, 'users', email);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        // Mettre à jour l'utilisateur existant
        const currentScore = userSnap.data().score || 0;
        await updateDoc(userRef, {
          score: currentScore + (selectedChallengeObj?.points || 0),
          lastUpdated: new Date().toISOString(),
        });
      } else {
        // Créer un nouvel utilisateur
        await setDoc(userRef, {
          name,
          email,
          score: selectedChallengeObj?.points || 0,
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
        });
      }

      setMessageType('success');
      setMessage(`✅ Bravo! +${selectedChallengeObj?.points} points!`);
      setFlag('');
      setSelectedChallenge('');
      setSelectedChallengeObj(null);

      // Réinitialiser le message après 3 secondes
      setTimeout(() => {
        setMessage('');
      }, 3000);
    } catch (error) {
      console.error('Erreur:', error);
      setMessageType('error');
      setMessage('Erreur lors de la soumission');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-5 py-20">
      <div className="bg-white rounded-3xl p-12 shadow-2xl w-full max-w-3xl">
        <h1 className="text-center mb-10 text-5xl font-bold text-gray-900">
          CTF <span className="bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">Platform</span>
        </h1>

        {message && (
          <div className={`mb-8 p-5 rounded-xl text-lg font-semibold text-center ${
            messageType === 'success'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-3 text-gray-700 font-bold text-lg">Nom</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ton nom"
              className="w-full px-5 py-4 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block mb-3 text-gray-700 font-bold text-lg">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ton@email.com"
              className="w-full px-5 py-4 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block mb-3 text-gray-700 font-bold text-lg">Challenge</label>
            <select
              value={selectedChallenge}
              onChange={(e) => handleChallengeChange(e.target.value)}
              className="w-full px-5 py-4 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500"
            >
              <option value="">Sélectionne un challenge</option>
              {challenges.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} - {c.points} pts
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-3 text-gray-700 font-bold text-lg">Flag</label>
            <input
              type="text"
              value={flag}
              onChange={(e) => setFlag(e.target.value)}
              placeholder="CTF{...}"
              className="w-full px-5 py-4 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold py-4 text-lg rounded-xl hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Vérification...' : 'Soumettre Flag'}
          </button>
        </form>

        <div className="mt-10 flex gap-4 justify-center">
          <Link
            href="/scoreboard"
            className="px-8 py-4 bg-purple-100 text-purple-700 rounded-xl hover:bg-purple-200 transition font-bold text-lg"
          >
            🏆 Scoreboard
          </Link>
          <Link
            href="/ifno"
            className="px-8 py-4 bg-purple-100 text-purple-700 rounded-xl hover:bg-purple-200 transition font-bold text-lg"
          >
            ⚙️ Admin
          </Link>
        </div>
      </div>
    </div>
  );
}
