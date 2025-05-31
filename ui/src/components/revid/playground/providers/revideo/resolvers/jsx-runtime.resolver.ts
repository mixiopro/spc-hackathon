import * as revideo2DJsxRuntime from "@revideo/2d/lib/jsx-runtime";

export const jsxRuntimeResolver = {
  ...revideo2DJsxRuntime,
  Fragment: Symbol.for("@revideo/2d/fragment"),
};
