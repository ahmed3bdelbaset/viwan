'use client';

import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';

interface ImageUploaderProps {
  label?: string;
  value?: string;
  onChange: (urlOrBase64: string) => void;
  isRtl?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  label = 'IMAGE ASSET',
  value = '',
  onChange,
  isRtl = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [dragOver, setDragOver] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (e.g. up to 8MB)
    if (file.size > 8 * 1024 * 1024) {
      alert(isRtl ? 'حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 8 ميجابايت' : 'File is too large, please select an image under 8MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        onChange(base64);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        onChange(base64);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleClear = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      {/* Label and Mode Switcher */}
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-semibold tracking-wider uppercase text-charcoal block">
          {label}
        </label>
        <div className="flex items-center space-x-1 rtl:space-x-reverse text-[10px]">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-2 py-0.5 transition-colors ${
              mode === 'upload'
                ? 'bg-charcoal text-white font-medium'
                : 'text-stone-500 hover:text-charcoal'
            }`}
          >
            {isRtl ? 'رفع من الجهاز' : 'Upload File'}
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-2 py-0.5 transition-colors ${
              mode === 'url'
                ? 'bg-charcoal text-white font-medium'
                : 'text-stone-500 hover:text-charcoal'
            }`}
          >
            {isRtl ? 'رابط مباشر (URL)' : 'Image URL'}
          </button>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {value ? (
        /* Image Preview Box */
        <div className="relative aspect-[16/9] w-full bg-stone-900 border border-[#E7E2D8] overflow-hidden group shadow-inner">
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
          />

          {/* Action Overlay */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3 rtl:space-x-reverse">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-white/90 hover:bg-white text-charcoal text-xs px-3.5 py-1.5 font-semibold tracking-wider uppercase transition-colors shadow-sm flex items-center space-x-1.5 rtl:space-x-reverse"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{isRtl ? 'تغيير الصورة' : 'Change Image'}</span>
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="bg-red-700 hover:bg-red-600 text-white text-xs px-3.5 py-1.5 font-semibold tracking-wider uppercase transition-colors shadow-sm flex items-center space-x-1.5 rtl:space-x-reverse"
            >
              <X className="w-3.5 h-3.5" />
              <span>{isRtl ? 'حذف' : 'Remove'}</span>
            </button>
          </div>

          <div className="absolute bottom-2 left-2 rtl:left-auto rtl:right-2 bg-black/75 px-2 py-0.5 text-[9px] font-mono text-stone-300 uppercase">
            {isRtl ? 'معاينة الصورة المعتمدة' : 'Active Image Preview'}
          </div>
        </div>
      ) : mode === 'upload' ? (
        /* Drag & Drop Upload Zone */
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-2 bg-[#FAF6EE]/60 hover:bg-white ${
            dragOver ? 'border-gold bg-gold/5' : 'border-[#E7E2D8] hover:border-gold'
          }`}
        >
          <div className="w-10 h-10 border border-[#E7E2D8] bg-white flex items-center justify-center text-gold shadow-sm">
            <Upload className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <p className="text-xs font-medium text-charcoal">
              {isRtl
                ? 'اضغط لاختيار صورة من جهازك أو اسحبها وأفلتها هنا'
                : 'Click to select from device or drag and drop image here'}
            </p>
            <p className="text-[10px] text-stone-500 font-light">
              PNG, JPG, WEBP, AVIF (Max 8MB)
            </p>
          </div>
        </div>
      ) : (
        /* Direct URL Input */
        <div className="relative">
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://images.unsplash.com/photo-..."
            className="w-full bg-white border border-[#E7E2D8] focus:border-gold p-2.5 text-xs text-charcoal outline-none transition-colors"
          />
        </div>
      )}
    </div>
  );
};

/**
 * Multi Image Gallery Uploader
 */
export const MultiImageGalleryUploader: React.FC<{
  label?: string;
  images: string[];
  onChange: (images: string[]) => void;
  isRtl?: boolean;
}> = ({
  label = 'PROJECT GALLERY ASSETS',
  images = [],
  onChange,
  isRtl = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newImages: string[] = [];
    let processed = 0;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        if (base64) {
          newImages.push(base64);
        }
        processed++;
        if (processed === files.length) {
          onChange([...images, ...newImages]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemove = (index: number) => {
    const updated = images.filter((_, idx) => idx !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-semibold tracking-wider uppercase text-charcoal block">
          {label} ({images.length} {isRtl ? 'صور' : 'images'})
        </label>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="text-xs text-gold hover:underline font-semibold flex items-center space-x-1 rtl:space-x-reverse"
        >
          <Upload className="w-3 h-3" />
          <span>{isRtl ? 'إضافة صور من الجهاز +' : 'Add Photos +'}</span>
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Grid of uploaded images */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 bg-[#FAF6EE]/50 p-3 border border-[#E7E2D8]">
        {images.map((img, idx) => (
          <div key={idx} className="relative aspect-[4/3] bg-stone-200 border border-[#E7E2D8] overflow-hidden group">
            <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => handleRemove(idx)}
              className="absolute top-1 right-1 rtl:right-auto rtl:left-1 p-1 bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              title="Remove"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        {/* Add photo card trigger */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="aspect-[4/3] border-2 border-dashed border-[#E7E2D8] hover:border-gold flex flex-col items-center justify-center space-y-1 text-stone-400 hover:text-gold transition-colors bg-white"
        >
          <Upload className="w-4 h-4" />
          <span className="text-[10px] font-semibold uppercase">{isRtl ? 'رفع صورة' : 'Upload'}</span>
        </button>
      </div>
    </div>
  );
};
