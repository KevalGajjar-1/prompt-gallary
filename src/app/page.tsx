"use client";

import { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { AdUnit } from '@/components/GoogleAdSense';

type Prompt = {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  created_at: string;
};

export default function Home() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const observer = useRef<IntersectionObserver>();
  const { isAdmin } = useAuth();
  const router = useRouter();

  const lastPromptElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetching) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isFetching, hasMore]
  );

  const fetchPrompts = useCallback(
    async (pageNum: number) => {
      if (isFetching) return;
      setIsFetching(true);
      try {
        const response = await fetch(`/api/prompts?page=${pageNum}&limit=20`);
        if (!response.ok) throw new Error('Failed to fetch prompts');
        const { data, pagination } = await response.json();
        setPrompts((prev) =>
          pageNum === 1 ? data : [...prev, ...data]
        );
        setHasMore(pageNum < pagination.totalPages);
      } catch (error) {
        console.error('Error fetching prompts:', error);
      } finally {
        setLoading(false);
        setIsFetching(false);
      }
    },
    [isFetching]
  );

  useEffect(() => {
    fetchPrompts(page);
  }, [page, fetchPrompts]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this prompt?')) return;
    
    try {
      const response = await fetch(`/api/prompts/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete prompt');
      
      // Remove the deleted prompt from the list
      setPrompts((prev) => prev.filter((prompt) => prompt.id !== id));
    } catch (error) {
      console.error('Error deleting prompt:', error);
      alert('Failed to delete prompt');
    }
  };

  const filteredPrompts = prompts.filter(
    (prompt) =>
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Search prompts..."
            className="w-full h-12 rounded-full border-0 bg-slate-100 pl-12 pr-4 text-sm focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <svg
            className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPrompts.map((prompt, index) => (
          <div
            key={prompt.id}
            ref={filteredPrompts.length === index + 1 ? lastPromptElementRef : null}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="relative h-48 bg-gray-100">
              {prompt.image_url ? (
                <Image
                  src={prompt.image_url}
                  alt={prompt.title}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = '/placeholder.svg';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <span className="text-gray-400">No image</span>
                </div>
              )}
              {isAdmin && (
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={() => router.push(`/edit/${prompt.id}`)}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                    aria-label="Edit prompt"
                  >
                    <svg
                      className="w-4 h-4 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(prompt.id)}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-red-50"
                    aria-label="Delete prompt"
                  >
                    <svg
                      className="w-4 h-4 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {prompt.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {prompt.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  {new Date(prompt.created_at).toLocaleDateString()}
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(prompt.description);
                    alert('Prompt copied to clipboard!');
                  }}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Copy Prompt
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* No Results */}
      {!loading && filteredPrompts.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">No prompts found</h3>
          <p className="mt-2 text-gray-600">
            {searchQuery
              ? 'Try adjusting your search or filter to find what you\'re looking for.'
              : 'No prompts available yet. Check back later!'}
          </p>
        </div>
      )}

      {/* In-content Ad */}
      <div className="my-12">
        <AdUnit
          slot="your-in-content-slot-id"
          format="auto"
          responsive={true}
          className="my-8"
        />
      </div>
    </div>
  );
}
