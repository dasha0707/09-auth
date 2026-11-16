import type { Metadata } from 'next';
import { ogImage, siteUrl } from '@/lib/seo';
import css from './not-found.module.css';

export const metadata: Metadata = {
  title: '404 - Page not found | NoteHub',
  description: 'The requested page could not be found on NoteHub.',
  openGraph: {
    title: '404 - Page not found | NoteHub',
    description: 'The requested page could not be found on NoteHub.',
    url: `${siteUrl}/404`,
    images: [ogImage],
  },
};

export default function NotFound() {
  return (
    <main className={css.container}>
      <h1 className={css.title}>404 - Page not found</h1>
      <p className={css.description}>
        Sorry, the page you are looking for does not exist.
      </p>
    </main>
  );
}
