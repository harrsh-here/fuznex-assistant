// src/pages/AuthSuccess.jsx
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../api/api';

export default function AuthSuccess({ onAuth }) {
  const nav = useNavigate();
  const { search } = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(search);
    const accessToken  = params.get('accessToken');
    const refreshToken = params.get('refreshToken');

    if (!accessToken) {
      return nav('/login?error=oauth');
    }

    // store tokens
    localStorage.setItem('token', accessToken);
    localStorage.setItem('refreshToken', refreshToken);

    // fetch user profile from backend
    api.get('/users/profile')
      .then(({ data }) => {
        onAuth(data);
        nav('/', { replace: true });
      })
      .catch(() => {
        nav('/login?error=auth');
      });
  }, [search, nav, onAuth]);

  return <div className="p-4 text-center text-white">Logging you in…</div>;
}
