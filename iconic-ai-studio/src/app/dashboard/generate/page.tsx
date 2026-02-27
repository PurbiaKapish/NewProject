"use client";

import React, { useState, useRef, useCallback } from "react";
import Image from "next/image";
import {
  Upload,
  X,
  Loader2,
  Download,
  Sparkles,
  RefreshCw,
  Copy,
  Send,
  RotateCcw,
  Save,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { hasCredits, getRemainingCredits, getCreditsForResolution } from "@/lib/credits";
import {
  generateFashionModelImage,
  generateMagicPrompt,
  type GenerationResult,
  type GenerationSettings,
} from "@/lib/mock-ai";
import { useToast } from "@/hooks/use-toast";
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
import { cn } from "@/lib/utils";

const SUBCATEGORIES: Record<string, string[]> = {
  Women: ["Saree", "Kurti", "Lehenga", "Dress", "Western"],
  Men: ["Shirt", "Blazer", "Suit", "Ethnic", "Casual"],
  Kids: ["Boys", "Girls", "Unisex"],
};

const BACKGROUNDS = [
  "Studio White",
  "Studio Black",
  "Indoor",
  "Outdoor",
  "Nature",
  "Office",
  "Home Interior",
  "Street",
  "Luxury Studio",
  "Custom Background",
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_TYPES = ["image/jpeg", "image/png"];

const IMAGE_DIMENSIONS = [
  { label: "1:1", w: 1024, h: 1024 },
  { label: "4:3", w: 1024, h: 768 },
  { label: "3:4", w: 768, h: 1024 },
  { label: "16:9", w: 1024, h: 576 },
  { label: "9:16", w: 576, h: 1024 },
];

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
  const [dragOver, setDragOver] = useState(false);
  const { toast } = useToast();

  const processFile = useCallback(
    (file: File) => {
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

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  return (
    <div>
      <Label className="mb-2 block text-xs text-white/40">
        {label}
        {required && <span className="text-red-400"> *</span>}
      </Label>
      {preview ? (
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-[#22c55e]/30 glow-green-sm">
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
            className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            "flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed transition-all",
            dragOver
              ? "border-[#22c55e] bg-[#22c55e]/5 text-[#22c55e]"
              : required
                ? "border-[#22c55e]/20 bg-[#151922] text-white/30 hover:border-[#22c55e]/40 hover:text-white/50"
                : "border-white/[0.08] bg-[#151922] text-white/20 hover:border-[#22c55e]/30 hover:text-white/40"
          )}
        >
          <Upload className="h-6 w-6" />
          <span className="text-xs">
            {dragOver ? "Drop here" : "Click or drag to upload"}
          </span>
          {required && !dragOver && (
            <span className="text-[10px] text-[#22c55e]/60">Required</span>
          )}
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
  const [modelType, setModelType] = useState<"Indian" | "International">(
    "Indian"
  );
  const [modelConsistency, setModelConsistency] = useState(false);
  const [smoothing, setSmoothing] = useState(false);
  const [numImages, setNumImages] = useState(1);
  const [selectedDim, setSelectedDim] = useState(0);
  const [prompt, setPrompt] = useState("");
  const [customBackground, setCustomBackground] = useState("");

  const [loading, setLoading] = useState(false);
  const [magicLoading, setMagicLoading] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);

  if (!user) return null;

  const remaining = getRemainingCredits(user.total_credits, user.used_credits);

  const creditCost = getCreditsForResolution(resolution);

  const resolvedBackground =
    background === "Custom Background"
      ? customBackground.trim() || "Studio White"
      : background;

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setSubcategory(SUBCATEGORIES[value][0]);
  };

  const handleMagicPrompt = async () => {
    setMagicLoading(true);
    try {
      // Simulate brief processing delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      const settings: GenerationSettings = {
        category,
        subcategory,
        background: resolvedBackground,
        resolution,
        modelType,
        modelConsistency,
      };
      const enhanced = generateMagicPrompt(settings);
      setPrompt(enhanced);
      toast({
        title: "Prompt enhanced!",
        description: "Magic prompt has been generated and inserted.",
      });
    } finally {
      setMagicLoading(false);
    }
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

    if (!hasCredits(user.total_credits, user.used_credits, resolution)) {
      toast({
        title: "Not enough credits",
        description: `You need ${creditCost} credits for ${resolution} generation. Please purchase more.`,
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
        background: resolvedBackground,
        resolution,
        modelType,
        modelConsistency,
        prompt,
      };

      const generated = await generateFashionModelImage(frontImage, settings);
      setResult(generated);

      const updated = {
        ...user,
        used_credits: user.used_credits + creditCost,
      };
      localStorage.setItem("iconic-ai-studio-user", JSON.stringify(updated));
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

  const handleReset = () => {
    setCategory("Women");
    setSubcategory("Saree");
    setBackground("Studio White");
    setCustomBackground("");
    setResolution("2K");
    setModelType("Indian");
    setModelConsistency(false);
    setSmoothing(false);
    setNumImages(1);
    setSelectedDim(0);
    setPrompt("");
  };

  return (
    <div className="flex gap-6">
      {/* Center Content Area */}
      <div className="min-w-0 flex-1 space-y-5">
        {/* Image preview grid */}
        <div className="grid grid-cols-3 gap-3">
          {/* Upload slots */}
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

          {/* Result or placeholder */}
          <div>
            <Label className="mb-2 block text-xs text-white/40">Result</Label>
            {loading ? (
              <div className="flex aspect-square w-full items-center justify-center rounded-2xl border border-white/[0.06] bg-[#151922]">
                <Loader2 className="h-8 w-8 animate-spin text-[#22c55e]" />
              </div>
            ) : result ? (
              <div className="group relative aspect-square w-full overflow-hidden rounded-2xl border border-[#22c55e]/30 glow-green">
                <Image
                  src={result.imageUrl}
                  alt="Generated"
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="flex gap-2 pb-3">
                    <button
                      onClick={handleDownload}
                      className="rounded-lg bg-white/20 p-2 text-white backdrop-blur-sm hover:bg-white/30"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setResult(null)}
                      className="rounded-lg bg-white/20 p-2 text-white backdrop-blur-sm hover:bg-white/30"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-2xl border border-white/[0.06] bg-[#151922]">
                <Sparkles className="h-6 w-6 text-white/10" />
                <span className="text-[10px] text-white/15">Output</span>
              </div>
            )}
          </div>
        </div>

        {/* Text prompt area */}
        <div className="rounded-2xl border border-white/[0.06] bg-[#151922] p-4">
          <div className="flex items-center justify-between mb-2">
            <Label className="text-xs text-white/30">Prompt</Label>
            <button
              onClick={() => {
                if (prompt) navigator.clipboard.writeText(prompt);
              }}
              className="text-white/20 hover:text-white/50"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
          </div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your desired fashion model image... e.g. 'A professional Indian model wearing the saree in a studio setting with soft lighting'"
            className="w-full resize-none rounded-xl bg-white/[0.03] p-3 text-sm text-white placeholder:text-white/15 focus:outline-none focus:ring-1 focus:ring-[#22c55e]/30"
            rows={3}
          />
          <div className="mt-2 flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleMagicPrompt}
              disabled={magicLoading}
              className="gap-1.5 text-xs border-white/[0.08] text-white/40 hover:text-[#22c55e] hover:border-[#22c55e]/30 transition-colors"
            >
              {magicLoading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Sparkles className="h-3 w-3" />
              )}
              {magicLoading ? "Enhancing..." : "Magic Prompt"}
            </Button>
          </div>
        </div>

        {/* Send bar */}
        <div className="flex gap-3">
          <div className="flex flex-1 items-center gap-2 rounded-2xl border border-white/[0.06] bg-[#151922] px-4 py-3">
            <input
              type="text"
              placeholder="Quick message or adjustments..."
              className="flex-1 bg-transparent text-sm text-white placeholder:text-white/20 focus:outline-none"
            />
            <button className="text-white/20 hover:text-[#22c55e]">
              <Send className="h-4 w-4" />
            </button>
          </div>
          <Button
            onClick={handleGenerate}
            disabled={loading || !frontImage}
            className="gap-2 rounded-2xl px-6 transition-all"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {loading ? "Generating..." : `Generate (${creditCost} cr · ${remaining} left)`}
          </Button>
        </div>

        {result && (
          <p className="text-[10px] text-white/20">
            Seed ID: {result.seedId}
          </p>
        )}
      </div>

      {/* Right Settings Panel */}
      <div className="hidden w-[300px] shrink-0 lg:block">
        <div className="rounded-2xl border border-white/[0.06] bg-[#151922] p-5 space-y-5">
          {/* Number of Images */}
          <div>
            <Label className="mb-2.5 block text-xs font-medium text-white/30 uppercase tracking-wider">
              Number of Images
            </Label>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4].map((n) => (
                <button
                  key={n}
                  onClick={() => setNumImages(n)}
                  className={cn(
                    "flex-1 rounded-xl py-2 text-xs font-medium transition-all",
                    numImages === n
                      ? "bg-[#22c55e]/15 text-[#22c55e] glow-green-sm"
                      : "bg-white/[0.03] text-white/30 hover:bg-white/[0.06] hover:text-white/50"
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Image Dimensions */}
          <div>
            <Label className="mb-2.5 block text-xs font-medium text-white/30 uppercase tracking-wider">
              Image Dimension
            </Label>
            <div className="flex flex-wrap gap-1.5">
              {IMAGE_DIMENSIONS.map((dim, i) => (
                <button
                  key={dim.label}
                  onClick={() => setSelectedDim(i)}
                  className={cn(
                    "rounded-xl px-3 py-2 text-xs font-medium transition-all",
                    selectedDim === i
                      ? "bg-[#22c55e]/15 text-[#22c55e] glow-green-sm"
                      : "bg-white/[0.03] text-white/30 hover:bg-white/[0.06] hover:text-white/50"
                  )}
                >
                  {dim.label}
                </button>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-[10px] text-white/20">Width</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="256"
                    max="2048"
                    step="64"
                    value={IMAGE_DIMENSIONS[selectedDim].w}
                    readOnly
                    className="h-1 flex-1 appearance-none rounded-full bg-white/10 accent-[#22c55e]"
                  />
                  <span className="text-xs text-white/30 w-8">{IMAGE_DIMENSIONS[selectedDim].w}</span>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-[10px] text-white/20">Height</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="256"
                    max="2048"
                    step="64"
                    value={IMAGE_DIMENSIONS[selectedDim].h}
                    readOnly
                    className="h-1 flex-1 appearance-none rounded-full bg-white/10 accent-[#22c55e]"
                  />
                  <span className="text-xs text-white/30 w-8">{IMAGE_DIMENSIONS[selectedDim].h}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Category & Model */}
          <div>
            <Label className="mb-2.5 block text-xs font-medium text-white/30 uppercase tracking-wider">
              Category
            </Label>
            <Select value={category} onValueChange={handleCategoryChange}>
              <SelectTrigger className="rounded-xl border-white/[0.06] bg-white/[0.03] text-white/70">
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
            <Label className="mb-2.5 block text-xs font-medium text-white/30 uppercase tracking-wider">
              Subcategory
            </Label>
            <Select value={subcategory} onValueChange={setSubcategory}>
              <SelectTrigger className="rounded-xl border-white/[0.06] bg-white/[0.03] text-white/70">
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

          <div>
            <Label className="mb-2.5 block text-xs font-medium text-white/30 uppercase tracking-wider">
              Background
            </Label>
            <Select value={background} onValueChange={setBackground}>
              <SelectTrigger className="rounded-xl border-white/[0.06] bg-white/[0.03] text-white/70">
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
            {background === "Custom Background" && (
              <input
                type="text"
                value={customBackground}
                onChange={(e) => setCustomBackground(e.target.value)}
                placeholder="Describe your background..."
                className="mt-2 w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-[#22c55e]/30"
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="mb-2 block text-[10px] text-white/20">Resolution</Label>
              <Select
                value={resolution}
                onValueChange={(v) => setResolution(v as "2K" | "4K")}
              >
                <SelectTrigger className="rounded-xl border-white/[0.06] bg-white/[0.03] text-white/70 h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2K">2K ({getCreditsForResolution("2K")} cr)</SelectItem>
                  <SelectItem value="4K">4K ({getCreditsForResolution("4K")} cr)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-2 block text-[10px] text-white/20">Model Type</Label>
              <Select
                value={modelType}
                onValueChange={(v) =>
                  setModelType(v as "Indian" | "International")
                }
              >
                <SelectTrigger className="rounded-xl border-white/[0.06] bg-white/[0.03] text-white/70 h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Indian">Indian</SelectItem>
                  <SelectItem value="International">International</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-xl bg-white/[0.03] px-3 py-2.5">
              <span className="text-xs text-white/40">Model Consistency</span>
              <Switch
                checked={modelConsistency}
                onCheckedChange={setModelConsistency}
              />
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white/[0.03] px-3 py-2.5">
              <span className="text-xs text-white/40">Smoothing Image</span>
              <Switch
                checked={smoothing}
                onCheckedChange={setSmoothing}
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              className="flex-1 gap-1.5 text-xs border-white/[0.06]"
              onClick={handleReset}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </Button>
            <Button className="flex-1 gap-1.5 text-xs">
              <Save className="h-3.5 w-3.5" />
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
