import initSwc, { transformSync } from "@swc/wasm-web";

// Configuration for SWC compiler specific to Revideo
export const REVIDEO_SWC_CONFIG = {
  jsc: {
    parser: {
      syntax: "typescript" as const,
      tsx: true,
      decorators: true,
    },
    transform: {
      react: {
        runtime: "automatic",
        importSource: "@revideo/2d/lib",
        throwIfNamespace: true,
        development: false,
        useSpread: true,
      },
      legacyDecorator: true,
      decoratorMetadata: true,
    },
    target: "es2022",
    loose: true,
    externalHelpers: false, // Inline helpers
    keepClassNames: true,
  },
  module: {
    type: "commonjs",
    strict: false,
    strictMode: false,
    lazy: false,
    noInterop: false,
  },
  minify: false,
  isModule: true,
  sourceMaps: false,
} as const;

let initialized = false;
let swcTransform: typeof transformSync;

export async function initialize() {
  if (!initialized) {
    await initSwc();
    swcTransform = transformSync;
    initialized = true;
  }
}

export async function transform(code: string): Promise<string> {
  if (!initialized) {
    await initialize();
  }

  try {
    const result = swcTransform(code, REVIDEO_SWC_CONFIG);

    // Convert CommonJS to ESM
    const esmCode = result.code
      .replace("exports.default =", "export default")
      .replace(/require\(['"](.*)['"]\)/g, (_, p1) => `import('${p1}')`);

    return esmCode;
  } catch (err) {
    console.error("Failed to transform code:", err);
    throw err;
  }
}
