import { api } from './api';
import type { NewNote, Note, NoteTag } from '@/types/note';
import type { User } from '@/types/user';

export interface FetchNotesResponse { notes: Note[]; totalPages: number }
export interface FetchNotesParams { page?: number; perPage?: number; search?: string; tag?: NoteTag }
interface AuthCredentials { email: string; password: string }
export interface SessionResponse { success: boolean }

export async function fetchNotes({ page = 1, search = '', tag }: FetchNotesParams = {}): Promise<FetchNotesResponse> {
  const res = await api.get<FetchNotesResponse>('/notes', {
    params: { page, ...(search && { search }), ...(tag && { tag }) },
  });
  return res.data;
}
export async function fetchNoteById(id: string): Promise<Note> {
  const res = await api.get<Note>(`/notes/${id}`);
  return res.data;
}
export async function createNote(note: NewNote): Promise<Note> {
  const res = await api.post<Note>('/notes', note);
  return res.data;
}
export async function deleteNote(id: string): Promise<Note> {
  const res = await api.delete<Note>(`/notes/${id}`);
  return res.data;
}
export async function register(credentials: AuthCredentials): Promise<User> {
  const res = await api.post<User>('/auth/register', credentials);
  return res.data;
}
export async function login(credentials: AuthCredentials): Promise<User> {
  const res = await api.post<User>('/auth/login', credentials);
  return res.data;
}
export async function logout(): Promise<void> {
  await api.post('/auth/logout');
}
export async function checkSession(): Promise<SessionResponse> {
  const res = await api.get<SessionResponse>('/auth/session');
  return res.data;
}
export async function getMe(): Promise<User> {
  const res = await api.get<User>('/users/me');
  return res.data;
}
export async function updateMe(data: Pick<User, 'username'>): Promise<User> {
  const res = await api.patch<User>('/users/me', data);
  return res.data;
}
