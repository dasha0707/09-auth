import type { Metadata } from 'next';
import NoteForm from '@/components/NoteForm/NoteForm';
import { ogImage, siteUrl } from '@/lib/seo';
import css from './page.module.css';

export const metadata: Metadata = {
  title: 'Create note | NoteHub',
  description: 'Create a new personal note in NoteHub.',
  openGraph: {
    title: 'Create note | NoteHub',
    description: 'Create a new personal note in NoteHub.',
    url: `${siteUrl}/notes/action/create`,
    images: [ogImage],
  },
};

export default function CreateNotePage() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm />
      </div>
    </main>
  );
}
