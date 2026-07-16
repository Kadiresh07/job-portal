"use client";
import { useEffect, useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Link from "next/link";
import { dashboardApi, jobsApi, companyApi } from "@/services/api";
import { useFetch } from "@/hooks/useFetch";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function EmployerDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [showJobForm, setShowJobForm] = useState(false);
  const [showCompanyForm, setShowCompanyForm] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.push("/auth/login");
  }, [user, authLoading, router]);

  const { data, loading, refetch } = useFetch(() => dashboardApi.employer(), [user]);

  const stats = data?.stats || {};
  const recentJobs = data?.recentJobs || [];

  if (authLoading || loading) return (
    <PageLayout><div className="flex justify-center py-32"><Spinner size="lg" /></div></PageLayout>
  );

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!data?.company ? (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center max-w-xl mx-auto my-12 shadow-sm">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </div>
            </div>
            <h2 className="text-lg font-bold text-amber-800">Company Profile Required</h2>
            <p className="text-amber-700 text-sm mt-2 leading-relaxed">
              Before posting a job, you must create a company profile so candidates can see information about your company.
            </p>
            <Button className="mt-5 bg-amber-600 hover:bg-amber-700 text-white" onClick={() => setShowCompanyForm(true)}>
              Create Company Profile
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Employer Dashboard</h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-slate-500">Managing jobs for</span>
                  <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                    </svg>
                    {data.company.name}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 text-green-500">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </span>
                </div>
              </div>
              <Button onClick={() => setShowJobForm(true)}>+ Post a Job</Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <StatCard label="Total Jobs" value={stats.totalJobs || 0} color="blue" />
              <StatCard label="Open Jobs" value={stats.openJobs || 0} color="green" />
              <StatCard label="Closed Jobs" value={stats.closedJobs || 0} color="gray" />
              <StatCard label="Applications" value={stats.totalApplications || 0} color="purple" />
            </div>

            {/* Recent jobs */}
            <div className="bg-white rounded-xl border border-slate-200">
              <div className="flex items-center justify-between p-5 border-b border-slate-100">
                <h2 className="font-semibold text-slate-900">Recent Job Postings</h2>
              </div>
              {recentJobs.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-12 text-slate-400">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </div>
                  <p className="text-sm">No jobs posted yet</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {recentJobs.map((job) => (
                    <div key={job._id} className="p-5 flex items-center justify-between gap-4 flex-wrap">
                      <div>
                        <Link href={`/jobs/${job._id}`} className="font-medium text-sm text-slate-900 hover:text-blue-600">
                          {job.title}
                        </Link>
                        <p className="text-xs text-slate-500 mt-0.5">{job.location} · {job.employmentType}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge color={job.status === "Open" ? "green" : "red"}>{job.status}</Badge>
                        <Button size="sm" variant="ghost" onClick={async () => {
                          await jobsApi.close(job._id);
                          refetch();
                        }}>
                          Close
                        </Button>
                        <Button size="sm" variant="danger" onClick={async () => {
                          await jobsApi.delete(job._id);
                          refetch();
                        }}>
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {showJobForm && (
          <PostJobModal onClose={() => setShowJobForm(false)} onSuccess={() => { setShowJobForm(false); refetch(); }} />
        )}

        {showCompanyForm && (
          <CreateCompanyModal onClose={() => setShowCompanyForm(false)} onSuccess={() => { setShowCompanyForm(false); refetch(); }} />
        )}
      </div>
    </PageLayout>
  );
}

function CreateCompanyModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: "", description: "", website: "", location: "", industry: "", size: "1-10"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await companyApi.create(form);
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="font-bold text-slate-900">Create Company Profile</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors" aria-label="Close">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          {error && <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">{error}</p>}
          <Input label="Company Name" placeholder="e.g. Innov2Grow" value={form.name} onChange={(e) => set("name", e.target.value)} required />
          <Input label="Industry" placeholder="e.g. Technology, Finance, Healthcare" value={form.industry} onChange={(e) => set("industry", e.target.value)} />
          <Input label="Location" placeholder="e.g. Bangalore, India" value={form.location} onChange={(e) => set("location", e.target.value)} />
          <Input label="Website" placeholder="e.g. https://innov2grow.com" value={form.website} onChange={(e) => set("website", e.target.value)} />
          
          <Select label="Company Size" value={form.size} onChange={(e) => set("size", e.target.value)}>
            <option>1-10</option>
            <option>11-50</option>
            <option>51-200</option>
            <option>201-500</option>
            <option>500+</option>
          </Select>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700">About the Company</label>
            <textarea
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none"
              rows={4}
              placeholder="What does your company do?"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </div>

          <div className="flex gap-3 mt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="flex-1" disabled={loading}>{loading ? "Creating..." : "Create Profile"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function PostJobModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    title: "", location: "", workMode: "Remote", employmentType: "Full-time",
    experience: "", salary: "", description: "", skills: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await jobsApi.create({ ...form, skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean) });
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="font-bold text-slate-900">Post a New Job</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors" aria-label="Close">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          {error && <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">{error}</p>}
          <Input label="Job Title" placeholder="e.g. Frontend Developer" value={form.title} onChange={(e) => set("title", e.target.value)} required />
          <Input label="Location" placeholder="e.g. Bangalore or Remote" value={form.location} onChange={(e) => set("location", e.target.value)} required />
          <div className="grid grid-cols-2 gap-4">
            <Select label="Work Mode" value={form.workMode} onChange={(e) => set("workMode", e.target.value)}>
              <option>Remote</option><option>Hybrid</option><option>Onsite</option>
            </Select>
            <Select label="Employment Type" value={form.employmentType} onChange={(e) => set("employmentType", e.target.value)}>
              <option>Full-time</option><option>Part-time</option><option>Internship</option><option>Contract</option>
            </Select>
          </div>
          <Input label="Experience" placeholder="e.g. 1-3 years" value={form.experience} onChange={(e) => set("experience", e.target.value)} required />
          <Input label="Salary (optional)" placeholder="e.g. ₹8-12 LPA" value={form.salary} onChange={(e) => set("salary", e.target.value)} />
          <Input label="Skills (comma separated)" placeholder="React, Node.js, MongoDB" value={form.skills} onChange={(e) => set("skills", e.target.value)} />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700">Description</label>
            <textarea
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none"
              rows={4}
              placeholder="Job description..."
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              required
            />
          </div>
          <div className="flex gap-3 mt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="flex-1" disabled={loading}>{loading ? "Posting..." : "Post Job"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }) {
  const bg = { blue: "bg-blue-50 text-blue-700", green: "bg-green-50 text-green-700", purple: "bg-purple-50 text-purple-700", gray: "bg-slate-50 text-slate-600" };
  return (
    <div className={`rounded-xl p-5 ${bg[color] || bg.gray}`}>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm mt-1 opacity-80">{label}</p>
    </div>
  );
}
