// Compatibility entry point for modules that still import this file.
// Server components should use lib/api/serverApi.ts instead.
export { fetchNotes, fetchNoteById, createNote, deleteNote } from './api/clientApi';
export type { FetchNotesParams, FetchNotesResponse } from './api/clientApi';
