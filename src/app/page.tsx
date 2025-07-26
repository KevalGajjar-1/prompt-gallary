// src/app/page.tsx
"use client";

import { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';

import Image from 'next/image';
import { Prompt } from '@/types/prompt';
import AdminLogin from '@/components/AdminLogin';
import { useAuth } from '@/contexts/AuthContext';
import { AdUnit } from '@/components/GoogleAdSense';

export default function Home() {
  const [ prompts, setPrompts ] = useState<Prompt[]>([]);
  const [ loading, setLoading ] = useState(true);
  const [ searchQuery, setSearchQuery ] = useState('');
  const [ page, setPage ] = useState(1);
  const [ hasMore, setHasMore ] = useState(true);
  const [ isFetching, setIsFetching ] = useState(false);

  const { isAdmin } = useAuth();
  const [ copiedId, setCopiedId ] = useState<string | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const fetchPrompts = useCallback(async (pageNum: number) => {
    if (isFetching) return;
    try {
      setIsFetching(true);
      const response = await fetch(`/api/prompts?page=${pageNum}&limit=20`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch prompts');
      }
      const { data, pagination } = await response.json();

      setPrompts(prev => pageNum === 1 ? data : [ ...prev, ...data ]);
      setHasMore(pageNum < pagination.totalPages);
      setPage(pageNum);
    } catch (error) {
      console.error('Error fetching prompts:', error);
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  }, [ isFetching ]);

  // Initial load
  useEffect(() => {
    fetchPrompts(1);
  }, []);

  // Infinite scroll setup
  useEffect(() => {
    if (!hasMore || isFetching) return;

    const observerOptions = {
      root: null,
      rootMargin: '20px',
      threshold: 0.1
    };

    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      const target = entries[ 0 ];
      if (target.isIntersecting && hasMore && !isFetching) {
        fetchPrompts(page + 1);
      }
    };

    observer.current = new IntersectionObserver(handleObserver, observerOptions);

    if (loadMoreRef.current) {
      observer.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [ fetchPrompts, hasMore, isFetching, page ]);

  // Add this function inside your component
  const handleCopy = async (description: string, id: string) => {
    try {
      await navigator.clipboard.writeText(description);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!isAdmin) return;

    if (!window.confirm('Are you sure you want to delete this prompt?')) return;

    try {
      const response = await fetch(`/api/prompts/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete prompt');

      setPrompts(prompts.filter(prompt => prompt.id !== id));

      // Show success message
      const toast = document.createElement('div');
      toast.className = 'toast toast-top toast-end';
      toast.innerHTML = `
        <div class="alert alert-success">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Prompt deleted successfully!</span>
        </div>
      `;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    } catch (error) {
      console.error('Error deleting prompt:', error);
      alert('Failed to delete prompt');
    }
  };

  const filteredPrompts = prompts.filter(prompt =>
    prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prompt.description.toLowerCase().includes(searchQuery.toLowerCase())

  );

  return (
    <div className="min-h-screen dark:bg-white">
      {/* Sticky Header */ }
      <header className="sticky top-0 z-50 dark:bg-white bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              {/* <Link href="/" className="flex items-center gap-3"> 
                <div className="text-blue-600">
                  <svg viewBox="0 0 48 48" className="h-6 w-6" fill="currentColor">
                    <path d="M42.44 44C42.44 44 36.08 33.9 41.17 24C46.87 12.93 42.21 4 42.21 4L7 4C7 4 11.65 12.93 5.96 24C.87 33.9 7.26 44 7.26 44L42.44 44Z" />
                  </svg>
                </div>
                <h1 className="text-xl font-bold text-slate-900">AI Prompt Gallery</h1>
              </Link> */}
              <Image src="/prompt-gallary-logo.png" alt='prompt-gallary-logo' width={ 150 } height={ 40 }></Image>
              <nav className="hidden md:flex items-center gap-6">
                <Link href="/" className="text-sm font-medium text-slate-900 hover:text-blue-600 transition-colors">Home</Link>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <input
                  type="text"
                  placeholder="Search prompts..."
                  className="h-10 w-64 rounded-full border-0 bg-slate-100 dark:bg-slate-800 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  value={ searchQuery }
                  onChange={ (e) => setSearchQuery(e.target.value) }
                />
                <svg
                  className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={ 2 }
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              <AdminLogin />

              <Link
                href="/add"
                className="btn btn-primary gap-2 px-4 py-2 rounded-full text-sm font-medium hover:shadow-md hover:shadow-primary/20 transition-all duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                <span className="hidden sm:inline">New Prompt</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page header */ }
        <div className="mb-10 text-center dark:text-slate-200">
          <h1 className="text-4xl font-bold text-slate-800 mb-3">Explore Prompts</h1>
          <p className="text-slate-500 text-lg">Discover and share amazing AI prompts</p>
        </div>

        {/* Search and filter bar */ }
        <div className="flex w-full md:flex-row justify-between items-center mb-10 gap-4">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={ 2 }
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>

            </div>
            <input
              type="text"
              placeholder="Search prompts by title or description..."
              className="input w-full border input-bordered pl-10 bg-white border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl transition-all duration-200 h-12"
              value={ searchQuery }
              onChange={ (e) => setSearchQuery(e.target.value) }
            />
          </div>
        </div>


        { loading ? (
          <div className="flex justify-center items-center h-64">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : filteredPrompts.length === 0 ? (
          <div className="hero min-h-[60vh] rounded-box">
            <div className="hero-content text-center">
              <div className="max-w-md">
                <h1 className="text-5xl font-bold">No prompts found</h1>
                <p className="py-6">Try adjusting your search or check back later for new prompts!</p>
                { isAdmin && (
                  <Link
                    href="/add"
                    className="btn btn-primary px-6 py-3 rounded-xl font-medium text-base hover:shadow-lg hover:shadow-primary/20 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 border-0 bg-gradient-to-r from-primary to-primary/80 hover:opacity-90"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline-block" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Create Your First Prompt
                  </Link>
                ) }
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            { filteredPrompts.map((prompt) => (
              <div key={ prompt.id } className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100 hover:border-slate-200">
                {/* Admin Controls */ }
                { isAdmin && (
                  <div className="absolute top-2 right-2 z-10 flex gap-2">
                    <Link
                      href={ `/edit/${prompt.id}` }
                      className="p-2 bg-white/90 rounded-full shadow hover:bg-white transition-colors"
                      title="Edit"
                    >
                      <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={ 2 } d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </Link>
                    <button
                      onClick={ (e) => {
                        e.preventDefault();
                        handleDelete(prompt.id);
                      } }
                      className="p-2 bg-white/90 rounded-full shadow hover:bg-red-50 hover:text-red-600 transition-colors"
                      title="Delete">
                      <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={ 2 } d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ) }

                {/* Prompt Image */ }
                <Link href={ `/prompts/${prompt?.id || '#'}` } className="block aspect-[4/3] relative overflow-hidden bg-slate-50">
                  <Image
                    src={ prompt?.image_url?.startsWith('http') ? prompt.image_url : '/placeholder.png' }
                    alt={ prompt?.title ? `${prompt.title} prompt` : 'Prompt image' }
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    onError={ (e) => {
                      const target = e.target as HTMLImageElement;
                      if (target.src !== '/placeholder.png') {
                        target.src = '/placeholder.png';
                      }
                    } }
                    unoptimized={ process.env.NODE_ENV !== 'production' } // Disable image optimization in development
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <span className="text-white text-sm font-medium bg-black/50 px-2 py-1 rounded">
                      View Prompt
                    </span>
                  </div>
                </Link>

                {/* Prompt Content */ }
                <div className="p-5 pb-1">
                  <h3 className="text-lg font-semibold text-slate-800 mb-1 line-clamp-1">{ prompt.title }</h3>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-4 min-h-[2.5rem]">{ prompt.description }</p>
                </div>
                <div>
                  <div className="flex p-5 justify-between items-center pt-3 border-t border-slate-200">
                    <span className="text-xs text-slate-500">
                      { new Date(prompt.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      }) }
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={ (e) => {
                          e.preventDefault();
                          handleCopy(prompt.description, prompt.id);
                        } }
                        className="border border-slate-200 text-sm font-medium text-slate-600 hover:text-slate-800 flex items-center gap-1 transition-colors p-1.5 rounded hover:bg-slate-100"
                        title="Copy prompt"
                      >
                        { copiedId === prompt.id ? (
                          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={ 2 } d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={ 2 } d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                          </svg>
                        ) }
                        Copy
                      </button>
                      <Link
                        href={ `/prompts/${prompt.id}` }
                        className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
                      >
                        View
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )) }
            <div ref={ loadMoreRef } className="col-span-full py-4">
              { isFetching && (
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) }
            </div>
          </div>
        ) }
      </div>
      {/* In-content Ad */ }
      <div className="my-12">
        <AdUnit
          slot="1234567890"
          format="auto"
          responsive={ true }
          className="my-8"
        />
         <AdUnit 
            slot="0987654321" 
            format="auto"
            className="mb-4"
          />
          <AdUnit 
            slot="5647382910" 
            format="auto"
            className="mb-4"
          />
      </div>

      {/* Footer */ }
      <footer className="mt-20 py-5 border-t border-slate-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Image src="/prompt-gallary-logo.png" alt='prompt-gallary-logo' width={ 150 } height={ 45 }></Image>
            </div>
            <div className="flex flex-wrap justify-center gap-1 text-sm text-slate-500">
              Made with <span className="text-red-500">❤️</span> by <a href="https://www.linkedin.com/in/keval-gajjar-web-developer-in-gandhinagar/" target="_blank" rel="noopener noreferrer" className='link'>Keval</a>
            </div>
            <div className="mt-4 md:mt-0 text-xs text-slate-400">
              © { new Date().getFullYear() } Prompt Gallery. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}