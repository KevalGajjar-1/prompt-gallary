"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function EditPrompt() {
  const router = useRouter();
  const { id } = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Handle image preview
  useEffect(() => {
    if (!image) return;
    
    const objectUrl = URL.createObjectURL(image);
    setImagePreview(objectUrl);

    // Free memory when component unmounts
    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setImage(null);
      return;
    }
    setImage(e.target.files[0]);
  };

  useEffect(() => {
    const fetchPrompt = async () => {
      try {
        const response = await fetch(`/api/prompts/${id}`);
        if (!response.ok) throw new Error('Failed to fetch prompt');
        const data = await response.json();
        
        setTitle(data.title);
        setDescription(data.description);
        setCurrentImageUrl(data.image_url);
      } catch (err) {
        console.error('Error fetching prompt:', err);
        setError('Failed to load prompt');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrompt();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      setError('Title and description are required');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('currentImageUrl', currentImageUrl);
      
      if (image) {
        formData.append('image', image);
      }

      const response = await fetch(`/api/prompts/${id}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update prompt');
      }

      // Show success message before redirect
      const toast = document.createElement('div');
      toast.className = 'toast toast-top toast-end';
      toast.innerHTML = `
        <div class="alert alert-success">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Prompt updated successfully!</span>
        </div>
      `;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);

      // Redirect to home page after successful update
      router.push('/');
      router.refresh();
    } catch (err) {
      console.error('Error updating prompt:', err);
      setError(err instanceof Error ? err.message : 'Failed to update prompt. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Edit Prompt
          </h1>
          <p className="mt-2 text-base-content/70">
            Update your prompt details below
          </p>
        </div>

        <div className="bg-base-100 rounded-2xl shadow-xl overflow-hidden border border-base-300/30">
          <div className="p-6 sm:p-8">
            <div className="flex justify-end mb-6">
              <Link 
                href="/" 
                className="btn btn-ghost rounded-lg px-4 h-10 min-h-0 font-medium text-base-content/70 hover:bg-base-200/50 hover:text-base-content transition-colors duration-200 flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to Gallery
              </Link>
            </div>

            {error && (
              <div className="alert alert-error mb-6 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-base-content/90 mb-1.5" htmlFor="title">
                  Title <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter a catchy title"
                    className="input input-bordered w-full pl-4 pr-4 py-3 rounded-xl bg-base-200/50 hover:bg-base-200/70 focus:bg-base-100 focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all duration-200"
                    disabled={isSubmitting}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-base-content/90 mb-1.5" htmlFor="description">
                  Description <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your prompt in detail..."
                    className="textarea textarea-bordered w-full pl-4 pr-4 py-3 rounded-xl bg-base-200/50 hover:bg-base-200/70 focus:bg-base-100 focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all duration-200 min-h-[120px]"
                    disabled={isSubmitting}
                    required
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-base-content/40">
                    {description.length}/1000
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-base-content/90 mb-1.5">
                  Image
                </label>
                <div className="space-y-4">
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 hover:border-primary/50 hover:bg-base-200/20 ${
                      image || currentImageUrl ? 'border-base-300' : 'border-base-300/50'
                    }`}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      disabled={isSubmitting}
                    />
                    {imagePreview || currentImageUrl ? (
                      <div className="relative w-full h-48 rounded-lg overflow-hidden">
                        <Image 
                          src={imagePreview || currentImageUrl || '/placeholder.png'}
                          alt="Preview" 
                          fill
                          className="object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            if (target.src !== '/placeholder.png') {
                              target.src = '/placeholder.png';
                            }
                          }}
                          unoptimized={process.env.NODE_ENV !== 'production'}
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                          <div className="bg-white/90 text-primary rounded-full p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="text-sm">
                          <p className="font-medium text-base-content">Upload a new image (optional)</p>
                          <p className="text-xs text-base-content/50 mt-1">PNG, JPG, or JPEG (max. 5MB)</p>
                        </div>
                      </div>
                    )}
                  </div>
                  {(image || currentImageUrl) && (
                    <div className="flex justify-between items-center text-xs text-base-content/60">
                      <span>{image ? image.name : 'Current image'}</span>
                      <button 
                        type="button" 
                        onClick={() => {
                          setImage(null);
                          setImagePreview('');
                          setCurrentImageUrl('');
                        }}
                        className="text-error/80 hover:text-error transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className={`btn w-full py-3 rounded-xl font-medium text-white transition-all duration-200 border-0 ${
                    isSubmitting 
                      ? 'bg-primary/80' 
                      : 'bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0'
                  }`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      <span>Updating Prompt...</span>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Update Prompt</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
