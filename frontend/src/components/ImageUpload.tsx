'use client';

import { useCallback, useRef, useState } from 'react';
import { FiUploadCloud, FiX, FiImage } from 'react-icons/fi';

interface ImageUploadProps {
  onChange?: (files: File[]) => void;
}

const MAX_FILES = 10;
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

interface PreviewFile {
  file: File;
  preview: string;
  progress: number;
}

export default function ImageUpload({ onChange }: ImageUploadProps) {
  const [previews, setPreviews] = useState<PreviewFile[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const simulateProgress = (index: number) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }
      setPreviews((prev) =>
        prev.map((item, i) => (i === index ? { ...item, progress } : item)),
      );
    }, 200);
  };

  const processFiles = useCallback(
    (incoming: FileList | File[]) => {
      const fileArray = Array.from(incoming);
      const newErrors: string[] = [];
      const valid: File[] = [];

      fileArray.forEach((file) => {
        if (!ACCEPTED_TYPES.includes(file.type)) {
          newErrors.push(`"${file.name}" is not a supported image format.`);
          return;
        }
        if (file.size > MAX_SIZE_BYTES) {
          newErrors.push(`"${file.name}" exceeds the 5MB size limit.`);
          return;
        }
        valid.push(file);
      });

      setErrors(newErrors);

      setPreviews((prev) => {
        const remaining = MAX_FILES - prev.length;
        if (remaining <= 0) {
          setErrors((e) => [...e, `Maximum ${MAX_FILES} images allowed.`]);
          return prev;
        }
        const toAdd = valid.slice(0, remaining);
        const newPreviews: PreviewFile[] = toAdd.map((file) => ({
          file,
          preview: URL.createObjectURL(file),
          progress: 0,
        }));

        const startIndex = prev.length;
        newPreviews.forEach((_, i) => simulateProgress(startIndex + i));

        const updated = [...prev, ...newPreviews];
        onChange?.(updated.map((p) => p.file));
        return updated;
      });
    },
    [onChange],
  );

  const removeImage = (index: number) => {
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      const updated = prev.filter((_, i) => i !== index);
      onChange?.(updated.map((p) => p.file));
      return updated;
    });
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    processFiles(e.dataTransfer.files);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processFiles(e.target.files);
    e.target.value = '';
  };

  return (
    <div className="space-y-3">
      <div
        role="button"
        tabIndex={0}
        className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 transition-colors ${
          dragOver ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 bg-slate-50 hover:border-indigo-400 hover:bg-indigo-50/40'
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
      >
        <FiUploadCloud className="h-8 w-8 text-indigo-400" />
        <div className="text-center">
          <p className="text-sm font-medium text-slate-700">
            Drag &amp; drop images here, or{' '}
            <span className="text-indigo-600 underline">browse</span>
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Up to {MAX_FILES} images · Max 5MB each · JPEG, PNG, GIF, WebP
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPTED_TYPES.join(',')}
          className="hidden"
          onChange={onInputChange}
        />
      </div>

      {errors.length > 0 && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
          {errors.map((err, i) => (
            <p key={i}>{err}</p>
          ))}
        </div>
      )}

      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
          {previews.map((item, index) => (
            <div key={item.preview} className="relative overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
              {item.preview ? (
                <img
                  src={item.preview}
                  alt={`Preview ${index + 1}`}
                  className="h-24 w-full object-cover"
                />
              ) : (
                <div className="flex h-24 items-center justify-center">
                  <FiImage className="h-6 w-6 text-slate-400" />
                </div>
              )}
              {item.progress < 100 && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-200">
                  <div
                    className="h-full bg-indigo-500 transition-all duration-200"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              )}
              <button
                type="button"
                className="absolute right-1 top-1 rounded-full bg-white/80 p-0.5 text-slate-600 shadow hover:bg-white hover:text-rose-600"
                onClick={(e) => { e.stopPropagation(); removeImage(index); }}
              >
                <FiX className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
