'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Project } from '@revideo/core'

import { RevideoCompiler } from '../../providers/revideo/compiler'
import { LiveConfig, ParameterValue } from '../../types/parameters'
import { LiveContext } from './LiveContext'

interface LiveProviderProps extends LiveConfig {
  children: React.ReactNode
}

const compiler = new RevideoCompiler()

export function LiveProvider({
  code: initialCode,
  children,
  width = 480,
  aspectRatio = 9 / 16,
  globals: initialGlobals = {},
  parameters: initialParameters = {},
  autoCompile: initialAutoCompile = true

}: LiveProviderProps) {


  // State management
  const [code, setCode] = useState(initialCode)
  const [project, setProject] = useState<Project | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [isCompiling, setIsCompiling] = useState(false)
  const [autoCompile, setAutoCompile] = useState(initialAutoCompile)
  const [parameters, setParameters] = useState<Record<string, ParameterValue>>(initialParameters)

  const [globals, setGlobals] = useState<Record<string, any>>(initialGlobals)

  const [isPlayerReady, setIsPlayerReady] = useState(false)

  // Initialize compiler
  useEffect(() => {
    compiler
      .initialize()
      .then(() => {
        setIsReady(true)
      })
      .catch((err) => {
        setError(err instanceof Error ? err : new Error('Failed to initialize'))
      })
  }, [])

  // Sync with external code prop
  useEffect(() => {
    setCode(initialCode)
  }, [initialCode])

  // Compile code
  const compile = useCallback(
    async (variables?: Record<string, any>) => {
      if (!isReady || isCompiling) return

      // Skip compilation if code is empty
      if (!code || code.trim() === '') {
        setProject(null)
        setError(null)
        setIsCompiling(false)
        return
      }

      try {
        setIsCompiling(true)
        setError(null)

        compiler.setGlobals({
          ...globals,
          WIDTH: width,
          ASPECT_RATIO: aspectRatio,
        })

        const compiledProject = await compiler.processCode(code, {
          parameters: variables || parameters,
          globals,
        })

        setProject(compiledProject)
        setError(null)
      } catch (err) {
        console.error('Compilation error:', err)
        setError(err instanceof Error ? err : new Error('Compilation failed'))
        setProject(null)
      } finally {
        setIsCompiling(false)
      }
    },
    [code, isReady, isCompiling, width, aspectRatio, globals, parameters],
  )

  // Auto compilation effect
  useEffect(() => {
    if (autoCompile) {
      compile()
    }
  }, [code, compile, autoCompile, parameters, globals])

  // Handle code changes
  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode)
  }, [])

  // Handle parameter updates
  const updateParameters = useCallback((newParams: Record<string, ParameterValue>) => {
    setParameters((prev) => ({
      ...prev,
      ...newParams,
    }))
  }, [])

  // Handle globals updates
  const updateGlobals = useCallback((newGlobals: Record<string, any>) => {
    setGlobals((prev) => ({
      ...prev,
      ...newGlobals,
    }))
  }, [])

  return (
    <LiveContext.Provider
      value={{
        code,
        error,
        compiled: project,
        isReady,
        isPlayerReady,
        setIsPlayerReady,
        compile,
        isLoading: isCompiling,
        onCodeChange: handleCodeChange,
        parameters,
        updateParameters,
        globals,
        updateGlobals,
        autoCompile,
        setAutoCompile,
      }}
    >
      {children}
    </LiveContext.Provider>
  )
}
