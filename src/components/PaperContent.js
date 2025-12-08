import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import Image from 'next/image';

const DynamicImage = ({ src, alt, ...props }) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    if (src.startsWith('/')) {
      const img = new window.Image();
      img.onload = () => {
        setDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.src = src;
    }
  }, [src]);

  return (
    <Image
      src={imageSrc}
      alt={alt || ''}
      width={dimensions.width}
      height={dimensions.height}
      className="mx-auto md:max-w-[800px]"
      preload
      {...props}
    />
  );
};

const PaperContent = ({ content }) => (
  <div 
    className="py-8 prose prose-zinc dark:prose-invert max-w-none prose-headings:font-semibold prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-text-base prose-p:leading-6 prose-img:my-0"
  >
    <ReactMarkdown
      remarkPlugins={[remarkMath, remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypeKatex, rehypeHighlight]}
      components={{
        img: ({ node, ...props }) => (
          <span className="w-full">
            <DynamicImage {...props} />
          </span>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  </div>
);

export default PaperContent;
