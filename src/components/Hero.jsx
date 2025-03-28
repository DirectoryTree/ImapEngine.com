import { Fragment } from 'react'
import Image from 'next/image'
import clsx from 'clsx'
import { Highlight } from 'prism-react-renderer'

import { Button } from '@/components/Button'
import blurCyanImage from '@/images/blur-cyan.png'
import blurIndigoImage from '@/images/blur-indigo.png'

import Prism from 'prismjs'
import 'prismjs/components/prism-php'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-markup-templating'

const codeLanguage = 'php'
const code = `use DirectoryTree\\ImapEngine\\Mailbox;

$mailbox = new Mailbox([
    'host' => 'imap.example.com',
    'port' => 993,
    'encryption' => 'ssl',
    'username' => 'user@example.com',
    'password' => 'password',
]);

$inbox = $mailbox->inbox();

$messages = $inbox->messages()->get();`

const tabs = [
  { name: 'connect.php', isActive: true },
  { name: 'composer.json', isActive: false },
]

function TrafficLightsIcon(props) {
  return (
    <svg aria-hidden="true" viewBox="0 0 42 10" fill="none" {...props}>
      <circle cx="5" cy="5" r="4.5" />
      <circle cx="21" cy="5" r="4.5" />
      <circle cx="37" cy="5" r="4.5" />
    </svg>
  )
}

export function Hero() {
  return (
    <div className="overflow-hidden dark:mt-[-4.75rem] dark:-mb-32 dark:bg-slate-900 dark:pt-[4.75rem] dark:pb-32">
      <div className="py-16 sm:px-2 lg:relative lg:px-0 lg:py-20">
        <div className="mx-auto grid max-w-2xl grid-cols-1 items-center gap-x-8 gap-y-16 px-4 lg:max-w-8xl lg:grid-cols-2 lg:px-8 xl:gap-x-16 xl:px-12">
          {/* Left side text */}
          <div className="relative z-10 md:text-center lg:text-left">
            <div className="relative">
              <p className="inline font-display text-5xl tracking-tight text-black dark:text-white">
                Simple IMAP for PHP
              </p>
              <p className="mt-3 text-2xl tracking-tight text-slate-400">
                Manage IMAP mailboxes without the PHP extension.
              </p>
              <div className="mt-8 flex gap-4 md:justify-center lg:justify-start">
                <Button href="/docs/installation">Get started</Button>
                <Button
                  href="https://github.com/DirectoryTree/ImapEngine"
                  variant="secondary"
                >
                  View on GitHub
                </Button>
              </div>
            </div>
          </div>
          <div className="relative lg:static xl:pl-10">
            <div className="relative">
              <Image
                className="absolute -top-64 -right-64"
                src={blurCyanImage}
                alt=""
                width={530}
                height={530}
                unoptimized
                priority
              />
              <Image
                className="hidden dark:block absolute -right-44 -bottom-40"
                src={blurIndigoImage}
                alt=""
                width={567}
                height={567}
                unoptimized
                priority
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-sky-300 via-sky-300/70 to-blue-300 opacity-10 blur-lg" />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-sky-300 via-sky-300/70 to-blue-300 opacity-10" />

              {/* Code block */}
              <div className="relative rounded-2xl bg-white ring-1 ring-slate-900/10 backdrop-blur-sm dark:bg-[#0A101F]/80 dark:ring-white/10">
                <div className="absolute -top-px right-11 left-20 h-px bg-gradient-to-r from-sky-300/0 via-sky-300/70 to-sky-300/0" />
                <div className="absolute right-20 -bottom-px left-11 h-px bg-gradient-to-r from-blue-400/0 via-blue-400 to-blue-400/0" />
                <div className="pt-4 pl-4">
                  <TrafficLightsIcon className="h-2.5 w-auto stroke-slate-500/30" />

                  {/* Tabs */}
                  <div className="mt-4 flex space-x-2 text-xs">
                    {tabs.map((tab) => (
                      <div
                        key={tab.name}
                        className={clsx(
                          'flex h-6 rounded-full',
                          tab.isActive
                            ? 'bg-gradient-to-r from-sky-400 via-sky-400 to-sky-400 dark:from-sky-400/30 dark:via-sky-400 dark:to-sky-400/30 p-px font-medium dark:text-sky-300 text-sky-500'
                            : 'text-slate-500',
                        )}
                      >
                        <div
                          className={clsx(
                            'flex items-center rounded-full px-2.5',
                            tab.isActive && 'bg-slate-100 dark:bg-slate-800',
                          )}
                        >
                          {tab.name}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Code lines */}
                  <div className="mt-6 flex items-start px-1 text-sm">
                    {/* Line numbers – use default (light) and dark: for color */}
                    <div
                      aria-hidden="true"
                      className="border-r border-slate-100 pr-4 font-mono text-slate-300 select-none dark:border-slate-300/5 dark:text-slate-600"
                    >
                      {Array.from({
                        length: code.split('\n').length,
                      }).map((_, index) => (
                        <Fragment key={index}>
                          {(index + 1).toString().padStart(2, '0')}
                          <br />
                        </Fragment>
                      ))}
                    </div>
                    {/* Highlight block */}
                    <Highlight
                      prism={Prism}
                      code={code}
                      language={codeLanguage}
                      theme={{ plain: {}, styles: [] }}
                    >
                      {({
                        className,
                        style,
                        tokens,
                        getLineProps,
                        getTokenProps,
                      }) => (
                        <pre
                          className={clsx(
                            'w-full px-4 pb-6',
                            // Add your default text color and override for dark mode
                            'text-slate-900 dark:text-slate-100',
                            className,
                          )}
                          style={style}
                        >
                          {tokens.map((line, i) => (
                            <div key={i} {...getLineProps({ line })}>
                              {line.map((token, key) => (
                                <span key={key} {...getTokenProps({ token })} />
                              ))}
                            </div>
                          ))}
                        </pre>
                      )}
                    </Highlight>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
