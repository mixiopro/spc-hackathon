# Revideo Provider

This provider enables the Revideo animation framework in the playground. It's adapted from the original implementation in `web/lib/revideo-sdk.ts` and `web/components/revideo/module-proxy.tsx`.

## Architecture

### 1. Provider Layer

#### RevideoProvider (`RevideoProvider.ts`)
- Main entry point for Revideo integration
- Handles initialization state and lifecycle
- Manages compiler instance
- Implements error handling and recovery
```typescript
export class RevideoProvider extends BaseProvider<Project> {
  private compiler: RevideoCompiler;
  private initialized = false;

  async compile(code: string, params: Record<string, any>) {
    if (!this.initialized) {
      await this.initializeProvider();
    }
    // Compile code...
  }
}
```

### 2. Module System

#### Base Module Proxy (`ModuleProxy.ts`)
- Framework-agnostic module resolution
- Extensible resolver system
- Built-in caching
```typescript
export class ModuleProxySystem {
  protected addResolvers(resolvers: Record<string, ModuleResolver>) {
    this.config.resolvers = {
      ...this.config.resolvers,
      ...resolvers,
    };
  }
}
```

#### Revideo Module Proxy (`module-proxy.ts`)
- Extends base system for Revideo
- Handles Revideo-specific modules
- Provides JSX runtime
```typescript
export class RevideoModuleProxy extends ModuleProxySystem {
  constructor() {
    super();
    this.addResolvers({
      "@revideo/2d": () => revideo2DResolver,
      "@revideo/2d/jsx-runtime": this.createJsxRuntime.bind(this),
    });
  }
}
```

### 3. Compilation Pipeline

#### Compiler (`compiler.ts`)
- Manages SWC initialization
- Handles code transformation
- Creates execution context
```typescript
export class RevideoCompiler {
  async processScene(code: string) {
    const transformed = this.transform(code, this.swcConfig);
    const context = await this.createExecutionContext();
    return this.executeTransformedCode(transformed.code, context);
  }
}
```

## Key Learnings

### 1. Initialization Patterns
- **Problem**: Race conditions in async initialization
- **Solution**: Proper state tracking and initialization checks
```typescript
if (!this.initialized) {
  await this.initializeProvider();
}
```

### 2. Module Resolution
- **Problem**: JSX runtime resolution failures
- **Solution**: Provider-specific module proxies
- **Learning**: Keep framework-specific code isolated

### 3. React Integration
- **Problem**: Infinite update loops in LiveProvider
- **Solution**: Proper useCallback and cleanup
```typescript
useEffect(() => {
  let mounted = true;
  // Initialize...
  return () => { mounted = false; };
}, [provider]);
```

### 4. Error Handling
- **Problem**: Silent failures in compilation
- **Solution**: Comprehensive error handling
```typescript
try {
  const result = await provider.compile(code);
  // Handle success...
} catch (error) {
  console.error("[Provider] Error:", error);
  // Handle error...
}
```

## Best Practices

### 1. State Management
- Track initialization state explicitly
- Use cleanup functions in effects
- Handle race conditions

### 2. Module System
- Keep base system framework-agnostic
- Extend for specific needs
- Use proper caching

### 3. Error Handling
- Log errors with context
- Provide meaningful error messages
- Handle recovery gracefully

### 4. React Integration
- Use proper effect cleanup
- Avoid state updates after unmount
- Handle async operations safely

## Future Improvements

### 1. Performance
- Optimize module resolution caching
- Add code transformation caching
- Implement lazy loading

### 2. Developer Experience
- Add better error messages
- Improve debugging capabilities
- Add hot reload support

### 3. Features
- Support more Revideo features
- Add custom component support
- Improve preview controls

## Contributing

### Adding Features

1. **New Module Support**
```typescript
class RevideoModuleProxy {
  constructor() {
    this.addResolvers({
      "@your/module": () => yourResolver,
    });
  }
}
```

2. **Custom Components**
```typescript
private createJsxRuntime() {
  return {
    jsx: (type, props) => {
      // Handle custom components
    },
  };
}
```

3. **Error Handling**
```typescript
try {
  // Your code...
} catch (error) {
  console.error("[YourFeature] Error:", error);
  throw new Error(`Failed to handle feature: ${error.message}`);
}
```

### Testing

1. **Module Resolution**
- Test cache hits/misses
- Test error cases
- Test cleanup

2. **Compilation**
- Test different code patterns
- Test error recovery
- Test initialization

3. **React Integration**
- Test component lifecycle
- Test error boundaries
- Test async operations

## Troubleshooting

### Common Issues

1. **Initialization Failures**
- Check provider initialization
- Verify SWC setup
- Check module resolution

2. **JSX Errors**
- Verify JSX runtime setup
- Check transform configuration
- Validate component props

3. **Infinite Loops**
- Check effect dependencies
- Verify callback memoization
- Check state updates

### Debug Tips

1. Enable logging:
```typescript
const DEBUG = true;
if (DEBUG) console.log("[Component] State:", state);
```

2. Check initialization:
```typescript
if (!this.initialized) {
  console.warn("[Provider] Not initialized");
}
```

3. Monitor async operations:
```typescript
console.time("compile");
await compile();
console.timeEnd("compile");
```
