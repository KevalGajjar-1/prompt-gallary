// src/components/AdminLogin.tsx
"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, logout, isAdmin } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(password);
    if (!success) {
      setError('Incorrect password');
    } else {
      setError('');
    }
  };

  if (isAdmin) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-green-600">Admin Mode</span>
        <button
          onClick={logout}
          className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Admin password"
        className="px-3 py-1 text-sm border rounded input input-bordered"
      />
      <button
        type="submit"
        className="btn btn-neutral px-3 py-1 rounded hover:bg-blue-200 transition-colors"
      >
        Login
      </button>
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </form>
  );
}