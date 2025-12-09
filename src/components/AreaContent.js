import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import Image from 'next/image';

const AreaContent = ({ content }) => (
  <div
    className="py-2 prose prose-zinc dark:prose-invert max-w-none prose-headings:font-semibold prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-text-base prose-p:leading-6"
  >
    <ReactMarkdown
      remarkPlugins={[remarkMath, remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypeKatex]}
      components={{
        img: ({ node, ...props }) => (
          <Image
            src={props.src}
            alt={props.alt || ''}
            width={768}
            height={420}
            className="mx-auto md:max-w-[768px] h-auto mt-0 dark:invert-97"
            priority
            {...props}
          />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  </div>
);

export default AreaContent;
