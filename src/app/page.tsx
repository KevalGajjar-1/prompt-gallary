"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Prompt } from '@/types/prompt';

export default function Home() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const response = await fetch('/api/prompts');
        if (!response.ok) throw new Error('Failed to fetch prompts');
        const data = await response.json();
        setPrompts(data);
      } catch (error) {
        console.error('Error fetching prompts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrompts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this prompt?')) return;
    
    try {
      const response = await fetch(`/api/prompts/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete prompt');
      setPrompts(prompts.filter(prompt => prompt.id !== id));
      
      // Show success toast
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
    <div className="min-h-screen bg-base-100">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="text-blue-600">
                <svg viewBox="0 0 48 48" className="h-6 w-6" fill="currentColor">
                  <path d="M42.44 44C42.44 44 36.08 33.9 41.17 24C46.87 12.93 42.21 4 42.21 4L7 4C7 4 11.65 12.93 5.96 24C.87 33.9 7.26 44 7.26 44L42.44 44Z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-slate-900">AI Image Generation</h1>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-sm font-medium text-slate-900 hover:text-blue-600 transition-colors">Home</Link>
              <Link href="/explore" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Explore</Link>
              <Link href="/create" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Create</Link>
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Search prompts..."
                className="h-10 w-64 rounded-full border-0 bg-slate-100 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            
            <Link 
              href="/add" 
              className="btn btn-primary gap-2 px-4 py-2 rounded-full text-sm font-medium hover:shadow-md hover:shadow-primary/20 transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              <span className="hidden sm:inline">New Prompt</span>
            </Link>
            
            <div className="h-8 w-8 overflow-hidden rounded-full bg-slate-200">
              <div className="h-full w-full bg-slate-300 flex items-center justify-center text-slate-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-slate-800 mb-3 font-['Spline_Sans']">Explore</h1>
          <p className="text-slate-500 text-lg">Discover and share amazing AI prompts</p>
        </div>
        
        {/* Search and filter bar */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div className="relative w-full md:max-w-2xl">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search prompts by title or description..."
              className="input input-bordered w-full pl-10 bg-white border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl transition-all duration-200 h-12"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* View toggle tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 bg-white shadow-sm flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button className="px-4 py-2 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-700 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              <span className="hidden sm:inline">List</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : prompts.length === 0 ? (
          <div className="hero min-h-[60vh] bg-base-200 rounded-box">
            <div className="hero-content text-center">
              <div className="max-w-md">
                <h1 className="text-5xl font-bold">No prompts yet</h1>
                <p className="py-6">Get started by creating your first prompt. Click the button below to begin!</p>
                <Link 
                  href="/add" 
                  className="btn btn-primary px-6 py-3 rounded-xl font-medium text-base hover:shadow-lg hover:shadow-primary/20 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 border-0 bg-gradient-to-r from-primary to-primary/80 hover:opacity-90"
                >
                  <span className="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline-block" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Create First Prompt
                    <span className="absolute -top-1 -right-4 h-2 w-2 rounded-full bg-white/80 animate-ping"></span>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-800">Latest Prompts</h2>
              <div className="text-sm text-slate-500">
                Showing {filteredPrompts.length} {filteredPrompts.length === 1 ? 'prompt' : 'prompts'}
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPrompts.map((prompt) => (
                <div key={prompt.id} className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100 hover:border-slate-200">
                  {/* Image with hover overlay */}
                  <div className="aspect-[4/3] relative overflow-hidden bg-slate-50">
                    <Image
                      src={prompt.image_url || '/placeholder.png'}
                      alt={prompt.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    
                    {/* Hover actions */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <div className="flex gap-2 w-full">
                        <Link 
                          href={`/edit/${prompt.id}`}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white/90 text-slate-800 rounded-lg text-sm font-medium hover:bg-white transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                          Edit
                        </Link>
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            handleDelete(prompt.id);
                          }}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500/90 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Card content */}
                  <div className="p-5">
                    <h3 className="card-title text-lg font-semibold line-clamp-1">{prompt.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">{prompt.description}</p>
                    <div className="card-actions justify-between items-center">
                      <div className="badge badge-outline">
                        {new Date(prompt.created_at).toLocaleDateString()}
                      </div>
                      <div className="flex gap-2">
                        <Link 
                          href={`/edit/${prompt.id}`}
                          className="btn btn-ghost btn-sm rounded-lg px-3 h-9 min-h-0 font-medium text-sm hover:bg-base-200/70 hover:text-primary transition-colors duration-200 flex items-center gap-1.5 group"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                          Edit
                        </Link>
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            handleDelete(prompt.id);
                          }}
                          className="btn btn-sm rounded-lg px-3 h-9 min-h-0 font-medium text-sm bg-error/5 hover:bg-error/10 text-error border-error/10 hover:border-error/20 hover:bg-error/5 transition-colors duration-200 flex items-center gap-1.5 group"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
