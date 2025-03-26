'use client'

import Prism from 'prismjs'

import 'prismjs/components/prism-php'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-markup-templating'
import { Highlight } from 'prism-react-renderer'
import { Fragment } from 'react'

(typeof global !== "undefined" ? global : window).Prism = Prism

require("prismjs/components/prism-php")

export function Fence({ children, language }) {
  return (
    <Highlight
      code={children.trimEnd()}
      language={language}
      theme={{ plain: {}, styles: [] }}
    >
      {({ className, style, tokens, getTokenProps }) => (
        <pre className={className} style={style} suppressHydrationWarning={true}>
          <code>
            {tokens.map((line, lineIndex) => (
              <Fragment key={lineIndex}>
                {line
                  .filter((token) => !token.empty)
                  .map((token, tokenIndex) => (
                    <span key={tokenIndex} {...getTokenProps({ token })} />
                  ))}
                {'\n'}
              </Fragment>
            ))}
          </code>
        </pre>
      )}
    </Highlight>
  )
}
