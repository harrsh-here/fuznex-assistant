import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../api/api';

export default function AuthSuccess({ onAuth }) {
  const nav = useNavigate();
  const { search } = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(search);
    const accessToken = params.get('accessToken');
    const refreshToken = params.get('refreshToken');

    if (!accessToken) {
      return nav('/login?error=oauth');
    }

    // Store tokens
    localStorage.setItem('token', accessToken);
    localStorage.setItem('refreshToken', refreshToken);

    // Fetch user profile to complete login
    api.get('/users/profile')
      .then(({ data }) => {
        onAuth(data);
        nav('/', { replace: true }); // redirect to home
      })
      .catch(() => {
        nav('/login?error=auth');
      });
  }, [search, nav, onAuth]);

  return <div className="text-white p-4">Logging you in…</div>;
}
