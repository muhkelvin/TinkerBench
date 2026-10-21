import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  return (
    <div className={`prose-editorial max-w-none break-words ${className}`}>
      <ReactMarkdown
        rehypePlugins={[
          [
            rehypeSanitize,
            {
              ...defaultSchema,
              attributes: {
                ...defaultSchema.attributes,
                code: [...(defaultSchema.attributes?.code || []), 'className'],
              },
            },
          ],
        ]}
        components={{
          h1: ({ ...props }) => (
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mt-8 mb-4 text-[#24251F]" {...props} />
          ),
          h2: ({ ...props }) => (
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight mt-6 mb-3 text-[#24251F]" {...props} />
          ),
          h3: ({ ...props }) => (
            <h3 className="text-lg sm:text-xl font-medium tracking-tight mt-5 mb-2 text-[#24251F]" {...props} />
          ),
          p: ({ ...props }) => (
            <p className="leading-relaxed my-4 text-[#24251F] [overflow-wrap:anywhere]" {...props} />
          ),
          ul: ({ ...props }) => (
            <ul className="list-disc pl-6 my-4 space-y-1 text-[#24251F]" {...props} />
          ),
          ol: ({ ...props }) => (
            <ol className="list-decimal pl-6 my-4 space-y-1 text-[#24251F]" {...props} />
          ),
          li: ({ ...props }) => <li className="leading-relaxed" {...props} />,
          blockquote: ({ ...props }) => (
            <blockquote
              className="border-l-2 border-[#C7E36A] pl-4 italic text-[#686960] my-4"
              {...props}
            />
          ),
          a: ({ href, ...props }) => {
            const isExternal = href?.startsWith('http') || href?.startsWith('//');
            return (
              <a
                href={href}
                className="underline underline-offset-4 decoration-[#C7E36A] hover:text-[#24251F] transition-colors"
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                {...props}
              />
            );
          },
          img: ({ src, alt, ...props }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt={alt || ''}
              loading="lazy"
              className="rounded-lg border border-[#E5E1D6] max-w-full h-auto my-6"
              {...props}
            />
          ),
          table: ({ ...props }) => (
            <div className="overflow-x-auto my-6 border border-[#E5E1D6] rounded-lg">
              <table className="min-w-full divide-y divide-[#E5E1D6] text-left text-sm" {...props} />
            </div>
          ),
          th: ({ ...props }) => (
            <th className="px-4 py-2 font-semibold bg-[#F5F3EC] text-[#24251F]" {...props} />
          ),
          td: ({ ...props }) => (
            <td className="px-4 py-2 border-t border-[#E5E1D6] text-[#24251F]" {...props} />
          ),
          code: ({ className, children, ...props }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code
                  className="font-mono text-[13px] bg-[#E5E1D6]/50 px-1.5 py-0.5 rounded text-[#24251F]"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <div className="overflow-x-auto my-4 rounded-lg bg-[#24251F] text-[#FFFEFA] p-4">
                <code className="font-mono text-[13px] leading-relaxed block" {...props}>
                  {children}
                </code>
              </div>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
