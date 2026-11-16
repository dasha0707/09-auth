'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { isAxiosError } from 'axios';
import { register } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import css from './SignUp.module.css';

export default function SignUpPage() {
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
      const user = await register({ email, password });
      setUser(user);
      router.replace('/profile');
      router.refresh();
    } catch (err) {
      setError(isAxiosError(err)
        ? (err.response?.data?.response?.message ?? err.response?.data?.error ?? 'Registration failed')
        : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={css.mainContent}>
      <h1 className={css.formTitle}>Sign up</h1>
      <form className={css.form} onSubmit={onSubmit}>
        <div className={css.formGroup}>
          <label htmlFor="signup-email">Email</label>
          <input id="signup-email" type="email" name="email" className={css.input} required />
        </div>
        <div className={css.formGroup}>
          <label htmlFor="signup-password">Password</label>
          <input id="signup-password" type="password" name="password" minLength={6} className={css.input} required />
        </div>
        <div className={css.actions}>
          <button type="submit" className={css.submitButton} disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </div>
        {error && <p className={css.error} role="alert">{error}</p>}
      </form>
    </main>
  );
}
