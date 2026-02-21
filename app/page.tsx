'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedChallenge, setSelectedChallenge] = useState('');
  const [flag, setFlag] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ name, email, selectedChallenge, flag });
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-5">
      <div className="bg-white rounded-2xl p-10 shadow-2xl w-full max-w-2xl">
        <h1 className="text-center mb-8 text-4xl font-bold text-gray-900">
          CTF <span className="bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">Platform</span>
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-2 text-gray-700 font-semibold">Nom</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ton nom"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-700 font-semibold">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ton@email.com"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-700 font-semibold">Challenge</label>
            <select
              value={selectedChallenge}
              onChange={(e) => setSelectedChallenge(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500"
            >
              <option>Sélectionne un challenge</option>
              <option>Challenge 1</option>
              <option>Challenge 2</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-gray-700 font-semibold">Flag</label>
            <input
              type="text"
              value={flag}
              onChange={(e) => setFlag(e.target.value)}
              placeholder="CTF{...}"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold py-3 rounded-xl hover:opacity-90 transition"
          >
            Soumettre
          </button>
        </form>

        <div className="mt-8 flex gap-4 justify-center">
          <Link
            href="/scoreboard"
            className="px-6 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition font-semibold"
          >
            🏆 Scoreboard
          </Link>
          <Link
            href="/ifno"
            className="px-6 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition font-semibold"
          >
            ⚙️ Admin
          </Link>
        </div>
      </div>
    </div>
  );
}
