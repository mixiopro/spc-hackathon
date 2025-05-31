import { javascript } from '@codemirror/lang-javascript'
import { vscodeDark } from '@uiw/codemirror-theme-vscode'
import CodeMirror from '@uiw/react-codemirror'
import { Card } from './card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'

interface ParameterEditorProps {
  parameters: Record<string, any>
  onParameterChange?: (params: Record<string, any>) => void
  variant?: string
  onVariantChange?: (variant: string) => void
  variants?: Record<string, any>
  readonly?: boolean
}

export function ParameterEditor({
  parameters,
  onParameterChange,
  variant,
  onVariantChange,
  variants = {},
  readonly = false,
}: ParameterEditorProps) {
  const variantOptions = Object.keys(variants)
  const value = JSON.stringify(parameters, null, 2)

  return (
    <Card className="p-4">
      {variantOptions.length > 0 && (
        <div className="mb-4">
          <Select value={variant} onValueChange={onVariantChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select variant" />
            </SelectTrigger>
            <SelectContent>
              {variantOptions.map((v) => (
                <SelectItem key={v} value={v}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      <CodeMirror
        value={value}
        // height="400px"
        theme={vscodeDark}
        extensions={[javascript()]}
        onChange={(value) => {
          if (!readonly && onParameterChange) {
            try {
              const parsed = JSON.parse(value)
              onParameterChange(parsed)
            } catch (e) {
              // Invalid JSON, ignore
            }
          }
        }}
        editable={!readonly}
      />
    </Card>
  )
}
