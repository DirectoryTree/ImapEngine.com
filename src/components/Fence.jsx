'use client'

import Prism from 'prismjs'
import 'prismjs/components/prism-php'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-markup-templating'
import { Highlight } from 'prism-react-renderer'

export function Fence({ children, language }) {
  return (
    <Highlight
      prism={Prism}
      language={language}
      code={children.trimEnd()}
      theme={{ plain: {}, styles: [] }}
    >
      {({ className, style, tokens, getTokenProps, getLineProps }) => (
        <pre className={className} style={style}>
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
  )
}
