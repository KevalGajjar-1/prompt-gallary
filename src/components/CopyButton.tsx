'use client';

import { useState } from 'react';

interface CopyButtonProps {
  text: string;
  className?: string;
}

export default function CopyButton({ text, className = '' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md shadow-sm transition-colors
        ${copied 
          ? 'bg-green-600 text-white' 
          : 'bg-primary text-white hover:bg-primary/80'}
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        ${className}
      `}
      disabled={copied}
    >
      {copied ? 'Copied!' : 'Copy Prompt'}
    </button>
  );
}
