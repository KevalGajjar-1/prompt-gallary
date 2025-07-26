"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Prompt } from '@/types/prompt';

export default function Home() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);

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
    if (!confirm('Are you sure you want to delete this prompt?')) return;
    
    try {
      const response = await fetch(`/api/prompts/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete prompt');

      // Remove the deleted prompt from the state
      setPrompts(prompts.filter(prompt => prompt.id !== id));
    } catch (error) {
      console.error('Error deleting prompt:', error);
      alert('Failed to delete prompt');
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Prompt Gallery</h1>
          <Link href="/add" className="btn btn-primary">
            Add New Prompt
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : prompts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500 mb-4">No prompts found</p>
            <Link href="/add" className="btn btn-primary">
              Create Your First Prompt
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prompts.map((prompt) => (
              <div key={prompt.id} className="card bg-base-100 shadow-xl">
                <figure className="h-48 relative">
                  <Image
                    src={prompt.image_url || '/placeholder.png'}
                    alt={prompt.title}
                    fill
                    className="object-cover"
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">{prompt.title}</h2>
                  <p className="line-clamp-3">{prompt.description}</p>
                  <div className="card-actions justify-end mt-4">
                    <Link 
                      href={`/edit/${prompt.id}`}
                      className="btn btn-sm btn-outline"
                    >
                      Edit
                    </Link>
                    <button 
                      onClick={() => handleDelete(prompt.id)}
                      className="btn btn-sm btn-error"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
