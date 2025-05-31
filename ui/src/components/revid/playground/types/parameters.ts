import { z } from 'zod'

// Recursive parameter schema to support nested parameters
export const parameterValueSchema: z.ZodType<any> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.record(z.string(), parameterValueSchema),
    z.array(parameterValueSchema),
  ]),
)

export type ParameterValue = z.infer<typeof parameterValueSchema>

export interface ParameterConfig {
  parameters?: Record<string, ParameterValue>
  autoCompile?: boolean
}

// Type for the compile options
export interface CompileOptions {
  parameters?: Record<string, ParameterValue>
  globals?: Record<string, any>
}

// Type for the LiveProvider configuration
export interface LiveConfig {
  code: string
  width?: number
  aspectRatio?: number
  globals?: Record<string, any>
  parameters?: Record<string, ParameterValue>
  autoCompile?: boolean
}
