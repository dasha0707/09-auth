'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';
import Modal from '@/components/Modal/Modal';
import css from './NotePreview.module.css';

export default function NotePreviewClient({ id }: { id: string }) {
  const router = useRouter();
  const { data: note, isPending, isError } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  return (
    <Modal onClose={() => router.back()} ariaLabel="Note details">
      <div className={css.container}>
        <button
          type="button"
          className={css.closeButton}
          onClick={() => router.back()}
          aria-label="Close note details"
        >
          ×
        </button>
        {isPending && <p>Loading note...</p>}
        {isError && <p role="alert">Could not load the note.</p>}
        {note && (
          <article className={css.item}>
            <div className={css.header}>
              <h2>{note.title}</h2>
            </div>
            <p className={css.tag}>{note.tag}</p>
            <p className={css.content}>{note.content}</p>
            <p className={css.date}>{note.createdAt}</p>
          </article>
        )}
      </div>
    </Modal>
  );
}
