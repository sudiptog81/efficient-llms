import { Share, Share2 } from 'lucide-react';
import React, { useState } from 'react';

export default function ShareFab({ paper }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const slug = paper?.slug;
    const title = paper?.title || 'Paper';
    const url = (typeof window !== 'undefined')
      ? window.location.href
      : `${process.env.NEXT_PUBLIC_SITE_URL || ''}${slug ? `/papers/${slug}` : ''}`;

    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({ title, text: paper?.abstract || title, url });
        return;
      }

      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        return;
      }

      // Fallback: open Twitter share
      if (typeof window !== 'undefined') {
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
        window.open(twitterUrl, '_blank');
      }
    } catch (err) {
      // swallow errors gracefully but log for debugging

      console.error('Share failed', err);
    }
  };

  return (
    <div className="fixed right-6 bottom-6 z-50">
      <button
        onClick={handleShare}
        aria-label="Share paper"
        title="Share"
        className="group relative inline-flex h-14 w-14 items-center justify-center rounded-full bg-zinc-900 text-white shadow-lg hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-300 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-300 cursor-pointer"
      >
        <Share2 className="h-6 w-6" />
      </button>
      <div className="mt-2 text-center">
        {copied && <span className="text-sm text-zinc-600 dark:text-zinc-300">Copied!</span>}
      </div>
    </div>
  );
}
