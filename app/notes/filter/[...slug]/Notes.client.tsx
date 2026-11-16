'use client';

import { useState } from 'react';
import Link from 'next/link';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import { Toaster } from 'react-hot-toast';
import type { NoteTag } from '@/types/note';
import { fetchNotes } from '@/lib/api';
import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import SearchBox from '@/components/SearchBox/SearchBox';
import css from './NotesPage.module.css';

const PER_PAGE = 12;

export default function NotesClient({ tag }: { tag?: NoteTag }) {
  return <NotesContent key={tag ?? 'all'} tag={tag} />;
}

function NotesContent({ tag }: { tag?: NoteTag }) {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  const updateSearch = useDebouncedCallback((value: string) => {
    setPage(1);
    setSearch(value.trim());
  }, 400);

  const { data, isPending, isError, error, isFetching } = useQuery({
    queryKey: ['notes', page, search, tag ?? 'all'],
    queryFn: () => fetchNotes({ page, perPage: PER_PAGE, search, tag }),
    placeholderData: keepPreviousData,
  });

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    updateSearch(value);
  };

  const handleDeletedLast = () => {
    if (page > 1) setPage((previousPage) => previousPage - 1);
  };

  return (
    <main className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchInput} onChange={handleSearchChange} />
        {data && data.totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={data.totalPages}
            onPageChange={setPage}
          />
        )}
        <Link className={css.button} href="/notes/action/create">
          Create note +
        </Link>
      </header>
      {isPending && <p>Loading notes...</p>}
      {isError && (
        <p role="alert">
          {error instanceof Error ? error.message : 'Failed to load notes.'}
        </p>
      )}
      {data && data.notes.length > 0 && (
        <NoteList notes={data.notes} onDeletedLast={handleDeletedLast} />
      )}
      {data && data.notes.length === 0 && <p>No notes found.</p>}
      {isFetching && !isPending && (
        <span aria-live="polite">Updating...</span>
      )}
      <Toaster position="top-right" />
    </main>
  );
}
