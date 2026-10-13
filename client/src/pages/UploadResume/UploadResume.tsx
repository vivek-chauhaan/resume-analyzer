import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { uploadResume, clearResumeError } from "../../features/resume/resumeSlice";
import UploadBox from "../../components/upload/UploadBox";
import LoadingState from "../../components/ui/LoadingState";

export default function UploadResume() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status, error } = useAppSelector((state) => state.resume);

  const handleFile = async (file: File) => {
    dispatch(clearResumeError());
    const result = await dispatch(uploadResume(file));
    if (uploadResume.fulfilled.match(result)) {
      toast.success("Resume uploaded successfully");
      navigate("/dashboard");
    }
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-10 sm:px-6">
      <h1 className="mb-2 text-2xl font-semibold">Upload your resume</h1>
      <p className="mb-6 text-sm text-slate-400">
        Add a PDF to your account, then open its report from the dashboard.
      </p>

      {error && (
        <p
          role="alert"
          className="mb-4 text-sm text-red-400 bg-red-950/40 border border-red-900 rounded-lg px-3 py-2"
        >
          {error}
        </p>
      )}

      <div data-aos="fade-up">
        <UploadBox onFileSelected={handleFile} disabled={status === "loading"} />
      </div>

      {status === "loading" && (
        <LoadingState message="Uploading and extracting text…" className="py-8" />
      )}
    </div>
  );
}
