"use client";
import { useEffect, useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import Spinner from "@/components/ui/Spinner";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { dashboardApi, adminApi, jobsApi } from "@/services/api";
import { useFetch } from "@/hooks/useFetch";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

/* ─── SVG Icon Library ──────────────────────────────────────── */
const Icons = {
  Users: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  Briefcase: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
    </svg>
  ),
  ClipboardList: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
      <rect x="9" y="3" width="6" height="4" rx="1"/>
      <path d="M9 12h6M9 16h4"/>
    </svg>
  ),
  Building: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  PenLine: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M12 20h9"/>
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
    </svg>
  ),
  LayoutDashboard: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
  Plus: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  Tool: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
    </svg>
  ),
  ShieldAlert: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  CheckCircle: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
};

/* ─── Tab Config ────────────────────────────────────────────── */
const TAB_CONFIG = [
  { label: "Dashboard", Icon: Icons.LayoutDashboard },
  { label: "Post Job",  Icon: Icons.PenLine },
  { label: "Jobs",      Icon: Icons.Briefcase },
  { label: "Applications", Icon: Icons.ClipboardList },
  { label: "Users",     Icon: Icons.Users },
  { label: "Companies", Icon: Icons.Building },
  { label: "Job Scraper", Icon: Icons.Tool },
];

/* ─── Main Component ────────────────────────────────────────── */
export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Dashboard");

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) router.push("/");
  }, [user, authLoading, router]);

  const { data: statsData, loading: statsLoading } = useFetch(() => dashboardApi.admin(), [user]);
  const { data: appsData, loading: appsLoading } = useFetch(() => adminApi.getApplications(), [user]);
  const { data: companiesData, loading: companiesLoading } = useFetch(() => adminApi.getCompanies(), [user]);
  const { data: jobsData, loading: jobsLoading, refetch: refetchJobs } = useFetch(() => adminApi.getJobs(), [user]);

  if (authLoading || statsLoading) return (
    <PageLayout><div className="flex justify-center py-32"><Spinner size="lg" /></div></PageLayout>
  );

  const stats = statsData?.stats || {};
  const usersByRole = statsData?.usersByRole || [];
  const applications = appsData?.applications || [];
  const companies = companiesData?.companies || [];
  const jobs = jobsData?.jobs || [];

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
            <Icons.ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 leading-none">Admin Panel</h1>
            <p className="text-sm text-slate-500 mt-0.5">Full platform control</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 mb-8 overflow-x-auto">
          {TAB_CONFIG.map(({ label, Icon }) => (
            <button
              key={label}
              onClick={() => setActiveTab(label)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                activeTab === label
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              }`}
            >
              <Icon />
              {label}
            </button>
          ))}
        </div>

        {/* ── Dashboard Tab ── */}
        {activeTab === "Dashboard" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatCard label="Total Users"   value={stats.totalUsers || 0}        color="blue"   Icon={Icons.Users} />
              <StatCard label="Total Jobs"    value={stats.totalJobs || 0}         color="green"  Icon={Icons.Briefcase} />
              <StatCard label="Applications"  value={stats.totalApplications || 0} color="purple" Icon={Icons.ClipboardList} />
              <StatCard label="Companies"     value={stats.totalCompanies || 0}    color="yellow" Icon={Icons.Building} />
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="font-semibold text-slate-900 mb-5">Users by Role</h2>
              <div className="flex flex-col gap-4">
                {usersByRole.map((r) => (
                  <div key={r._id} className="flex items-center gap-4">
                    <span className="text-sm text-slate-700 capitalize w-20">{r._id}</span>
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-2 bg-blue-500 rounded-full transition-all"
                        style={{ width: `${Math.min(100, (r.count / (stats.totalUsers || 1)) * 100)}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-slate-900 w-6 text-right">{r.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Post Job Tab ── */}
        {activeTab === "Post Job" && (
          <div className="max-w-2xl">
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center text-white">
                  <Icons.PenLine />
                </div>
                <div>
                  <h2 className="font-bold text-white text-lg leading-none">Post a New Job</h2>
                  <p className="text-blue-100 text-sm mt-0.5">Create a job posting under any registered company</p>
                </div>
              </div>
              <div className="p-6">
                {companiesLoading ? (
                  <div className="flex justify-center py-8"><Spinner /></div>
                ) : companies.length === 0 ? (
                  <div className="text-center py-10 text-slate-500 flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                      <Icons.Building />
                    </div>
                    <p className="font-medium text-slate-700">No companies registered yet</p>
                    <p className="text-sm">Create a company first before posting jobs.</p>
                  </div>
                ) : (
                  <PostJobForm
                    companies={companies}
                    onSuccess={() => { setActiveTab("Jobs"); refetchJobs(); }}
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Jobs Tab ── */}
        {activeTab === "Jobs" && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-slate-900">All Jobs ({jobs.length})</h2>
              <button
                onClick={() => setActiveTab("Post Job")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
              >
                <Icons.Plus /> Post Job
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                    <th className="px-6 py-3 font-medium">Title</th>
                    <th className="px-6 py-3 font-medium">Company</th>
                    <th className="px-6 py-3 font-medium">Location</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobsLoading ? (
                    <tr><td colSpan="5" className="py-8 text-center"><Spinner /></td></tr>
                  ) : jobs.length === 0 ? (
                    <tr>
                      <td colSpan="5">
                        <EmptyState Icon={Icons.Briefcase} message="No jobs found." />
                      </td>
                    </tr>
                  ) : jobs.map((job) => (
                    <tr key={job._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">{job.title}</td>
                      <td className="px-6 py-4 text-slate-600">{job.company?.name || "N/A"}</td>
                      <td className="px-6 py-4 text-slate-600">{job.location}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          job.status === "Open" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-3">
                          {job.status === "Open" && (
                            <button
                              onClick={async () => { await jobsApi.close(job._id); refetchJobs(); }}
                              className="text-xs text-amber-600 hover:text-amber-800 font-medium transition-colors"
                            >
                              Close
                            </button>
                          )}
                          <button
                            onClick={async () => { await jobsApi.delete(job._id); refetchJobs(); }}
                            className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Applications Tab ── */}
        {activeTab === "Applications" && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-slate-900">All Applications ({applications.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                    <th className="px-6 py-3 font-medium">Candidate</th>
                    <th className="px-6 py-3 font-medium">Company</th>
                    <th className="px-6 py-3 font-medium">Job</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium">Applied Date</th>
                  </tr>
                </thead>
                <tbody>
                  {appsLoading ? (
                    <tr><td colSpan="5" className="py-8 text-center"><Spinner /></td></tr>
                  ) : applications.length === 0 ? (
                    <tr>
                      <td colSpan="5">
                        <EmptyState Icon={Icons.ClipboardList} message="No applications yet." />
                      </td>
                    </tr>
                  ) : applications.map((app) => (
                    <tr key={app._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">{app.candidate?.name || "Unknown"}</td>
                      <td className="px-6 py-4 text-slate-600">{app.job?.company?.name || "N/A"}</td>
                      <td className="px-6 py-4 text-slate-900">{app.job?.title || "N/A"}</td>
                      <td className="px-6 py-4"><StatusBadge status={app.status} /></td>
                      <td className="px-6 py-4 text-slate-500">
                        {new Date(app.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Placeholder Tabs ── */}
        {["Users", "Companies", "Job Scraper"].includes(activeTab) && (
          <EmptyState
            Icon={Icons.Tool}
            message={`${activeTab} panel coming soon...`}
            className="py-16 bg-slate-50 rounded-xl border border-dashed border-slate-300"
          />
        )}
      </div>
    </PageLayout>
  );
}

/* ─── Post Job Form ─────────────────────────────────────────── */
function PostJobForm({ companies, onSuccess }) {
  const [form, setForm] = useState({
    companyId: companies[0]?._id || "",
    title: "", location: "", workMode: "Remote",
    employmentType: "Full-time", experience: "",
    salary: "", skills: "", description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(""); setSuccessMsg("");
    try {
      await jobsApi.create({
        ...form,
        skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
      });
      setSuccessMsg("Job posted successfully!");
      setForm({ companyId: companies[0]?._id || "", title: "", location: "", workMode: "Remote", employmentType: "Full-time", experience: "", salary: "", skills: "", description: "" });
      setTimeout(onSuccess, 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 p-3 rounded-lg">{error}</p>
      )}
      {successMsg && (
        <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-100 p-3 rounded-lg">
          <Icons.CheckCircle />{successMsg}
        </div>
      )}

      {/* Company Selector */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
          <Icons.Building />
          Post Under Company
        </label>
        <select
          value={form.companyId}
          onChange={(e) => set("companyId", e.target.value)}
          required
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          {companies.map((c) => (
            <option key={c._id} value={c._id}>{c.name} — {c.location || "No location"}</option>
          ))}
        </select>
      </div>

      <Input label="Job Title *" placeholder="e.g. Full Stack Developer" value={form.title} onChange={(e) => set("title", e.target.value)} required />
      <Input label="Location *" placeholder="e.g. Bangalore or Remote" value={form.location} onChange={(e) => set("location", e.target.value)} required />

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">Work Mode</label>
          <select value={form.workMode} onChange={(e) => set("workMode", e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200">
            <option>Remote</option><option>Hybrid</option><option>Onsite</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">Employment Type</label>
          <select value={form.employmentType} onChange={(e) => set("employmentType", e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200">
            <option>Full-time</option><option>Part-time</option><option>Internship</option><option>Contract</option>
          </select>
        </div>
      </div>

      <Input label="Experience *" placeholder="e.g. 1-3 years" value={form.experience} onChange={(e) => set("experience", e.target.value)} required />
      <Input label="Salary (optional)" placeholder="e.g. ₹8-12 LPA" value={form.salary} onChange={(e) => set("salary", e.target.value)} />
      <Input label="Skills (comma separated)" placeholder="React, Node.js, MongoDB" value={form.skills} onChange={(e) => set("skills", e.target.value)} />

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-700">Job Description *</label>
        <textarea
          rows={5}
          placeholder="Describe the role, responsibilities and requirements..."
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          required
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
      >
        {loading ? (
          <><Spinner size="sm" /> Posting Job...</>
        ) : (
          <><Icons.PenLine /> Post Job</>
        )}
      </button>
    </form>
  );
}

/* ─── Helpers ───────────────────────────────────────────────── */
function EmptyState({ Icon, message, className = "" }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 py-12 text-slate-500 ${className}`}>
      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
        <Icon />
      </div>
      <p className="font-medium text-sm">{message}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    Pending:     "bg-yellow-100 text-yellow-800",
    Shortlisted: "bg-blue-100 text-blue-800",
    Reviewed:    "bg-indigo-100 text-indigo-800",
    Hired:       "bg-green-100 text-green-800",
    Rejected:    "bg-red-100 text-red-800",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${map[status] || "bg-slate-100 text-slate-700"}`}>
      {status}
    </span>
  );
}

function StatCard({ label, value, color, Icon }) {
  const styles = {
    blue:   { card: "bg-blue-50 border-blue-100",   text: "text-blue-700",   icon: "bg-blue-100 text-blue-600" },
    green:  { card: "bg-green-50 border-green-100",  text: "text-green-700",  icon: "bg-green-100 text-green-600" },
    purple: { card: "bg-purple-50 border-purple-100",text: "text-purple-700", icon: "bg-purple-100 text-purple-600" },
    yellow: { card: "bg-yellow-50 border-yellow-100",text: "text-yellow-700", icon: "bg-yellow-100 text-yellow-600" },
  };
  const s = styles[color] || styles.blue;
  return (
    <div className={`rounded-xl border p-5 ${s.card}`}>
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${s.icon}`}>
        <Icon />
      </div>
      <p className={`text-2xl font-bold ${s.text}`}>{value}</p>
      <p className={`text-sm mt-1 ${s.text} opacity-80`}>{label}</p>
    </div>
  );
}
