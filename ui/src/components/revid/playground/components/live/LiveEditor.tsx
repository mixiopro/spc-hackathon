'use client'

import React from 'react'
import { javascript } from '@codemirror/lang-javascript'
import CodeMirror from '@uiw/react-codemirror'

import { useLive } from './LiveContext'

interface LiveEditorProps {
  height?: string
  className?: string
}

export function LiveEditor({ height = '400px', className = '' }: LiveEditorProps) {
  const { code, onCodeChange } = useLive()

  return (
    <div className={className}>
      <div className="h-full min-h-[400px] overflow-hidden rounded-lg border">
        <CodeMirror
          value={code}
          // height={height}
          theme="dark"
          extensions={[javascript({ jsx: true, typescript: true })]}
          onChange={onCodeChange}
          className="h-full"
        />
      </div>
    </div>
  )
}
