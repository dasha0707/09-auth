'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { isAxiosError } from 'axios';
import { login } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import css from './SignIn.module.css';

export default function SignInPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    const data = new FormData(event.currentTarget);
    const email = String(data.get('email') ?? '').trim();
    const password = String(data.get('password') ?? '');
    setLoading(true);
    try {
      const user = await login({ email, password });
      setUser(user);
      router.replace('/profile');
      router.refresh();
    } catch (err) {
      setError(isAxiosError(err)
        ? (err.response?.data?.response?.message ?? err.response?.data?.error ?? 'Login failed')
        : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={css.mainContent}>
      <form className={css.form} onSubmit={onSubmit}>
        <h1 className={css.formTitle}>Sign in</h1>
        <div className={css.formGroup}>
          <label htmlFor="signin-email">Email</label>
          <input id="signin-email" type="email" name="email" className={css.input} required />
        </div>
        <div className={css.formGroup}>
          <label htmlFor="signin-password">Password</label>
          <input id="signin-password" type="password" name="password" className={css.input} required />
        </div>
        <div className={css.actions}>
          <button type="submit" className={css.submitButton} disabled={loading}>
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </div>
        {error && <p className={css.error} role="alert">{error}</p>}
      </form>
    </main>
  );
}
