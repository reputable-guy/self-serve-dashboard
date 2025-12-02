"use client";

import { useCallback, useState } from "react";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          onChange(event.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    [onChange]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          onChange(event.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    [onChange]
  );

  const handleRemove = useCallback(() => {
    onChange("");
  }, [onChange]);

  if (value) {
    return (
      <div className="relative w-full aspect-video rounded-lg overflow-hidden border bg-muted">
        <img
          src={value}
          alt="Product preview"
          className="w-full h-full object-cover"
        />
        <button
          type="button"
          onClick={handleRemove}
          className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <label
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "flex flex-col items-center justify-center w-full aspect-video rounded-lg border-2 border-dashed cursor-pointer transition-colors",
        isDragging
          ? "border-[#00D1C1] bg-[#00D1C1]/5"
          : "border-muted-foreground/25 hover:border-muted-foreground/50 bg-muted/50"
      )}
    >
      <div className="flex flex-col items-center justify-center py-6">
        <Upload className="h-10 w-10 text-muted-foreground mb-3" />
        <p className="text-sm font-medium text-foreground mb-1">
          Upload product image
        </p>
        <p className="text-xs text-muted-foreground">
          Drag and drop or click to browse
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          JPG, PNG, or WebP
        </p>
      </div>
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />
    </label>
  );
}
