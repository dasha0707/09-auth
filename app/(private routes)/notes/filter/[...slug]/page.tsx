import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from '@tanstack/react-query';
import type { NoteTag } from '@/types/note';
import { fetchNotes } from '@/lib/api/serverApi';
import { ogImage, siteUrl } from '@/lib/seo';
import NotesClient from './Notes.client';

const tags: NoteTag[] = ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'];

interface NotesPageProps {
  params: Promise<{ slug: string[] }>;
}

function getTag(slug: string[]): NoteTag | undefined {
  if (slug.length !== 1) notFound();
  const selected = slug[0];
  if (selected === 'all') return undefined;
  if (!tags.includes(selected as NoteTag)) notFound();
  return selected as NoteTag;
}

export async function generateMetadata({
  params,
}: NotesPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = getTag(slug);
  const filterName = tag ?? 'All';
  const title = `${filterName} notes | NoteHub`;
  const description = tag
    ? `Browse and organize your ${tag.toLowerCase()} notes with NoteHub.`
    : 'Browse, search and organize all your notes with NoteHub.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${siteUrl}/notes/filter/${encodeURIComponent(slug[0])}`,
      images: [ogImage],
    },
  };
}

export default async function NotesPage({ params }: NotesPageProps) {
  const { slug } = await params;
  const tag = getTag(slug);
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', 1, '', tag ?? 'all'],
    queryFn: () => fetchNotes({ page: 1, perPage: 12, search: '', tag }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}
