import { cookies } from 'next/headers';
import type { AxiosResponse } from 'axios';
import { api } from './api';
import type { Note, NoteTag } from '@/types/note';
import type { User } from '@/types/user';

export interface FetchNotesResponse { notes: Note[]; totalPages: number }
export interface FetchNotesParams { page?: number; perPage?: number; search?: string; tag?: NoteTag }
export interface SessionResponse { success?: boolean; email?: string; username?: string; avatar?: string }

async function cookieHeader(): Promise<string> {
  return (await cookies()).toString();
}

export async function fetchNotes({ page = 1, search = '', tag }: FetchNotesParams = {}): Promise<FetchNotesResponse> {
  const res = await api.get<FetchNotesResponse>('/notes', {
    params: { page, ...(search && { search }), ...(tag && { tag }) },
    headers: { Cookie: await cookieHeader() },
  });
  return res.data;
}
export async function fetchNoteById(id: string): Promise<Note> {
  const res = await api.get<Note>(`/notes/${id}`, {
    headers: { Cookie: await cookieHeader() },
  });
  return res.data;
}
export async function getMe(): Promise<User> {
  const res = await api.get<User>('/users/me', {
    headers: { Cookie: await cookieHeader() },
  });
  return res.data;
}
export async function checkSession(rawCookie?: string): Promise<AxiosResponse<SessionResponse>> {
  const cookieString = rawCookie ?? await cookieHeader();
  return api.get<SessionResponse>('/auth/session', {
    headers: { Cookie: cookieString },
  });
}
