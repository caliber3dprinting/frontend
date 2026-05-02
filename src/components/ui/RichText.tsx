'use client'

import Image from 'next/image'
import { PortableText, type PortableTextComponents } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/react'

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-zinc-300 leading-[1.85] mb-5 text-[1.0625rem]">{children}</p>
    ),
    h1: ({ children }) => (
      <h1 className="text-3xl sm:text-4xl font-bold text-white mt-12 mb-5 leading-tight">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl sm:text-3xl font-bold text-white mt-10 mb-4 leading-snug">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-bold text-white mt-8 mb-3">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-lg font-semibold text-white mt-6 mb-2">{children}</h4>
    ),
    h5: ({ children }) => (
      <h5 className="text-base font-semibold text-zinc-200 mt-4 mb-1">{children}</h5>
    ),
    h6: ({ children }) => (
      <h6 className="text-sm font-semibold text-zinc-300 mt-4 mb-1 uppercase tracking-wide">{children}</h6>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-8 border-l-4 border-orange-500 bg-zinc-900/60 pl-6 pr-4 py-4 rounded-r-xl italic text-zinc-400 text-lg leading-relaxed">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc ml-6 space-y-2 text-zinc-300 mb-5 text-[1.0625rem]">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal ml-6 space-y-2 text-zinc-300 mb-5 text-[1.0625rem]">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-relaxed pl-1">{children}</li>,
    number: ({ children }) => <li className="leading-relaxed pl-1">{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
    em: ({ children }) => <em className="italic text-zinc-300">{children}</em>,
    underline: ({ children }) => <u className="underline underline-offset-2">{children}</u>,
    'strike-through': ({ children }) => <s className="text-zinc-500">{children}</s>,
    code: ({ children }) => (
      <code className="bg-zinc-800 border border-zinc-700 px-1.5 py-0.5 rounded text-orange-400 text-[0.875em] font-mono">
        {children}
      </code>
    ),
    link: ({ value, children }) => {
      const href: string = value?.href ?? ''
      const isExternal = href.startsWith('http')
      return (
        <a
          href={href}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          className="text-orange-500 hover:text-orange-400 underline underline-offset-[3px] decoration-orange-500/40 hover:decoration-orange-400 transition-colors"
        >
          {children}
        </a>
      )
    },
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null
      return (
        <figure className="my-8">
          <div
            className="relative w-full rounded-xl overflow-hidden bg-zinc-800"
            style={{ aspectRatio: value.asset.metadata?.dimensions ? `${value.asset.metadata.dimensions.width} / ${value.asset.metadata.dimensions.height}` : '16/9' }}
          >
            <Image
              src={value.asset.url ?? ''}
              alt={value.alt ?? ''}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
          {value.caption && (
            <figcaption className="mt-2 text-center text-sm text-zinc-500 italic">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
    code: ({ value }) => (
      <pre className="my-6 bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 overflow-x-auto">
        <code className="text-orange-300 text-sm font-mono leading-relaxed">{value?.code}</code>
      </pre>
    ),
  },
}

export default function RichText({ content }: { content: PortableTextBlock[] }) {
  return <PortableText value={content} components={components} />
}
