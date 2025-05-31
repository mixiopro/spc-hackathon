# Revideo Playground Core

A streamlined web-based playground for creating animations using the [Revideo](https://github.com/havenhq/revideo) framework.

## Core Components

### Live Components

- `LiveProvider`: Main context provider for the playground
- `LiveEditor`: Code editor component
- `LivePreview`: Preview window for animations
- `LiveError`: Error display component
- `LiveRun`: Manual compilation trigger button (when autoCompile is disabled)

### Compiler System

- `compiler`: Core compilation logic using SWC
- `module-proxy`: Module resolution system
- `resolvers`: Framework-specific module resolvers
- `transform`: Code transformation utilities

## Features

### Parameter System

The playground supports a flexible parameter system that allows:

- Nested parameter structures
- Type-safe parameter definitions
- Real-time parameter updates
- Access to parameters in scene code

### Compilation Control

- `autoCompile`: Enable/disable automatic compilation
- Manual compilation trigger via `LiveRun` component
- Globals support maintained for compatibility

## Usage Examples

### Basic Setup

```tsx
import {
  LiveEditor,
  LiveError,
  LivePreview,
  LiveProvider,
} from "@revideo/playground";

function App() {
  return (
    <LiveProvider code={initialCode} width={480} aspectRatio={9 / 16}>
      <LiveEditor />
      <LivePreview />
      <LiveError />
    </LiveProvider>
  );
}
```

### With Parameters and Manual Compilation

```tsx
import {
  LiveEditor,
  LiveError,
  LivePreview,
  LiveProvider,
  LiveRun,
} from "@revideo/playground";

const parameters = {
  colors: {
    primary: "#ff0000",
    secondary: "#00ff00",
  },
  animation: {
    duration: 5,
    easing: "easeInOut",
  },
};

function App() {
  return (
    <LiveProvider
      code={initialCode}
      parameters={parameters}
      autoCompile={false}
      globals={{
        WIDTH: 720,
        ASPECT_RATIO: 16 / 9,
      }}
    >
      <LiveEditor />
      <LivePreview />
      <LiveError />
      <LiveRun>Compile and Run</LiveRun>
    </LiveProvider>
  );
}
```

### Accessing Parameters in Scene Code

```typescript
export default makeScene2D(function* (view) {
  // Access parameters from global context
  const { colors, animation } = parameters;

  view.add(
    <Circle
      fill={colors.primary}
      size={100}
    />
  );
});
```

## Development

### Setup

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## API Reference

### LiveProvider Props

```typescript
interface LiveConfig {
  code: string; // Initial code
  width?: number; // Canvas width
  aspectRatio?: number; // Canvas aspect ratio
  globals?: Record<string, any>; // Global variables
  parameters?: Record<string, ParameterValue>; // Parameter values
  autoCompile?: boolean; // Auto compilation flag
}
```

### Parameter Types

```typescript
type ParameterValue =
  | string
  | number
  | boolean
  | Record<string, ParameterValue>
  | ParameterValue[];

interface ParameterConfig {
  parameters?: Record<string, ParameterValue>;
  autoCompile?: boolean;
}
```
