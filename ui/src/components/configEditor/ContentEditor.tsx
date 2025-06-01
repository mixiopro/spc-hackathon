import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import React from "react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { DemoConfig } from "./DemoConfigEditor";

interface ContentEditorProps {
  form: UseFormReturn<DemoConfig>;
}

export const ContentEditor: React.FC<ContentEditorProps> = ({ form }) => {
  const { register, control, watch, formState } = form;
  const contentValues = watch("content");

  const { fields, append, remove } = useFieldArray({
    control,
    name: "content.overlays.loadingSteps",
  });

  const addLoadingStep = () => {
    append({ name: "" });
  };

  const formatLabel = (key: string) => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  };

  return (
    <div className="space-y-6">
      <Card className="bg-background border-border">
        <CardHeader>
          <CardTitle className="text-lg text-foreground flex items-center gap-2">
            🎬 Intro Text
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Configure the introductory text lines
          </CardDescription>
        </CardHeader>
        <CardContent className="bg-background">
          <div className="space-y-4">
            {Object.entries(contentValues.intro).map(([key, value], index) => (
              <div key={key}>
                <Label htmlFor={`intro-${key}`} className="text-foreground">
                  {formatLabel(key)}
                </Label>
                <Input
                  id={`intro-${key}`}
                  {...register(`content.intro.${key}` as any)}
                  placeholder={`${formatLabel(key)} of intro`}
                  className="text-lg font-semibold bg-muted border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-background border-border">
        <CardHeader>
          <CardTitle className="text-lg text-foreground flex items-center gap-2">
            💭 Overlay Content
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Configure overlay text and loading messages
          </CardDescription>
        </CardHeader>
        <CardContent className="bg-background">
          <div className="space-y-6">
            {Object.entries(contentValues.overlays).map(([key, value]) => {
              if (key === "loadingSteps") return null;

              return (
                <div key={key}>
                  <Label htmlFor={key} className="text-foreground">
                    {formatLabel(key)}
                  </Label>
                  <Input
                    id={key}
                    {...register(`content.overlays.${key}` as any)}
                    placeholder={`Text for ${formatLabel(key).toLowerCase()}`}
                    className="bg-muted border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              );
            })}

            <div>
              <Label className="text-base font-medium mb-3 block text-foreground">
                Loading Steps
              </Label>
              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex gap-2 items-center">
                    <div className="flex-1">
                      <Input
                        {...register(
                          `content.overlays.loadingSteps.${index}.name`
                        )}
                        placeholder={`Loading step ${index + 1}`}
                        className="bg-muted border-border text-foreground placeholder:text-muted-foreground"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => remove(index)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={addLoadingStep}
                  className="w-full flex items-center gap-2 border-dashed border-2 bg-muted border-border text-foreground hover:bg-muted/80"
                >
                  <Plus className="w-4 h-4" />
                  Add Loading Step
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
