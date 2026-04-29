"use client";

import { useState } from "react";

const PLACEHOLDER_URL = "https://placehold.co/400x300/f97316/ffffff?text=Demo";

export function useImageUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadImage = async (_file: File): Promise<string> => {
    setIsUploading(true);
    setUploadProgress(0);
    await new Promise((r) => setTimeout(r, 600)); // simulate upload delay
    setUploadProgress(100);
    setIsUploading(false);
    setTimeout(() => setUploadProgress(0), 1000);
    return PLACEHOLDER_URL;
  };

  const deleteImage = async (_imageUrl: string): Promise<void> => {
    // no-op in demo
  };

  return { uploadImage, deleteImage, isUploading, uploadProgress };
}
