import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Metadata } from 'next';
import CopyButton from '@/components/CopyButton';
import Link from 'next/link';
import { AdUnit } from '../../../components/GoogleAdSense';

type Prompt = {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
};

async function getPrompt(id: string): Promise<Prompt> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/prompts/${id}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    if (response.status === 404) {
      notFound();
    }
    throw new Error('Failed to fetch prompt');
  }

  return response.json();
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  try {
    const prompt = await getPrompt((await params).id);

    return {
      title: `${prompt.title} | Prompt Gallery`,
      description: prompt.description.length > 155
        ? `${prompt.description.substring(0, 152)}...`
        : prompt.description,
      openGraph: {
        title: `${prompt.title} | Prompt Gallery`,
        description: prompt.description,
        images: prompt.image_url ? [ {
          url: prompt.image_url,
          width: 1200,
          height: 630,
          alt: prompt.title,
        } ] : [],
        type: 'article',
        publishedTime: prompt.created_at,
        modifiedTime: prompt.updated_at,
      },
      twitter: {
        card: 'summary_large_image',
        title: `${prompt.title} | Prompt Gallery`,
        description: prompt.description,
        images: prompt.image_url ? [ prompt.image_url ] : [],
      },
    };
  } catch (error) {
    return {
      title: 'Error Loading Prompt',
      description: 'An error occurred while loading the prompt.'
    };
  }
}

export default async function ViewPrompt({ params }: { params: Promise<{ id: string }> }) {
  const prompt = await getPrompt((await params).id);

  if (!prompt) {
    return (
      <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
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
              <h1 className="text-3xl font-bold text-gray-900">{ prompt.title }</h1>
              <div className="flex gap-3 sm:gap-5 items-center mb-4 sm:mb-0">
                <CopyButton text={ prompt.description } />
                <Link href="/" className="btn btn-primary rounded-lg text-center">Home</Link>
              </div>
            </div>

            <div className="text-sm text-gray-500">
              <time dateTime={ new Date(prompt.created_at).toISOString() }>
                { new Date(prompt.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }) }
              </time>
              { prompt.updated_at !== prompt.created_at && (
                <span className="ml-2">
                  (Updated: { new Date(prompt.updated_at).toLocaleDateString() })
                </span>
              ) }
            </div>
          </header>

          { prompt.image_url && (
            <div className="mb-8 rounded-lg overflow-hidden">
              <Image
                src={ prompt.image_url }
                alt={ prompt.title }
                width={ 1200 }
                height={ 630 }
                className="w-full h-auto object-cover"
                priority
              />
            </div>
          ) }

          <div className="prose max-w-none">
            <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-lg overflow-x-auto">
              <code className="text-gray-800">{ prompt.description }</code>
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
