import type { Metadata } from 'next';
import { makeStore } from '@/lib/store';
import { getPrompt } from '@/services/promptApi';
import ViewPrompt from '@/components/ViewPrompt';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params; // await the promise [5][2]
  const store = makeStore();
  const { data: prompt } = await store.dispatch(getPrompt.initiate(id));

  if (!prompt) {
    return { title: 'Prompt Not Found', description: 'The requested prompt could not be found.' };
  }

  return {
    title: `${prompt.title} | Prompt Gallery`,
    description: prompt.description,
    openGraph: {
      title: `${prompt.title} | Prompt Gallery`,
      description: prompt.description,
      images: prompt.image_url ? [{ url: prompt.image_url }] : [],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${prompt.title} | Prompt Gallery`,
      description: prompt.description,
      images: prompt.image_url ? [prompt.image_url] : [],
    },
  };
}

export default async function PromptPage({ params }: PageProps) {
  const { id } = await params; // await the promise [5][2]
  const store = makeStore();
  const { data: prompt } = await store.dispatch(getPrompt.initiate(id));
  return <ViewPrompt initialPrompt={prompt} />;
}
