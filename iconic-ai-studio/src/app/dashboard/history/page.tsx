"use client";

import { useState } from "react";
import Image from "next/image";
import { Download, ImageIcon, PackageOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
      "https://placehold.co/512x768/1a1a2e/D4AF37?text=Fashion+Model&font=playfair-display",
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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-playfair text-3xl font-bold text-white">
            History
          </h1>
          <p className="mt-1 text-white/60">
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
        <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
              <ImageIcon className="h-8 w-8 text-white/20" />
            </div>
            <p className="text-white/60">No generations yet. Start creating!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Card
              key={item.id}
              className="group overflow-hidden border-white/10 bg-white/5 backdrop-blur-xl"
            >
              <div className="relative aspect-[2/3] w-full overflow-hidden">
                <Image
                  src={item.imageUrl}
                  alt="Generated image"
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  unoptimized
                />
              </div>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-white/60">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {item.category}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {item.resolution}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownload(item)}
                    className="text-white/60 hover:text-white"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
