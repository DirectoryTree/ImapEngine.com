'use client'

import { usePathname } from 'next/navigation'

import { EditOnGitHub } from '@/components/EditOnGitHub'
import { navigation } from '@/lib/navigation'

export function DocsHeader({ title }) {
  let pathname = usePathname()
  let section = navigation.find((section) =>
    section.links.find((link) => link.href === pathname),
  )

  if (!title && !section) {
    return null
  }

  return (
    <header className="mb-9 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-1">
        {section && (
          <p className="font-display text-sm font-medium text-pink-600">
            {section.title}
          </p>
        )}
        {title && (
          <h1 className="font-display text-3xl tracking-tight text-slate-900 dark:text-white">
            {title}
          </h1>
        )}
      </div>
      {section && (
        <div className="sm:pt-1">
          <EditOnGitHub pathname={pathname} />
        </div>
      )}
    </header>
  )
}
