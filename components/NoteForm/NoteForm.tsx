'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { createNote } from '@/lib/api';
import { useNoteStore } from '@/lib/store/noteStore';
import type { NewNote, NoteTag } from '@/types/note';
import css from './NoteForm.module.css';

const tags: NoteTag[] = ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'];

export default function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const draft = useNoteStore((state) => state.draft);
  const setDraft = useNoteStore((state) => state.setDraft);
  const clearDraft = useNoteStore((state) => state.clearDraft);

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: async () => {
      clearDraft();
      await queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast.success('Note created!');
      router.push('/notes/filter/all');
    },
    onError: () => {
      toast.error('Could not create the note. Please try again.');
    },
  });

  const formAction = async (formData: FormData) => {
    const title = String(formData.get('title') ?? '').trim();
    const content = String(formData.get('content') ?? '');
    const submittedTag = String(formData.get('tag') ?? 'Todo');
    const tag: NoteTag = tags.includes(submittedTag as NoteTag)
      ? (submittedTag as NoteTag)
      : 'Todo';

    if (title.length < 3 || title.length > 50 || content.length > 500) {
      toast.error('Title must be 3–50 characters; content must be at most 500.');
      return;
    }

    const note: NewNote = { title, content, tag };
    try {
      await createMutation.mutateAsync(note);
    } catch {
      // onError shows the message; the saved draft is kept for retrying.
    }
  };

  return (
    <>
      <form action={formAction} className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            name="title"
            minLength={3}
            maxLength={50}
            required
            defaultValue={draft.title}
            className={css.input}
            onChange={(event) =>
              setDraft({ ...useNoteStore.getState().draft, title: event.currentTarget.value })
            }
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            rows={8}
            maxLength={500}
            defaultValue={draft.content}
            className={css.textarea}
            onChange={(event) =>
              setDraft({ ...useNoteStore.getState().draft, content: event.currentTarget.value })
            }
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="tag">Tag</label>
          <select
            id="tag"
            name="tag"
            defaultValue={draft.tag}
            className={css.select}
            onChange={(event) =>
              setDraft({
                ...useNoteStore.getState().draft,
                tag: event.currentTarget.value as NoteTag,
              })
            }
          >
            {tags.map((tag) => (
              <option value={tag} key={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>

        <div className={css.actions}>
          <button
            type="button"
            className={css.cancelButton}
            onClick={() => router.back()}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={css.submitButton}
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? 'Creating...' : 'Create note'}
          </button>
        </div>
      </form>
      <Toaster position="top-right" />
    </>
  );
}
