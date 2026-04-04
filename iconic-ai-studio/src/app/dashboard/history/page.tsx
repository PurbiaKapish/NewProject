"use client";

import { useState } from "react";
import Image from "next/image";
import { Download, ImageIcon, PackageOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface HistoryItem {
  id: string;
  imageUrl: string;
  category: string;
  resolution: "2K" | "4K";
  createdAt: string;
}

const DEMO_ITEMS: HistoryItem[] = [
  {
    id: "demo-1",
    imageUrl:
      "https://placehold.co/512x768/151922/22c55e?text=Fashion+Model&font=roboto",
    category: "Women — Saree",
    resolution: "2K",
    createdAt: new Date().toISOString(),
  },
];

export default function HistoryPage() {
  const { toast } = useToast();
  const [items] = useState<HistoryItem[]>(DEMO_ITEMS);

  const handleBulkDownload = () => {
    toast({
      title: "Bulk Download",
      description: "Bulk download creates a ZIP of all images",
    });
  };

  const handleDownload = (item: HistoryItem) => {
    const link = document.createElement("a");
    link.href = item.imageUrl;
    link.download = `iconic-ai-${item.id}.png`;
    link.target = "_blank";
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">History</h1>
          <p className="mt-1 text-sm text-white/40">
            Browse your previously generated images
          </p>
        </div>
        <Button
          variant="secondary"
          className="gap-2"
          onClick={handleBulkDownload}
        >
          <PackageOpen className="h-4 w-4" />
          Bulk Download
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.06] bg-[#151922] py-16">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-white/5">
            <ImageIcon className="h-7 w-7 text-white/10" />
          </div>
          <p className="text-sm text-white/30">No generations yet. Start creating!</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="group overflow-hidden rounded-2xl border border-white/[0.06] bg-[#151922] transition-all hover:border-white/10"
            >
              <div className="relative aspect-[2/3] w-full overflow-hidden">
                <Image
                  src={item.imageUrl}
                  alt="Generated image"
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  unoptimized
                />
                <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => handleDownload(item)}
                    className="mb-4 rounded-lg bg-white/20 p-2.5 text-white backdrop-blur-sm hover:bg-white/30"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs text-white/30">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                    <div className="flex gap-2">
                      <span className="rounded-lg bg-white/5 px-2 py-0.5 text-[10px] text-white/40">
                        {item.category}
                      </span>
                      <span className="rounded-lg bg-[#22c55e]/10 px-2 py-0.5 text-[10px] text-[#22c55e]">
                        {item.resolution}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownload(item)}
                    className="rounded-lg p-2 text-white/20 hover:bg-white/5 hover:text-white/50"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
