import * as revideo2DComponents from "@revideo/2d/lib/components";
import * as revideo2DCurves from "@revideo/2d/lib/curves";
import * as revideo2DDecorators from "@revideo/2d/lib/decorators";
import * as revideo2DPartials from "@revideo/2d/lib/partials";
import * as revideo2DScenes from "@revideo/2d/lib/scenes";
import * as revideo2DUtils from "@revideo/2d/lib/utils";

export const revideo2DResolver = {
  ...revideo2DComponents,
  ...revideo2DCurves,
  ...revideo2DDecorators,
  ...revideo2DPartials,
  ...revideo2DScenes,
  ...revideo2DUtils,
};
