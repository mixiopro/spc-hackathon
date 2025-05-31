'use client'

import React, { ComponentProps, useEffect, useRef, useState } from 'react'
import { Player } from '@revideo/player-react'

import { cn } from '@/lib/utils'

import { useLive } from './LiveContext'

interface LivePreviewProps extends Partial<ComponentProps<typeof Player>> {
  className?: string
  variables?: Record<string, any>
}

export function LivePreview({
  className = '',
  variables = {},
  controls = true,

  ...props
}: LivePreviewProps) {
  console.log('🚀 ---------------------------🚀')
  console.log('🚀 ~ parameters:', variables)
  console.log('🚀 ---------------------------🚀')
  const { compiled, isReady, isPlayerReady, setIsPlayerReady, isLoading, error, code } = useLive()

  const [showControls, setShowControls] = useState(false)

  const durationInitialized = useRef(false)

  useEffect(() => {
    if (isLoading || !code) {
      setIsPlayerReady(false)
      durationInitialized.current = false
      setShowControls(false)
    }
  }, [code, isLoading, setIsPlayerReady, setShowControls])

  // Show empty preview if code is empty
  if (!code || code.trim() === '') {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-sm text-muted-foreground">Empty Preview</div>
      </div>
    )
  }

  if (!isReady) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-sm text-muted-foreground">Loading the Preview...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-full flex-col items-center justify-center space-y-2 p-4">
        <div className="text-sm font-medium text-destructive">Compilation Error</div>
        <div className="text-center text-xs text-muted-foreground">{error.message}</div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-sm text-muted-foreground">Compiling...</div>
      </div>
    )
  }

  if (!compiled) {
    return null
  }

  console.log('🚀 ~ compiled parameters:', variables)

  return (
    <div className={cn('w-full rounded-lg object-contain bg-background !aspect-video', className)}>
      {code && compiled ? (
        <Player
          controls={showControls}
          // playing={isPlayerReady}
          onTimeUpdate={() => {
            if (!durationInitialized.current) {
              console.log('firs time update triggered')
              setIsPlayerReady(true)
              if (controls) setShowControls(true)
            }
          }}
          // onPlayerReady={(player) => console.log('player is ready')}
          variables={variables}
          project={compiled}
          {...props}
          // onPlayerReady={(player) => {
          //   if (!durationInitialized.current) {
          //     console.log("player is ready", player);
          //     setIsPlayerReady(true);
          //     if (controls) setShowControls(true);
          //   }
          // }}
        />
      ) : null}
    </div>
  )
}
