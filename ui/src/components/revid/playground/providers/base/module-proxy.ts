import { ModuleExports, ModuleResolver } from "@/lib/types/index";

type ModuleResolvers = Record<string, () => ModuleExports>;

export class ModuleProxySystem {
  private resolvers: ModuleResolvers = {};
  private cache: Map<string, ModuleExports> = new Map();

  addResolvers(resolvers: ModuleResolvers) {
    this.resolvers = { ...this.resolvers, ...resolvers };
  }

  resolveModule(moduleName: string): ModuleExports {
    // Check cache first
    const cached = this.cache.get(moduleName);
    if (cached) {
      return cached;
    }

    // Get resolver
    const resolver = this.resolvers[moduleName];
    if (!resolver) {
      throw new Error(`Module not found: ${moduleName}`);
    }

    // Resolve and cache
    const resolved = resolver();
    this.cache.set(moduleName, resolved);
    return resolved;
  }
}
