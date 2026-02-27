"use client";

import React, { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Upload, X, Loader2, Download, Sparkles, RefreshCw } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { hasCredits, getRemainingCredits } from "@/lib/credits";
import {
  generateFashionModelImage,
  type GenerationResult,
  type GenerationSettings,
} from "@/lib/mock-ai";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const SUBCATEGORIES: Record<string, string[]> = {
  Women: ["Saree", "Kurti", "Lehenga", "Dress", "Western"],
  Men: ["Shirt", "Blazer", "Suit", "Ethnic", "Casual"],
  Kids: ["Boys", "Girls", "Unisex"],
};

const BACKGROUNDS = ["Studio White", "Studio Gray", "Outdoor", "Custom"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_TYPES = ["image/jpeg", "image/png"];

function FileUpload({
  label,
  required,
  preview,
  onFile,
  onClear,
}: {
  label: string;
  required?: boolean;
  preview: string | null;
  onFile: (dataUrl: string) => void;
  onClear: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!ACCEPTED_TYPES.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Only JPG and PNG files are accepted.",
          variant: "destructive",
        });
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "File too large",
          description: "Maximum file size is 10MB.",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = () => onFile(reader.result as string);
      reader.readAsDataURL(file);
    },
    [onFile, toast]
  );

  return (
    <div>
      <Label className="mb-2 block">
        {label}
        {required && <span className="text-red-400"> *</span>}
      </Label>
      {preview ? (
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg border border-white/10">
          <Image
            src={preview}
            alt={label}
            fill
            className="object-cover"
            unoptimized
          />
          <button
            onClick={() => {
              onClear();
              if (inputRef.current) inputRef.current.value = "";
            }}
            className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex aspect-[3/4] w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-white/10 bg-white/5 text-white/40 transition-colors hover:border-[#D4AF37]/40 hover:text-white/60"
        >
          <Upload className="h-8 w-8" />
          <span className="text-sm">Click to upload</span>
          <span className="text-xs">JPG, PNG — Max 10MB</span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}

export default function GeneratePage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);

  const [category, setCategory] = useState("Women");
  const [subcategory, setSubcategory] = useState("Saree");
  const [background, setBackground] = useState("Studio White");
  const [resolution, setResolution] = useState<"2K" | "4K">("2K");
  const [modelType, setModelType] = useState<"Indian" | "International">("Indian");
  const [modelConsistency, setModelConsistency] = useState(false);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);

  if (!user) return null;

  const remaining = getRemainingCredits(user.total_credits, user.used_credits);

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setSubcategory(SUBCATEGORIES[value][0]);
  };

  const handleGenerate = async () => {
    if (!frontImage) {
      toast({
        title: "Front image required",
        description: "Please upload a front product image before generating.",
        variant: "destructive",
      });
      return;
    }

    if (!hasCredits(user.total_credits, user.used_credits)) {
      toast({
        title: "No credits remaining",
        description: "Please purchase more credits to continue generating.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const settings: GenerationSettings = {
        category,
        subcategory,
        background,
        resolution,
        modelType,
        modelConsistency,
      };

      const generated = await generateFashionModelImage(frontImage, settings);
      setResult(generated);

      // Deduct 1 credit (update localStorage directly for mock)
      const updated = {
        ...user,
        used_credits: user.used_credits + 1,
      };
      localStorage.setItem("iconic-ai-studio-user", JSON.stringify(updated));
      // Force re-render by reloading auth state
      window.dispatchEvent(new Event("storage"));

      toast({
        title: "Image generated!",
        description: `Seed ID: ${generated.seedId}`,
      });
    } catch {
      toast({
        title: "Generation failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const link = document.createElement("a");
    link.href = result.imageUrl;
    link.download = `iconic-ai-${result.seedId}.png`;
    link.target = "_blank";
    link.click();
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-playfair text-3xl font-bold text-white">
            Generate
          </h1>
          <p className="mt-1 text-white/60">
            Create AI fashion model images from your product photos
          </p>
        </div>
        <Badge variant="outline" className="border-[#D4AF37]/40 text-[#D4AF37]">
          {remaining} credits remaining
        </Badge>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left column: Upload + Options */}
        <div className="space-y-6">
          {/* Upload section */}
          <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-lg">Product Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <FileUpload
                  label="Front Image"
                  required
                  preview={frontImage}
                  onFile={setFrontImage}
                  onClear={() => setFrontImage(null)}
                />
                <FileUpload
                  label="Back Image"
                  preview={backImage}
                  onFile={setBackImage}
                  onClear={() => setBackImage(null)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Options section */}
          <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-lg">Generation Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="mb-2 block">Category</Label>
                  <Select value={category} onValueChange={handleCategoryChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(SUBCATEGORIES).map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-2 block">Subcategory</Label>
                  <Select value={subcategory} onValueChange={setSubcategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SUBCATEGORIES[category].map((sub) => (
                        <SelectItem key={sub} value={sub}>
                          {sub}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="mb-2 block">Background</Label>
                <Select value={background} onValueChange={setBackground}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BACKGROUNDS.map((bg) => (
                      <SelectItem key={bg} value={bg}>
                        {bg}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="mb-2 block">Resolution</Label>
                  <Select
                    value={resolution}
                    onValueChange={(v) => setResolution(v as "2K" | "4K")}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2K">2K</SelectItem>
                      <SelectItem value="4K">4K</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-2 block">Model Type</Label>
                  <Select
                    value={modelType}
                    onValueChange={(v) =>
                      setModelType(v as "Indian" | "International")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Indian">Indian</SelectItem>
                      <SelectItem value="International">International</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3">
                <Label>Model Consistency</Label>
                <Switch
                  checked={modelConsistency}
                  onCheckedChange={setModelConsistency}
                />
              </div>
            </CardContent>
          </Card>

          {/* Generate button */}
          <Button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full gap-2 py-6 text-base"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                Generate Image — {remaining} credits left
              </>
            )}
          </Button>
        </div>

        {/* Right column: Result */}
        <div>
          <Card
            className={cn(
              "border-white/10 bg-white/5 backdrop-blur-xl",
              !result && !loading && "flex min-h-[600px] items-center justify-center"
            )}
          >
            {loading ? (
              <CardContent className="flex min-h-[600px] flex-col items-center justify-center gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-[#D4AF37]" />
                <p className="text-white/60">
                  Generating your fashion model image...
                </p>
                <p className="text-sm text-white/40">
                  This may take a few seconds
                </p>
              </CardContent>
            ) : result ? (
              <>
                <CardHeader>
                  <CardTitle className="text-lg">Generated Result</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg border border-white/10">
                    <Image
                      src={result.imageUrl}
                      alt="Generated fashion model"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <p className="text-xs text-white/40">
                    Seed ID: {result.seedId}
                  </p>
                  <div className="flex gap-3">
                    <Button onClick={handleDownload} className="flex-1 gap-2">
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => setResult(null)}
                      className="flex-1 gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Generate Another
                    </Button>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="text-center">
                <div className="mb-4 flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-white/5">
                  <Sparkles className="h-8 w-8 text-white/20" />
                </div>
                <p className="text-white/60">Your generated image will appear here</p>
                <p className="mt-1 text-sm text-white/40">
                  Upload a product image and click Generate
                </p>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
