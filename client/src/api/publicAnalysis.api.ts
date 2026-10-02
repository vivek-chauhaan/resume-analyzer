import axios from "axios";

const publicApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
});

export async function analyzeGuestResumeRequest(file: File) {
  const formData = new FormData();
  formData.append("resume", file);

  const res = await publicApi.post("/public/analyze", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
}
