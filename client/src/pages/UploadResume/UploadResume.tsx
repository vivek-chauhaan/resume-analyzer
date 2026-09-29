import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { uploadResume, clearResumeError } from "../../features/resume/resumeSlice";
import UploadBox from "../../components/upload/UploadBox";

export default function UploadResume() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status, error } = useAppSelector((state) => state.resume);

  const handleFile = async (file: File) => {
    dispatch(clearResumeError());
    const result = await dispatch(uploadResume(file));
    if (uploadResume.fulfilled.match(result)) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen px-6 py-10 max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Upload your resume</h1>

      {error && (
        <p className="mb-4 text-sm text-red-400 bg-red-950/40 border border-red-900 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <UploadBox onFileSelected={handleFile} disabled={status === "loading"} />

      {status === "loading" && (
        <p className="mt-4 text-sm text-slate-400">Uploading and extracting text…</p>
      )}
    </div>
  );
}
