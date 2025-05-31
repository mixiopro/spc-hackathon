"use client";

import { makeProject, Project, SceneDescription } from "@revideo/core";
import initSwc, { transformSync } from "@swc/wasm-web";

import { CompileOptions } from "../../types/parameters";
import { RevideoModuleProxy } from "./module-proxy";
import { REVIDEO_SWC_CONFIG } from "./transform";

export class RevideoCompiler {
  private moduleProxy: RevideoModuleProxy;
  private transform: any;
  private swcConfig = REVIDEO_SWC_CONFIG;
  private initialized = false;
  private readyCallbacks: Array<() => void> = [];
  protected globals: Record<string, any> = {};

  constructor() {
    this.moduleProxy = new RevideoModuleProxy();
  }

  setGlobals(globals: Record<string, any> = {}) {
    this.globals = globals;
  }

  async processScene(code: string): Promise<SceneDescription<any>> {
    if (!this.initialized) throw new Error("Compiler not initialized");

    try {
      console.log("Processing scene code...");
      const transformed = this.transform(code, this.swcConfig);
      console.log("Code transformed successfully");

      const context = await this.createExecutionContext();
      console.log("Execution context created");

      const createSceneFunc = this.executeTransformedCode(
        transformed.code,
        context,
      );
      console.log("Code executed, got result:", typeof createSceneFunc);

      if (!createSceneFunc || typeof createSceneFunc !== "object") {
        throw new Error(`Invalid scene export: ${typeof createSceneFunc}`);
      }

      return createSceneFunc as SceneDescription<any>;
    } catch (error) {
      console.error("Scene processing error:", error);
      throw error;
    }
  }

  async processCode(
    code: string,
    options: CompileOptions = {},
  ): Promise<Project> {
    const { parameters = {}, globals = {} } = options;

    console.log("Processing code with parameters:", parameters);
    console.log("Using globals:", this.globals);

    try {
      const createSceneFunc = await this.processScene(code);
      console.log(
        "Scene processed successfully, type:",
        typeof createSceneFunc,
      );

      // const sharedSizeSettings = {
      //   x: this.globals.WIDTH || 480,
      //   y: (this.globals.WIDTH || 480) / (this.globals.ASPECT_RATIO || 9 / 16),
      // };
      // console.log("Using size settings:", sharedSizeSettings);

      console.log("Creating project with scene...");
      const project = makeProject({
        name: "Revideo Demo",
        experimentalFeatures: true,
        scenes: Array.isArray(createSceneFunc)
          ? createSceneFunc
          : [createSceneFunc],
        variables: parameters,
        settings: {
          shared: {
            // size: sharedSizeSettings,
          },
          preview: {
            resolutionScale: 4,
          },
        },
      });

      console.log("Project created successfully");
      return project;
    } catch (error) {
      console.error("Error creating project:", error);
      throw error;
    }
  }

  async initialize() {
    if (this.initialized) return;
    await initSwc();
    this.transform = transformSync;
    this.initialized = true;
    this.readyCallbacks.forEach((callback) => callback());
    this.readyCallbacks = [];
  }

  onReady(callback: () => void) {
    if (this.initialized) callback();
    else this.readyCallbacks.push(callback);
  }

  private async createExecutionContext(): Promise<Record<string, any>> {
    console.log("Creating execution context with globals:", this.globals);

    // Create a clean global context
    const context = {
      require: (moduleName: string) => {
        console.log("Resolving module:", moduleName);
        return this.moduleProxy.resolveModule(moduleName);
      },
      exports: {},
      module: { exports: {} },
      __dirname: "/",
      __filename: "scene.tsx",
      global: {
        ...globalThis,
        ...this.globals,
      },
      process: { env: {} },
      Buffer: {},
      setImmediate: setTimeout,
      clearImmediate: clearTimeout,
    };

    // Add globals directly to the context
    Object.assign(context, this.globals);

    return context;
  }

  private executeTransformedCode(
    code: string,
    context: Record<string, any>,
  ): unknown {
    console.log("Executing transformed code...");

    const wrapper = `
      var module = { exports: {} };
      var exports = module.exports;
      
      try {
        ${code}
        
        console.log('Code executed, checking exports...');
        console.log('Module exports type:', typeof module.exports);
        console.log('Is ES module:', module.exports.__esModule);
        
        if (module.exports.__esModule) {
          console.log('Default export type:', typeof module.exports.default);
          return module.exports.default;
        }
        return module.exports;
      } catch (error) {
        console.error('Error during code execution:', error);
        throw error;
      }
    `;

    const fn = new Function(...Object.keys(context), wrapper);
    return fn(...Object.values(context));
  }
}
