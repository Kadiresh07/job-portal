"use client";
import { useState } from "react";
import Button from "@/components/ui/Button";
import { applicationApi } from "@/services/api";

export default function ApplyModal({ jobId, jobTitle, onClose, onSuccess }) {
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resume) return setError("Please upload your resume");
    setLoading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("resume", resume);
      fd.append("coverLetter", coverLetter);
      await applicationApi.apply(jobId, fd);
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl w-full max-w-md shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div>
            <h2 className="font-bold text-slate-900">Apply for this role</h2>
            <p className="text-sm text-slate-500 mt-0.5 truncate">{jobTitle}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl leading-none p-1">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg">{error}</div>
          )}

          {/* Resume upload */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700">Resume *</label>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl p-6 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
              {resume ? (
                <div className="text-center">
                  <p className="text-2xl mb-1">📄</p>
                  <p className="text-sm font-medium text-slate-800">{resume.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{(resume.size / 1024).toFixed(0)} KB</p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-2xl mb-2">📎</p>
                  <p className="text-sm text-slate-600 font-medium">Click to upload resume</p>
                  <p className="text-xs text-slate-400 mt-1">PDF or Word, max 5MB</p>
                </div>
              )}
              <input
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setResume(e.target.files[0])}
              />
            </label>
          </div>

          {/* Cover letter */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700">Cover Letter (optional)</label>
            <textarea
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none"
              rows={4}
              placeholder="Tell the employer why you're a great fit..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
            />
          </div>

          <div className="flex gap-3 mt-1">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? "Submitting..." : "Submit Application"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
