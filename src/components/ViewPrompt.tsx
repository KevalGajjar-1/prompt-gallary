// src/components/ViewPrompt.tsx
'use client';

import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useGetPromptQuery } from '@/services/promptApi';
import CopyButton from '@/components/CopyButton';
import { AdUnit } from '@/components/GoogleAdSense';
import Link from 'next/link';

interface Prompt {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

interface ViewPromptProps {
  initialPrompt?: Prompt | null;
}

export default function ViewPrompt({ initialPrompt }: ViewPromptProps) {
  const { id } = useParams<{ id: string }>();
  const { data: prompt = initialPrompt, error, isLoading } = useGetPromptQuery(id as string, {
    skip: !id,
    refetchOnMountOrArgChange: true,
  });

  if (isLoading && !initialPrompt) {
    return (
      <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 mb-8"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    const is404 = 'status' in error && error.status === 404;
    return (
      <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error loading prompt</h1>
          <p className="text-gray-600 mb-4">
            {is404 
              ? 'The requested prompt was not found.' 
              : 'An error occurred while loading the prompt.'}
          </p>
          <Link 
            href="/" 
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    );
  }

  if (!prompt) {
    return (
      <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Prompt not found</h1>
          <Link 
            href="/" 
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl border p-6 rounded-lg mx-auto">
        <article>
          <header className="mb-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <h1 className="text-3xl font-bold text-gray-900">{prompt.title}</h1>
              <div className="flex gap-3 sm:gap-5 items-center mb-4 sm:mb-0">
                <CopyButton text={prompt.description} />
                <Link href="/" className="btn btn-primary rounded-lg text-center">Home</Link>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              <time dateTime={new Date(prompt.created_at).toISOString()}>
                {new Date(prompt.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
              {prompt.updated_at !== prompt.created_at && (
                <span className="ml-2">
                  (Updated: {new Date(prompt.updated_at).toLocaleDateString()})
                </span>
              )}
            </div>
          </header>

          {prompt.image_url && (
            <div className="mb-8 rounded-lg overflow-hidden">
              <Image
                src={prompt.image_url}
                alt={prompt.title}
                width={1200}
                height={630}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
          )}

          <div className="prose max-w-none">
            <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-lg overflow-x-auto">
              <code className="text-gray-800">{prompt.description}</code>
            </pre>
          </div>
        </article>
        <AdUnit
          slot="5647382911"
          format="auto"
          className="mb-4"
        />
      </div>
    </div>
  );
}