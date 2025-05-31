'use client'

import { Code } from 'lucide-react'
import { useState } from 'react'
// import { AspectRatio } from '../ui/aspect-ratio'
import { Card } from '../ui/card'
import { LiveEditor, LiveError, LivePreview, LiveProvider, LiveRun } from './playground'
import { ParameterEditor } from '../ui/parameter-editor'
import { AgentState } from '../../lib/types'
import { useCoAgent } from '@copilotkit/react-core'
import { result } from './result'

// Default code for the playground
const defaultCode = `
import {Txt, makeScene2D} from '@revideo/2d';
import {useScene, createRef} from '@revideo/core';

export default makeScene2D('name', function* (view) {
  const textRef = createRef<Txt>();

  const name = useScene().variables.get('name', 'new user');

  view.add(
    <Txt fontSize={1} textWrap={true} ref={textRef} fill={'blue'}>
      Hello {name()}!
    </Txt>,
  );

  yield* textRef().scale(30, 2);
});`.trim()

// Default parameters for the playground
const defaultParams = {
  name: 'world',
  color: '#42b883',
}

export default function PlaygroundRenderer() {
// const [code, setCode] = useCopilst // Initial code state
  const { state } = useCoAgent<AgentState>({name:"sample_agent"});  

  console.log('🚀 -----------------🚀')
  console.log('🚀 ~PlaygroundRenderer state:', state)
  console.log('🚀 ~PlaygroundRenderer code :', state.final_result?.code )
  console.log('🚀 -----------------🚀')


  // Remove code state, LiveProvider manages it internally via context
  // const [code, setCode] = useState(defaultCode);
  const [liveParams, setLiveParams] = useState<Record<string, any>>(defaultParams)

  // Fixed aspect ratio and width for simplicity
  const aspectRatio = 16 / 9
  const width = 480 // Increased width for better preview

  // Handler for parameter changes from ParameterEditor
  const handleParameterChange = (newParams: Record<string, any>) => {
    setLiveParams(newParams) // Update the state used by LiveProvider
  }

  
  return (
    <LiveProvider
      code={state.final_result?.code 
        || ''}// {(state.finalResult?.code) || ''} // Pass initial code directly
      autoCompile={true} // Auto-compile on code change
      // globals={{
      //   WIDTH: width,
      //   ASPECT_RATIO: aspectRatio,
      //   // Add any other simple globals if needed
      // }}
      parameters={liveParams} // Use the state updated by ParameterEditor
      width={width}
      aspectRatio={aspectRatio}
    >
      <div className="flex h-[95vh] flex-col gap-4 p-4">
        {/* Top Bar with Run Button */}
        <div className="flex items-center justify-end">
          <LiveRun />
        </div>

        {/* Main Content Area */}
        <div className="flex flex-1 gap-4 overflow-hidden">
          {/* Left Panel: Parameters & Editor */}
          <div className="flex w-1/2 flex-col gap-4 overflow-hidden">
            {/* Parameter Editor */}
            <Card className="p-4 max-h-[30vh]">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Parameters</h3>
              </div>
              <div className="space-y-4">
                {/* Note: ParameterEditor expects full definitions, but LiveProvider uses values */}
                <ParameterEditor
                  parameters={liveParams} // Definitions for the editor UI
                  onParameterChange={handleParameterChange} // Update liveParams state
                  // Removed variant logic
                />
              </div>
            </Card>

            {/* Live Code Editor */}
            <Card className="flex flex-1 flex-col overflow-hidden p-4">
              <div className="mb-2 flex items-center gap-2">
                <Code className="size-4" />
                <h3 className="text-lg font-semibold">Live Editor</h3>
              </div>
              <div className="flex-1 overflow-auto">
                <LiveEditor
                  className="size-full font-mono text-sm"
                  // Remove onChange, LiveEditor interacts with LiveProvider context
                />
              </div>
              <LiveError className="mt-2 text-red-500" />
            </Card>
          </div>

          {/* Right Panel: Preview */}
          <Card className="relative w-1/2 p-4 aspect-video">
            {/* PlayerLoader could be added back if needed */}
            {/* <AspectRatio.Root ratio={aspectRatio} className="size-full">
              <AspectRatio.Content> */}
            {/* {(() => ( */}

            <LivePreview width={width} height={width / aspectRatio} variables={liveParams} />
            {/* ))()} */}
            {/* </AspectRatio.Content>
            </AspectRatio.Root> */}
          </Card>
        </div>
      </div>
    </LiveProvider>
  )
}
