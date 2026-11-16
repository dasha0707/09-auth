import type { Metadata } from 'next';
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';
import { ogImage, siteUrl } from '@/lib/seo';
import NoteDetailsClient from './NoteDetails.client';

interface NotePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: NotePageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const note = await fetchNoteById(id);
    const title = `${note.title} | NoteHub`;
    const description = note.content.trim().slice(0, 160) || `View ${note.title} on NoteHub.`;
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `${siteUrl}/notes/${encodeURIComponent(id)}`,
        images: [ogImage],
      },
    };
  } catch {
    const title = 'Note not found | NoteHub';
    const description = 'This note is unavailable.';
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `${siteUrl}/notes/${encodeURIComponent(id)}`,
        images: [ogImage],
      },
    };
  }
}

export default async function NotePage({ params }: NotePageProps) {
  const { id } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}
