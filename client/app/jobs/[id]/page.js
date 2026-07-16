"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PageLayout from "@/components/layout/PageLayout";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import ApplyModal from "@/components/jobs/ApplyModal";
import { jobsApi } from "@/services/api";
import { useFetch } from "@/hooks/useFetch";
import { useAuth } from "@/context/AuthContext";

const workModeColor = { Remote: "green", Hybrid: "blue", Onsite: "purple" };

export default function JobDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [showApply, setShowApply] = useState(false);
  const [applied, setApplied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const { data, loading, error } = useFetch(() => jobsApi.getOne(id), [id]);
  const job = data?.job;

  const handleApplyClick = () => {
    if (!user) return router.push("/auth/login");
    setShowApply(true);
  };

  const handleSave = async () => {
    if (!user) return router.push("/auth/login");
    setSaving(true);
    try {
      saved ? await jobsApi.unsave(id) : await jobsApi.save(id);
      setSaved((s) => !s);
    } catch (_) {}
    setSaving(false);
  };

  if (loading) return (
    <PageLayout><div className="flex justify-center py-32"><Spinner size="lg" /></div></PageLayout>
  );

  if (error || !job) return (
    <PageLayout>
      <div className="text-center py-32">
        <p className="text-4xl mb-3">😕</p>
        <p className="text-slate-500">{error || "Job not found"}</p>
        <button onClick={() => router.back()} className="text-blue-600 text-sm mt-3 hover:underline">
          ← Go back
        </button>
      </div>
    </PageLayout>
  );

  const company = job.company || {};

  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main */}
          <div className="flex-1 flex flex-col gap-5">
            {/* Header */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl flex-shrink-0">
                  {company.name?.[0] || "J"}
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl font-bold text-slate-900 leading-tight">{job.title}</h1>
                  <p className="text-slate-500 mt-0.5 text-sm">{company.name}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge color={workModeColor[job.workMode] || "gray"}>{job.workMode}</Badge>
                    <Badge color="blue">{job.employmentType}</Badge>
                    {job.status === "Closed" && <Badge color="red">Closed</Badge>}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick details */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-5 gap-x-4 pb-6 mb-6 border-b border-slate-100">
                <Detail label="Location" value={`📍 ${job.location}`} />
                <Detail label="Experience" value={job.experience} />
                <Detail label="Salary" value={job.salary || "Not Disclosed"} />
                {job.deadline && (
                  <Detail
                    label="Deadline"
                    value={new Date(job.deadline).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  />
                )}
              </div>

              <h2 className="font-semibold text-slate-900 mb-3">Job Description</h2>
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{job.description}</p>

              {job.skills?.length > 0 && (
                <div className="mt-6">
                  <h2 className="font-semibold text-slate-900 mb-3">Required Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((s) => (
                      <span key={s} className="bg-slate-100 text-slate-700 text-xs px-3 py-1 rounded-full font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {job.benefits?.length > 0 && (
                <div className="mt-6">
                  <h2 className="font-semibold text-slate-900 mb-3">Benefits</h2>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {job.benefits.map((b) => (
                      <li key={b} className="text-sm text-slate-600 flex items-center gap-2">
                        <span className="text-green-500 flex-shrink-0">✓</span> {b}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0 flex flex-col gap-4">
            {/* Action card */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-3 lg:sticky lg:top-20">
              {applied ? (
                <div className="text-center py-3 bg-green-50 rounded-lg">
                  <p className="text-green-600 font-medium text-sm">✅ Application submitted!</p>
                </div>
              ) : (
                <Button
                  className="w-full"
                  disabled={job.status === "Closed"}
                  onClick={handleApplyClick}
                >
                  {job.status === "Closed" ? "Job Closed" : "Apply Now"}
                </Button>
              )}
              <Button
                variant="outline"
                className="w-full"
                disabled={saving}
                onClick={handleSave}
              >
                {saved ? "✓ Saved" : "🔖 Save Job"}
              </Button>
              <p className="text-center text-xs text-slate-400">
                Posted {new Date(job.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
              </p>
            </div>

            {/* Company card */}
            {company.name && (
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <h3 className="font-semibold text-slate-900 mb-3 text-sm">About the Company</h3>
                <p className="text-sm font-medium text-slate-800">{company.name}</p>
                {company.industry && <p className="text-xs text-slate-500 mt-1">{company.industry}</p>}
                {company.size && <p className="text-xs text-slate-500 mt-0.5">{company.size} employees</p>}
                {company.location && <p className="text-xs text-slate-500 mt-0.5">📍 {company.location}</p>}
                {company.description && (
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-3">{company.description}</p>
                )}
                {company.website && (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-blue-600 hover:underline mt-2 block"
                  >
                    Visit website →
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {showApply && (
        <ApplyModal
          jobId={id}
          jobTitle={job.title}
          onClose={() => setShowApply(false)}
          onSuccess={() => { setShowApply(false); setApplied(true); }}
        />
      )}
    </PageLayout>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-0.5">{label}</p>
      <p className="text-sm font-medium text-slate-800">{value}</p>
    </div>
  );
}
