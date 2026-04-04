'use client'

import { BlocksRenderer } from '@strapi/blocks-react-renderer'
import type { StrapiBlocks } from '@/lib/types'

export default function RichText({ content }: { content: StrapiBlocks }) {
  return (
    <BlocksRenderer
      content={content}
      blocks={{
        paragraph: ({ children }) => (
          <p className="text-zinc-300 leading-relaxed">{children}</p>
        ),
        heading: ({ children, level }) => {
          const Tag = `h${level}` as 'h2' | 'h3' | 'h4'
          return <Tag className="font-bold text-white mt-4 mb-1">{children}</Tag>
        },
        list: ({ children, format }) =>
          format === 'ordered' ? (
            <ol className="list-decimal list-inside space-y-1 text-zinc-300">{children}</ol>
          ) : (
            <ul className="list-disc list-inside space-y-1 text-zinc-300">{children}</ul>
          ),
        'list-item': ({ children }) => <li>{children}</li>,
        quote: ({ children }) => (
          <blockquote className="border-l-4 border-orange-500 pl-4 italic text-zinc-400">
            {children}
          </blockquote>
        ),
      }}
      modifiers={{
        bold: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
        italic: ({ children }) => <em className="italic">{children}</em>,
        underline: ({ children }) => <u>{children}</u>,
        strikethrough: ({ children }) => <s>{children}</s>,
        code: ({ children }) => (
          <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-orange-400 text-sm">
            {children}
          </code>
        ),
      }}
    />
  )
}
