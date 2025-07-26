'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AddPrompt() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim() || !image) {
      setError('All fields are required');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('image', image);

      const response = await fetch('/api/prompts', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to create prompt');
      }

      // Redirect to home page after successful submission
      router.push('/');
      router.refresh();
    } catch (err) {
      console.error('Error creating prompt:', err);
      setError('Failed to create prompt. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-base-100 rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Add New Prompt</h1>
          <Link href="/" className="btn btn-ghost">
            Back to Gallery
          </Link>
        </div>

        {error && (
          <div className="alert alert-error mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-control">
            <label className="label" htmlFor="title">
              <span className="label-text">Title</span>
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for your prompt"
              className="input input-bordered w-full"
              disabled={isSubmitting}
            />
          </div>

          <div className="form-control">
            <label className="label" htmlFor="description">
              <span className="label-text">Description</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter your prompt description"
              className="textarea textarea-bordered h-32"
              disabled={isSubmitting}
            />
          </div>

          <div className="form-control">
            <label className="label" htmlFor="image">
              <span className="label-text">Image</span>
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              className="file-input file-input-bordered w-full"
              disabled={isSubmitting}
            />
            <label className="label">
              <span className="label-text-alt">Upload an image that represents your prompt</span>
            </label>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Link href="/" className="btn btn-ghost">
              Cancel
            </Link>
            <button
              type="submit"
              className={`btn btn-primary ${isSubmitting ? 'loading' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Prompt'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
