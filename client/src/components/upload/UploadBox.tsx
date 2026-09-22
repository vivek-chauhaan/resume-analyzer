import { useRef, useState, DragEvent } from "react";

interface UploadBoxProps {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
}

export default function UploadBox({ onFileSelected, disabled }: UploadBoxProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  function validateAndSelect(file: File | undefined) {
    if (!file) return;
    if (file.type !== "application/pdf") {
      setLocalError("Only PDF files are accepted.");
      return;
    }
    setLocalError(null);
    onFileSelected(file);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    validateAndSelect(e.dataTransfer.files[0]);
  }

  return (
    <div>
      <div
        onClick={() => !disabled && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`cursor-pointer rounded-2xl border-2 border-dashed px-6 py-12 text-center transition
          ${isDragging ? "border-cyan-400 bg-cyan-950/20" : "border-slate-700 hover:border-slate-500"}
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <p className="text-slate-300 font-medium">Drop your resume here, or click to browse</p>
        <p className="text-slate-500 text-sm mt-1">PDF only</p>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          disabled={disabled}
          onChange={(e) => validateAndSelect(e.target.files?.[0])}
        />
      </div>
      {localError && <p className="mt-2 text-sm text-red-400">{localError}</p>}
    </div>
  );
}
