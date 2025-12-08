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
          <span className="w-full">
            <Image
              src={props.src}
              alt={props.alt || ''}
              width={0}
              height={0}
              sizes="100vw"
              className="mx-auto w-auto md:max-w-[800px] h-auto mt-0"
              priority
              {...props}
            />
          </span>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  </div>
);

export default AreaContent;
