import { ModuleExports } from "@/lib/types/index";
import { ModuleProxySystem } from "../base/module-proxy";
import { jsxRuntimeResolver, revideo2DResolver, revideoCoreResolver } from "./resolvers";

export class RevideoModuleProxy extends ModuleProxySystem {
  constructor() {
    super();
    this.addResolvers({
      "@revideo/2d": () => revideo2DResolver,
      "@revideo/core": () => revideoCoreResolver,
      "@revideo/2d/jsx-runtime": () => jsxRuntimeResolver,
      "@revideo/2d/lib/jsx-runtime": () => jsxRuntimeResolver,
    });
  }
}
