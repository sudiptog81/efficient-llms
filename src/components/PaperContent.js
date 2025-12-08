import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import Image from 'next/image';

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
            <Image
              src={props.src}
              alt={props.alt || ''}
              width={0}
              height={0}
              sizes="100vw"
              className="mx-auto w-auto md:max-w-[800px] h-auto"
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

export default PaperContent;
