import { useRef, useState, DragEvent, KeyboardEvent } from "react";
import { AlertCircle, UploadCloud } from "lucide-react";

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

  // Make the drop zone usable with the keyboard
  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (disabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      inputRef.current?.click();
    }
  }

  return (
    <div>
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        aria-label="Upload resume PDF. Drop a file here or press Enter to browse."
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={handleKeyDown}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`cursor-pointer rounded-2xl border-2 border-dashed px-4 py-10 text-center transition sm:px-6 sm:py-12
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400
          ${isDragging ? "border-cyan-400 bg-cyan-950/20" : "border-slate-700 hover:border-slate-500"}
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <UploadCloud
          className={`mx-auto mb-3 h-10 w-10 transition-colors ${
            isDragging ? "text-cyan-400" : "text-slate-500"
          }`}
          aria-hidden="true"
        />
        <p className="text-slate-300 font-medium">Drop your resume here, or click to browse</p>
        <p className="text-slate-500 text-sm mt-1">PDF only</p>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          tabIndex={-1}
          disabled={disabled}
          onChange={(e) => validateAndSelect(e.target.files?.[0])}
        />
      </div>
      {localError && (
        <p role="alert" className="mt-2 flex items-center gap-1.5 text-sm text-red-400">
          <AlertCircle className="h-4 w-4" aria-hidden="true" />
          {localError}
        </p>
      )}
    </div>
  );
}
