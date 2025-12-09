import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
export default function ToolCard({ tool, index }) {
  const [previewImage, setPreviewImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    if (tool.image) {
      setPreviewImage(tool.image);
      setImageLoading(false);
    }
    else if (tool.link) {
      fetch(`/api/link-preview?url=${encodeURIComponent(tool.link)}`)
        .then(res => res.json())
        .then(data => {
          if (data.imageUrl) {
            setPreviewImage(data.imageUrl);
          }
        })
        .catch(err => console.error('Error fetching preview:', err))
        .finally(() => setImageLoading(false));
    } else {
      setImageLoading(false);
    }
  }, [tool.image, tool.link]);

  return (
    <Link
      href={tool.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 bg-white dark:bg-zinc-900 shadow-md hover:shadow-lg"
    >
      {imageLoading && (
        <div className="w-full h-48 bg-zinc-100 dark:bg-zinc-800 rounded-lg mb-4 animate-pulse" />
      )}
      {!imageLoading && previewImage && (
        <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
          <Image
            src={previewImage}
            alt={`Preview of ${tool.name}`}
            fill
            className="object-cover dark:invert"
          />
        </div>
      )}
      <h3 className="text-xl font-semibold my-2">{tool.name}</h3>
      <p className="text-zinc-600 dark:text-gray-400">{tool.description}</p>
    </Link>
  );
}
