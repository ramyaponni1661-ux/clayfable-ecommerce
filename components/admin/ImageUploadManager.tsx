"use client";

import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import {
  Upload,
  X,
  Image as ImageIcon,
  File,
  Camera,
  Loader2,
  Move,
  Eye,
  Trash2,
  Download,
  RotateCw,
  Crop,
  Maximize2
} from 'lucide-react';

interface ImageFile {
  id: string;
  file?: File;
  url: string;
  name: string;
  size: number;
  type: string;
  isUploaded: boolean;
  uploadProgress?: number;
  alt?: string;
  caption?: string;
}

interface ImageUploadManagerProps {
  images: ImageFile[];
  onImagesChange: (images: ImageFile[]) => void;
  maxFiles?: number;
  maxFileSize?: number; // in MB
  acceptedTypes?: string[];
  uploadEndpoint?: string;
  className?: string;
}

const ImageUploadManager: React.FC<ImageUploadManagerProps> = ({
  images,
  onImagesChange,
  maxFiles = 10,
  maxFileSize = 5,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  uploadEndpoint = '/api/admin/upload',
  className = ''
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounterRef = useRef(0);

  // Generate unique ID for images
  const generateId = () => `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Validate file
  const validateFile = (file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `File type ${file.type} is not supported. Please use: ${acceptedTypes.join(', ')}`;
    }
    if (file.size > maxFileSize * 1024 * 1024) {
      return `File size must be less than ${maxFileSize}MB`;
    }
    return null;
  };

  // Upload file to server
  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'product-image');

    const response = await fetch(uploadEndpoint, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return data.url;
  };

  // Process files
  const processFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);

    if (images.length + fileArray.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} images allowed`);
      return;
    }

    const validFiles: File[] = [];
    const errors: string[] = [];

    // Validate all files first
    fileArray.forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    });

    // Show validation errors
    if (errors.length > 0) {
      errors.forEach(error => toast.error(error));
      if (validFiles.length === 0) return;
    }

    setIsUploading(true);

    // Create temporary image objects
    const newImages: ImageFile[] = validFiles.map(file => ({
      id: generateId(),
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      type: file.type,
      isUploaded: false,
      uploadProgress: 0
    }));

    // Add to state immediately for preview
    onImagesChange([...images, ...newImages]);

    // Upload files one by one
    for (let i = 0; i < newImages.length; i++) {
      const imageObj = newImages[i];

      try {
        // Simulate progress
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 50));

          const updatedImages = [...images, ...newImages];
          const currentIndex = images.length + i;
          updatedImages[currentIndex] = {
            ...updatedImages[currentIndex],
            uploadProgress: progress
          };
          onImagesChange(updatedImages);
        }

        // Actually upload the file to Supabase Storage
        const uploadedUrl = await uploadFile(imageObj.file!);

        // Update with final uploaded URL
        const finalImages = [...images, ...newImages];
        const currentIndex = images.length + i;
        finalImages[currentIndex] = {
          ...finalImages[currentIndex],
          url: uploadedUrl,
          isUploaded: true,
          uploadProgress: undefined
        };
        onImagesChange(finalImages);

        toast.success(`${imageObj.name} uploaded successfully`);
      } catch (error) {
        console.error('Upload failed:', error);
        toast.error(`Failed to upload ${imageObj.name}`);

        // Remove failed upload
        const filteredImages = images.filter(img => img.id !== imageObj.id);
        onImagesChange(filteredImages);
      }
    }

    setIsUploading(false);
  };

  // Drag handlers
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current--;
    if (dragCounterRef.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounterRef.current = 0;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  }, [images, maxFiles]);

  // File input handler
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
      e.target.value = ''; // Reset input
    }
  };

  // Remove image
  const removeImage = (imageId: string) => {
    const updatedImages = images.filter(img => img.id !== imageId);
    onImagesChange(updatedImages);
    toast.success('Image removed');
  };

  // Reorder images
  const moveImage = (fromIndex: number, toIndex: number) => {
    const reorderedImages = [...images];
    const [movedImage] = reorderedImages.splice(fromIndex, 1);
    reorderedImages.splice(toIndex, 0, movedImage);
    onImagesChange(reorderedImages);
  };

  // Update image metadata
  const updateImageMeta = (imageId: string, updates: Partial<ImageFile>) => {
    const updatedImages = images.map(img =>
      img.id === imageId ? { ...img, ...updates } : img
    );
    onImagesChange(updatedImages);
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className={`border-orange-200 ${className}`}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Product Images ({images.length}/{maxFiles})
          </CardTitle>
          {images.length > 0 && (
            <Badge variant="outline" className="gap-1">
              {images.filter(img => img.isUploaded).length} uploaded
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Upload Area */}
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
            isDragging
              ? 'border-orange-500 bg-orange-50 scale-105'
              : images.length >= maxFiles
                ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                : 'border-orange-300 hover:border-orange-400 hover:bg-orange-50 cursor-pointer'
          }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => {
            if (images.length < maxFiles && !isUploading) {
              fileInputRef.current?.click();
            }
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={acceptedTypes.join(',')}
            onChange={handleFileInput}
            className="hidden"
            disabled={images.length >= maxFiles || isUploading}
          />

          {isUploading ? (
            <div className="space-y-2">
              <Loader2 className="h-8 w-8 animate-spin text-orange-500 mx-auto" />
              <p className="text-sm text-gray-600">Uploading images...</p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex justify-center">
                {isDragging ? (
                  <Camera className="h-8 w-8 text-orange-500" />
                ) : (
                  <Upload className="h-8 w-8 text-orange-400" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">
                  {images.length >= maxFiles
                    ? `Maximum ${maxFiles} images reached`
                    : isDragging
                      ? 'Drop your images here'
                      : 'Drop images here or click to browse'
                  }
                </p>
                {images.length < maxFiles && (
                  <p className="text-xs text-gray-500 mt-1">
                    Supports: {acceptedTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')}
                    • Max {maxFileSize}MB each
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Image Grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div
                key={image.id}
                className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200"
              >
                {/* Image Preview */}
                <div className="aspect-square relative bg-gray-50">
                  <img
                    src={image.url}
                    alt={image.alt || image.name}
                    className="w-full h-full object-cover"
                  />

                  {/* Upload Progress */}
                  {image.uploadProgress !== undefined && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-xs font-medium text-gray-700">
                            {image.uploadProgress}%
                          </div>
                          <Progress
                            value={image.uploadProgress}
                            className="w-8 h-1 mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Status Badge */}
                  {image.isUploaded && (
                    <Badge className="absolute top-2 left-2 bg-green-500 text-white text-xs">
                      ✓ Uploaded
                    </Badge>
                  )}

                  {/* Primary Image Badge */}
                  {index === 0 && (
                    <Badge className="absolute top-2 right-2 bg-orange-500 text-white text-xs">
                      Primary
                    </Badge>
                  )}

                  {/* Action Buttons */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedImageId(image.id);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      {index > 0 && (
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            moveImage(index, index - 1);
                          }}
                        >
                          <Move className="h-4 w-4" />
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="destructive"
                        className="h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(image.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Image Info */}
                <div className="p-2">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-700 truncate">
                        {image.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(image.size)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      {image.type.includes('jpeg') && <Badge variant="outline" className="text-xs px-1">JPG</Badge>}
                      {image.type.includes('png') && <Badge variant="outline" className="text-xs px-1">PNG</Badge>}
                      {image.type.includes('webp') && <Badge variant="outline" className="text-xs px-1">WEBP</Badge>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upload Tips */}
        {images.length === 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-orange-800 mb-2">Image Upload Tips</h4>
            <ul className="text-xs text-orange-700 space-y-1">
              <li>• Use high-quality images for better product presentation</li>
              <li>• The first image will be used as the primary product image</li>
              <li>• Drag and drop to reorder images</li>
              <li>• Recommended size: 1200x1200px or larger</li>
              <li>• Supported formats: JPEG, PNG, WebP, GIF</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageUploadManager;