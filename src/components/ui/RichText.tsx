'use client'

import Image from 'next/image'
import { BlocksRenderer } from '@strapi/blocks-react-renderer'
import type { StrapiBlocks } from '@/lib/types'

const HEADING_STYLES: Record<number, string> = {
  1: 'text-3xl sm:text-4xl font-bold text-white mt-12 mb-5 leading-tight',
  2: 'text-2xl sm:text-3xl font-bold text-white mt-10 mb-4 leading-snug',
  3: 'text-xl font-bold text-white mt-8 mb-3',
  4: 'text-lg font-semibold text-white mt-6 mb-2',
  5: 'text-base font-semibold text-zinc-200 mt-4 mb-1',
  6: 'text-sm font-semibold text-zinc-300 mt-4 mb-1 uppercase tracking-wide',
}

export default function RichText({ content }: { content: StrapiBlocks }) {
  return (
    <BlocksRenderer
      content={content}
      blocks={{
        paragraph: ({ children }) => (
          <p className="text-zinc-300 leading-[1.85] mb-5 text-[1.0625rem]">{children}</p>
        ),

        heading: ({ children, level }) => {
          const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
          return (
            <Tag className={HEADING_STYLES[level] ?? HEADING_STYLES[2]}>
              {children}
            </Tag>
          )
        },

        list: ({ children, format }) =>
          format === 'ordered' ? (
            <ol className="list-decimal ml-6 space-y-2 text-zinc-300 mb-5 text-[1.0625rem]">
              {children}
            </ol>
          ) : (
            <ul className="list-disc ml-6 space-y-2 text-zinc-300 mb-5 text-[1.0625rem]">
              {children}
            </ul>
          ),

        'list-item': ({ children }) => (
          <li className="leading-relaxed pl-1">{children}</li>
        ),

        quote: ({ children }) => (
          <blockquote className="my-8 border-l-4 border-orange-500 bg-zinc-900/60 pl-6 pr-4 py-4 rounded-r-xl italic text-zinc-400 text-lg leading-relaxed">
            {children}
          </blockquote>
        ),

        code: ({ plainText }) => (
          <pre className="my-6 bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 overflow-x-auto">
            <code className="text-orange-300 text-sm font-mono leading-relaxed">
              {plainText}
            </code>
          </pre>
        ),

        image: ({ image }) => (
          <figure className="my-8">
            <div className="relative w-full rounded-xl overflow-hidden bg-zinc-800" style={{ aspectRatio: `${image.width} / ${image.height}` }}>
              <Image
                src={image.url}
                alt={image.alternativeText ?? ''}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 800px"
              />
            </div>
            {image.caption && (
              <figcaption className="mt-2 text-center text-sm text-zinc-500 italic">
                {image.caption}
              </figcaption>
            )}
          </figure>
        ),

        link: ({ children, url }) => (
          <a
            href={url}
            target={url.startsWith('http') ? '_blank' : undefined}
            rel={url.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="text-orange-500 hover:text-orange-400 underline underline-offset-[3px] decoration-orange-500/40 hover:decoration-orange-400 transition-colors"
          >
            {children}
          </a>
        ),
      }}
      modifiers={{
        bold: ({ children }) => (
          <strong className="font-semibold text-white">{children}</strong>
        ),
        italic: ({ children }) => (
          <em className="italic text-zinc-300">{children}</em>
        ),
        underline: ({ children }) => (
          <u className="underline underline-offset-2">{children}</u>
        ),
        strikethrough: ({ children }) => (
          <s className="text-zinc-500">{children}</s>
        ),
        code: ({ children }) => (
          <code className="bg-zinc-800 border border-zinc-700 px-1.5 py-0.5 rounded text-orange-400 text-[0.875em] font-mono">
            {children}
          </code>
        ),
      }}
    />
  )
}
