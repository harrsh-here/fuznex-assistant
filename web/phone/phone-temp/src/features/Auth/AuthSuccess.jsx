// src/features/Auth/AuthSuccess.jsx
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../api/api';

export default function AuthSuccess({ onAuth }) {
  const nav = useNavigate();
  const { search } = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(search);
    const accessToken  = params.get('accessToken');
    const refreshToken = params.get('refreshToken');

    if (!accessToken || !refreshToken) {
      return nav('/login?error=oauth');
    }

    // store tokens
    localStorage.setItem('token', accessToken);
    localStorage.setItem('refreshToken', refreshToken);

    // remove query params from URL
    window.history.replaceState({}, document.title, window.location.pathname);

    // fetch profile and finish login
    api.get('/users/profile')
      .then(({ data }) => {
        onAuth(data);
        nav('/', { replace: true });
      })
      .catch(() => {
        nav('/login?error=auth');
      });
  }, [search, nav, onAuth]);

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="text-center">
        <p className="text-xl mb-2">Logging you in…</p>
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    </div>
  );
}
